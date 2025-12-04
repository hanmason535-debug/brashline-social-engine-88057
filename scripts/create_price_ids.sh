#!/usr/bin/env bash
# Create Stripe price IDs for a given product with monthly and yearly prices
# Usage: ./scripts/create_price_ids.sh <product_id> <monthly_cents> <yearly_cents> <env_var_prefix>

set -euo pipefail

if [[ $# -lt 4 ]]; then
  echo "Usage: $0 <product_id> <monthly_cents> <yearly_cents> <env_var_prefix>"
  echo "Example: $0 prod_TVRrohKG1uB7fa 9900 110600 STARTER_SPARK"
  exit 1
fi

PRODUCT_ID="$1"
MONTHLY_CENTS="$2"
YEARLY_CENTS="$3"
PREFIX="$4"

echo "Creating monthly price for product=${PRODUCT_ID} amount=${MONTHLY_CENTS}"
monthly_price_json=$(stripe prices create --product ${PRODUCT_ID} --unit-amount ${MONTHLY_CENTS} --currency usd --recurring interval=month --format json)
monthly_price_id=$(echo "$monthly_price_json" | jq -r '.id')

echo "Creating yearly price for product=${PRODUCT_ID} amount=${YEARLY_CENTS}"
yearly_price_json=$(stripe prices create --product ${PRODUCT_ID} --unit-amount ${YEARLY_CENTS} --currency usd --recurring interval=year --format json)
yearly_price_id=$(echo "$yearly_price_json" | jq -r '.id')

echo ""
echo "Add the following to your environment (Vite / .env / Vercel):"
echo "export VITE_STRIPE_PRICE_${PREFIX}_MONTHLY=${monthly_price_id}"
echo "export VITE_STRIPE_PRICE_${PREFIX}_YEARLY=${yearly_price_id}"
echo ""
echo "Done."
