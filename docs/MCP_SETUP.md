# Stripe MCP (Model Context Protocol) Setup

This document outlines how to configure Stripe MCP in your workspace, authorize agents, and create webhook endpoints using the Stripe CLI or the MCP server.

## MCP Setup in VS Code

1. Install the Model Context Protocol (MCP) extension for VS Code if it's available in the marketplace.
2. Add Stripe MCP to your workspace's `.vscode/mcp.json` file (already checked into repo):

```json
{
  "servers": {
    "stripe": {
      "type": "http",
      "url": "https://mcp.stripe.com"
    }
  }
}
```

3. Open the MCP client in VS Code. When connecting, Stripe will open an OAuth consent screen. Only Stripe admins can authorize OAuth connections.

4. After authorization, you'll be able to use the MCP client to make API calls and search Stripe's docs.

## OAuth vs Agent Keys

- OAuth (recommended for interactive development in VS Code)
  - More secure, revocable, and scoped per-user. Use for interactive sessions.
  - Install via VS Code and follow the OAuth consent flow.

- Agent / Autonomous Access (use restricted API keys)
  - Create a restricted API key in Stripe Dashboard with the minimum privileges an agent needs.
  - Use this key as bearer token when calling `https://mcp.stripe.com/`.

## Creating a Restricted API Key

1. Log in to Stripe Dashboard.
2. Go to Developers → API keys → New restricted key.
3. Pick the minimum permissions (e.g., webhooks, customers, checkout.sessions if you need to create sessions).
4. Copy the restricted key and store it in a secure place (e.g., Vercel environment variables). Do not store in Git.

## Creating a Webhook Endpoint (Dashboard)

1. Dashboard → Developers → Webhooks → Add endpoint.
2. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe` (or local URL while using `stripe listen`).
3. API version: `2025-11-17.clover` (match server-side SDK version).
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
5. Create the webhook and copy the signing secret `whsec_...` to the `STRIPE_WEBHOOK_SECRET` environment variable.

## Creating a Webhook Endpoint (Stripe CLI)

Use the included PowerShell script `scripts/create_webhook.ps1` or run the command below:

```powershell
stripe webhook endpoints create `
  --url https://your-domain.vercel.app/api/webhooks/stripe `
  --api-version 2025-11-17.clover `
  --description "engaging-jubilee" `
  --enabled-events checkout.session.completed payment_intent.succeeded payment_intent.payment_failed customer.subscription.created customer.subscription.updated customer.subscription.deleted invoice.paid invoice.payment_failed
```

Copy the signing secret (whsec_) from the CLI output and save to `STRIPE_WEBHOOK_SECRET`.

## Using MCP (via cURL) for Webhook Creation

Here's an example JSON-RPC call to the `mcp.stripe.com` server using a restricted key:

```bash
curl https://mcp.stripe.com/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STRIPE_MCP_KEY" \
  -d '{
      "jsonrpc": "2.0",
      "method": "tools/call",
      "params": {
        "name": "webhook_endpoints.create",
        "arguments": {
          "url": "https://your-domain.vercel.app/api/webhooks/stripe",
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
          "api_version": "2025-11-17.clover",
          "description": "engaging-jubilee"
        }
      },
      "id": 1
  }'
```

> Note: If you're using the MCP via OAuth with VS Code `mcp.json`, the client will authorize requests for you and you can run similar commands from the MCP client without passing a key.

### Using included scripts with MCP

The repository includes helper scripts that will create a webhook using either the Stripe CLI or the MCP JSON-RPC endpoint. These scripts will use the MCP key (if provided) — so you can create webhooks in CI or automated flows.

 
### Listing existing products and prices

You can list all existing products and prices using the MCP scripts included in this repo. The scripts will call Stripe MCP using `STRIPE_MCP_KEY` (a restricted key) — or fall back to the Stripe CLI when `STRIPE_MCP_KEY` is not provided.

POSIX Shell:
```bash
STRIPE_MCP_KEY=$YOUR_KEY ./scripts/mcp_list_products_prices.sh
```

PowerShell:
```powershell
$env:STRIPE_MCP_KEY = "<YOUR_RESTRICTED_KEY>"
.\scripts\mcp_list_products_prices.ps1 -Mode mcp
```

These scripts print the full JSON response from the MCP server. Use `jq` or VS Code to examine the returned objects and extract the `prod_...` and `price_...` IDs.

### Apply Price IDs to repo data

Once you have a JSON mapping of plan names to price IDs (see format below), run the helper to apply those `price_*` ids to `src/data/pricing.data.ts` automatically:
```bash
node ./scripts/apply_price_ids.js ./price-ids.json
```

Example `price-ids.json`:
```json
{
  "Starter Spark": { "monthly": "price_abc123", "yearly": "price_xyz456" },
  "Brand Pulse": { "monthly": "price_xxx111", "yearly": "price_yyy222" },
  "Impact Engine": { "monthly": "price_mmm777", "yearly": "price_rrr888" }
}
```

This script updates the `stripePriceIds` mapping in the repo's pricing data file and creates a backup `pricing.data.ts.bak` before writing changes. After running it, check the changes and run `npm run lint` to validate.

- POSIX Shell:

```bash
STRIPE_MCP_KEY=$YOUR_KEY ./scripts/create_webhook.sh https://your-domain.vercel.app/api/webhooks/stripe "engaging-jubilee"
```

- PowerShell:

```powershell
# Using Stripe CLI (interactive)
.\scripts\create_webhook.ps1 -Url "https://your-domain.vercel.app/api/webhooks/stripe" -Name "engaging-jubilee"

# Using MCP (requires STRIPE_MCP_KEY env var)
$env:STRIPE_MCP_KEY = "<YOUR_RESTRICTED_KEY>"
.\scripts\create_webhook.ps1 -Url "https://your-domain.vercel.app/api/webhooks/stripe" -Name "engaging-jubilee"
```

When the script runs successfully with MCP, it prints the raw MCP response. If `jq` is present, the shell script will attempt to extract the webhook signing secret (`whsec_...`) to instruct you to set `STRIPE_WEBHOOK_SECRET`.

## Local Development with Stripe CLI

1. Install Stripe CLI:
   - Windows (Scoop): `scoop install stripe`
   - macOS (Homebrew): `brew install stripe/stripe-cli/stripe`
   - Linux: follow official docs

2. Authenticate: `stripe login`

3. Forward webhooks to your local server:

```powershell
stripe listen --forward-to http://localhost:3001/api/webhooks/stripe
```

4. Copy the printed webhook secret (`whsec_...`) into your local `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## MCP in Team Environments

- Use OAuth to allow team members to connect via MCP in VS Code.
- For automated agents, create restricted keys and put them into CI or a secure store.
- Revoke sessions from Dashboard when necessary.

## Security Considerations

- Never commit `sk_live_...` or `whsec_...` secrets to Git.
- For agents, prefer restricted (scoped) keys.
- Audit MCP client sessions and restricted keys regularly.

## Troubleshooting

- If a webhook fails due to signature mismatch, ensure `STRIPE_WEBHOOK_SECRET` is correct and that the endpoint receives raw body (no JSON parsing earlier in the middleware chain).
- If events are not received, check Dashboard → Developers → Webhooks → Logs, and confirm events are enabled.

---

If you want, I can:
- Add the MCP entry for Stripe to `.vscode/mcp.json` (already done),
- Generate a restricted key checklist and a sample IAM policy, or
- Run the `scripts/create_webhook.ps1` for your dev URL if you provide the URL and confirm you want me to run a CLI command here.
