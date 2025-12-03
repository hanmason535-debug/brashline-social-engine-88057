#!/usr/bin/env bash
# Create products and prices via Stripe MCP JSON-RPC using STRIPE_MCP_KEY
# Requires: curl, jq, and STRIPE_MCP_KEY env var set to a restricted key with products/prices permissions
# Usage: STRIPE_MCP_KEY=<YOUR_RESTRICTED_KEY> ./scripts/mcp_create_products.sh scripts/products.mcp.json

set -euo pipefail
INPUT=${1:-scripts/products.mcp.json}
MCP_URL="https://mcp.stripe.com/"
KEY=${STRIPE_MCP_KEY:-}

if [ -z "$KEY" ]; then
  echo "STRIPE_MCP_KEY not set. Please provide a restricted key in env to use MCP JSON-RPC."
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq not found — please install jq to run this script"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Input file '$INPUT' not found"
  exit 1
fi

# read input
JSON=$(cat "$INPUT")

# loop through products in JSON
products=$(echo "$JSON" | jq -c '.products[]')
RESULTS_FILE="scripts/generated_prices.json"
echo "{\n  \"products\": []\n}" > "$RESULTS_FILE"

echo "🚀 Creating products/prices via Stripe MCP..."

for p in $products; do
  name=$(echo "$p" | jq -r '.name')
  description=$(echo "$p" | jq -r '.description')
  active=$(echo "$p" | jq -r '.active')
  tier=$(echo "$p" | jq -r '.tier')

  # create product via MCP
  payload=$(jq -n --arg name "$name" --arg description "$description" --argjson active $active --arg tier "$tier" '{jsonrpc: "2.0", method: "tools/call", params: { name: "products.create", arguments: { name: $name, description: $description, active: $active, metadata: { app: "brashline", tier: $tier } } }, id: 1 }')

  response=$(curl -sS -X POST "$MCP_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $KEY" -d "$payload")
  product_id=$(echo "$response" | jq -r '.result.id // empty')
  echo "Created product: $name -> $product_id"
  tier=$(echo "$p" | jq -r '.tier')
  # Add product stub into results file (including tier)
  jq --arg id "$product_id" --arg name "$name" --arg tier "$tier" '.products += [{id: $id, name: $name, tier: $tier, prices: []}]' "$RESULTS_FILE" > "$RESULTS_FILE.tmp" && mv "$RESULTS_FILE.tmp" "$RESULTS_FILE"

  # write product id into local JSON for potential mapping (print to stdout)
  echo "$response" | jq -r '.result | {id: .id, name: .name}'>/dev/null

  # iterate prices
  prices=$(echo "$p" | jq -c '.prices[]')
  for pr in $prices; do
    billing=$(echo "$pr" | jq -r '.billing')
    unit_amount=$(echo "$pr" | jq -r '.unit_amount')
    currency=$(echo "$pr" | jq -r '.currency')
    recurring=$(echo "$pr" | jq -c '.recurring')

    # Build price arguments
    if [ "$billing" = "one-time" ]; then
      arguments=$(jq -n --arg product "$product_id" --argjson unit_amount $unit_amount --arg currency "$currency" '{ product: $product, unit_amount: $unit_amount, currency: $currency }')
    else
      # recurring present
      interval=$(echo "$recurring" | jq -r '.interval')
      arguments=$(jq -n --arg product "$product_id" --argjson unit_amount $unit_amount --arg currency "$currency" --arg interval "$interval" '{ product: $product, unit_amount: $unit_amount, currency: $currency, recurring: { interval: $interval } }')
    fi

    payload_price=$(jq -n --argjson args "$arguments" '{jsonrpc: "2.0", method: "tools/call", params: { name: "prices.create", arguments: $args }, id: 2 }')
    resp_price=$(curl -sS -X POST "$MCP_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $KEY" -d "$payload_price")
    price_id=$(echo "$resp_price" | jq -r '.result.id // empty')
    echo "  Price created ($billing): $price_id -> $unit_amount $currency"
    # Update results file (append price to the product by id)
    jq --arg pid "$product_id" --arg priceid "$price_id" --arg billing "$billing" --arg amount "$unit_amount" --arg currency "$currency" '
      (.products[] | select(.id == $pid) | .prices) += [{id: $priceid, billing: $billing, unit_amount: ($amount|tonumber), currency: $currency}]' "$RESULTS_FILE" > "$RESULTS_FILE.tmp" && mv "$RESULTS_FILE.tmp" "$RESULTS_FILE"
  done

  sleep 0.25
done

echo "✅ All products and prices created via MCP. Collect product/price IDs above and paste them into the repo (or share with me)."

exit 0
