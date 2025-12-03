#!/usr/bin/env bash
# Export price IDs in a JSON mapping: { "Product Name": { "monthly": "price_...", "yearly": "price_..." } }
# Requires: jq and STRIPE_MCP_KEY or Stripe CLI

if [ -z "$1" ]; then
  OUTFILE=price-ids.json
else
  OUTFILE=$1
fi

if [ -n "$STRIPE_MCP_KEY" ]; then
  echo "Using STRIPE_MCP_KEY via MCP..."
  PRICES=$(curl -sS https://mcp.stripe.com/ -H "Content-Type: application/json" -H "Authorization: Bearer ${STRIPE_MCP_KEY}" -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"prices.list","arguments":{"limit":100}},"id":1}')
  PRODUCTS=$(curl -sS https://mcp.stripe.com/ -H "Content-Type: application/json" -H "Authorization: Bearer ${STRIPE_MCP_KEY}" -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"products.list","arguments":{"limit":100}},"id":2}')
else
  if ! command -v stripe >/dev/null 2>&1; then
    echo "Please set STRIPE_MCP_KEY or install Stripe CLI"
    exit 1
  fi
  echo "Using Stripe CLI to list prices and products..."
  PRICES=$(stripe prices list --limit 100 --format json)
  PRODUCTS=$(stripe products list --limit 100 --format json)
fi

# Parse and generate mapping
# The MCP response might be JSONRPC wrapper; if it is, extract .result.data
# If it's plain JSON array (CLI), use it directly

if echo "$PRICES" | jq -e 'has("result")' >/dev/null 2>&1; then
  PRICES_DATA=$(echo "$PRICES" | jq -r '.result.data')
else
  PRICES_DATA=$(echo "$PRICES")
fi

if echo "$PRODUCTS" | jq -e 'has("result")' >/dev/null 2>&1; then
  PRODUCTS_DATA=$(echo "$PRODUCTS" | jq -r '.result.data')
else
  PRODUCTS_DATA=$(echo "$PRODUCTS")
fi

# Build mapping: for each product, find monthly/yearly
jq -n --argjson products "${PRODUCTS_DATA}" --argjson prices "${PRICES_DATA}" '
  reduce $products[] as $p ({}; .[$p.name] = {} )
  | reduce $prices[] as $pr (.;
    ($products[] | select(.id == $pr.product) | .name) as $pname |
    if ($pr.recurring and $pr.recurring.interval == "month") then .[$pname].monthly = $pr.id
    elif ($pr.recurring and $pr.recurring.interval == "year") then .[$pname].yearly = $pr.id
    else . end
  )' > "$OUTFILE"

cat "$OUTFILE"

echo "Price mapping saved to $OUTFILE"

echo "You can now run: node ./scripts/apply_price_ids.js $OUTFILE"