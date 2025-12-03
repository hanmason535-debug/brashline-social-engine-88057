# PowerShell version: List products and prices using Stripe MCP (or fallback to CLI)
param(
    [string]$Mode = "mcp" # use 'cli' to force CLI
)

if ($Mode -eq "cli") {
    if (-not (Get-Command stripe -ErrorAction SilentlyContinue)) {
        Write-Error "Stripe CLI not found. Install at https://stripe.com/docs/stripe-cli"
        exit 1
    }
    Write-Host "Listing products/prices with Stripe CLI..."
    stripe products list --limit 100
    Write-Host "`nPrices:"
    stripe prices list --limit 100
    exit 0
}

if (-not $env:STRIPE_MCP_KEY) {
    Write-Warning "STRIPE_MCP_KEY not set. Falling back to CLI if available..."
    if (Get-Command stripe -ErrorAction SilentlyContinue) {
        stripe products list --limit 100
        Write-Host "`nPrices:"
        stripe prices list --limit 100
        exit 0
    } else {
        Write-Error "No STRIPE_MCP_KEY and no Stripe CLI; please set STRIPE_MCP_KEY or install the CLI."
        exit 1
    }
}

# Use the Stripe MCP JSON-RPC to list products
$payloadProducts = '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"products.list","arguments":{"limit":100}},"id":1}'

$responseProducts = Invoke-RestMethod -Uri "https://mcp.stripe.com/" -Method Post -Body $payloadProducts -Headers @{"Content-Type" = "application/json"; "Authorization" = "Bearer $env:STRIPE_MCP_KEY"}
Write-Host "Products response:`n" (ConvertTo-Json $responseProducts -Depth 10)

$payloadPrices = '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"prices.list","arguments":{"limit":100}},"id":2}'

$responsePrices = Invoke-RestMethod -Uri "https://mcp.stripe.com/" -Method Post -Body $payloadPrices -Headers @{"Content-Type" = "application/json"; "Authorization" = "Bearer $env:STRIPE_MCP_KEY"}
Write-Host "`nPrices response:`n" (ConvertTo-Json $responsePrices -Depth 10)

Write-Host "`nTip: Save the output or use jq to parse product/price ids. Format a price-ids.json file and run the apply script to patch the repo."