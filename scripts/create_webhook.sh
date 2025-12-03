#!/usr/bin/env bash
# Create Stripe webhook endpoint using Stripe CLI or the MCP JSON-RPC endpoint
# Usage: ./create_webhook.sh https://your-domain/api/webhooks/stripe "engaging-jubilee"
# If the STRIPE_MCP_KEY environment variable is set, the script will attempt to
# create the endpoint via the Stripe MCP JSON-RPC API instead of using the
# local Stripe CLI. This is useful in CI or remote environments where the
# Stripe CLI may not be logged in interactively.

URL=${1:-}
NAME=${2:-engaging-jubilee}
API_VERSION=${3:-2025-11-17.clover}
USE_MCP=${USE_MCP:-}

if [ -z "$URL" ]; then
  echo "Usage: $0 <webhook_url> [name] [api_version]"
  exit 1
fi

EVENTS=(
  "checkout.session.completed"
  "payment_intent.succeeded"
  "payment_intent.payment_failed"
  "customer.subscription.created"
  "customer.subscription.updated"
  "customer.subscription.deleted"
  "invoice.paid"
  "invoice.payment_failed"
)

# Use MCP if the environment indicates so, otherwise fallback to Stripe CLI
if [ -n "$STRIPE_MCP_KEY" ] || [ -n "$USE_MCP" ]; then
  echo "Using Stripe MCP API to create webhook (https://mcp.stripe.com)"
  # Build JSON-RPC payload
  read -r -d '' PAYLOAD <<-JSON || true
  {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "webhook_endpoints.create",
      "arguments": {
        "url": "${URL}",
        "enabled_events": [
          "checkout.session.completed",
          "payment_intent.succeeded",
          "payment_intent.payment_failed",
          "customer.subscription.created",
          "customer.subscription.updated",
          "customer.subscription.deleted",
          "invoice.paid",
          "invoice.payment_failed"
        ],
        "api_version": "${API_VERSION}",
        "description": "${NAME}"
      }
    },
    "id": 1
  }
  JSON

  if [ -z "$STRIPE_MCP_KEY" ]; then
    echo "Warning: STRIPE_MCP_KEY not set. MCP JSON-RPC will likely fail without it."
  fi

  # Call MCP; print whole response and try to extract secret if jq is present
  RESPONSE=$(curl -sS -X POST "https://mcp.stripe.com/" -H "Content-Type: application/json" -H "Authorization: Bearer ${STRIPE_MCP_KEY}" -d "$PAYLOAD")
  echo "MCP Response: $RESPONSE"

  # If jq exists, try to fetch the secret from different paths
  if command -v jq >/dev/null 2>&1; then
    SECRET=$(echo "$RESPONSE" | jq -r '.result.secret // .result.secret.secret // .result.secret.value // empty')
    if [ -n "$SECRET" ]; then
      echo "Found secret: $SECRET"
      echo "Set STRIPE_WEBHOOK_SECRET=$SECRET in your environment or .env file"
    else
      echo "Could not extract webhook secret from MCP response; check the raw output and Dashboard." >&2
    fi
  else
    echo "jq not found: install jq to attempt to parse the MCP response for the webhook secret. Otherwise check the raw MCP output above." >&2
  fi
  exit 0
fi

stripe webhook endpoints create \
  --url "$URL" \
  --api-version "$API_VERSION" \
  --description "$NAME" \
  --enabled-events "${EVENTS[*]}"

# Output includes whsec signing secret to set in STRIPE_WEBHOOK_SECRET
