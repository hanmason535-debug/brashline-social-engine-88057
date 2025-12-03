#!/usr/bin/env bash
# List Stripe products and prices via Stripe MCP JSON-RPC or Stripe CLI fallback
# Usage:
#   STRIPE_MCP_KEY=<YOUR_RESTRICTED_KEY> ./scripts/mcp_list_products_prices.sh
# Note: You can run without MCP via Stripe CLI: ./scripts/mcp_list_products_prices.sh --cli

USE_CLI=${1:-}

if [ "$USE_CLI" = "--cli" ]; then
  if ! command -v stripe >/dev/null 2>&1; then
    echo "Stripe CLI not found. Install: https://stripe.com/docs/stripe-cli"
    exit 1
  fi
  echo "Listing products via Stripe CLI..."
  stripe products list --limit 100
  echo
  stripe prices list --limit 100
  exit 0
fi

if [ -z "$STRIPE_MCP_KEY" ]; then
  echo "No STRIPE_MCP_KEY set; falling back to Stripe CLI if available..."
  if command -v stripe >/dev/null 2>&1; then
    stripe products list --limit 100
    echo
    stripe prices list --limit 100
    exit 0
  else
    echo "No Stripe CLI found; please set STRIPE_MCP_KEY or install the CLI."
    exit 1
  fi
fi

# Query MCP for products
PRODUCTS_RESPONSE=$(curl -sS https://mcp.stripe.com/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${STRIPE_MCP_KEY}" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"products.list","arguments":{"limit":100}},"id":1}')

echo "Products response from Stripe MCP:"
if command -v jq >/dev/null 2>&1; then
  echo "$PRODUCTS_RESPONSE" | jq "."
else
  echo "$PRODUCTS_RESPONSE"
fi

# Query MCP for prices
PRICES_RESPONSE=$(curl -sS https://mcp.stripe.com/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${STRIPE_MCP_KEY}" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"prices.list","arguments":{"limit":100}},"id":2}')

echo "\nPrices response from Stripe MCP:"
if command -v jq >/dev/null 2>&1; then
  echo "$PRICES_RESPONSE" | jq "."
else
  echo "$PRICES_RESPONSE"
fi

# Helpful hint for the user
cat <<'EOF'

Tip: Pipe the output to jq to extract ids, for example:
jq -r '.result.data[] | "product: " + .id + " - " + .name'

You can create a JSON mapping file for apply_price_ids.js like:
{
  "Starter Spark": { "monthly": "price_...") , "yearly": "price_..." },
  "Brand Pulse": { ... }
}

Then run:
  node ./scripts/apply_price_ids.js price-ids.json
EOF
