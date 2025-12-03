# Create Stripe webhook endpoint using Stripe CLI
# Usage: .\create_webhook.ps1 -Url "https://example.com/api/webhooks/stripe" -ApiVersion "2025-11-17.clover" -Name "engaging-jubilee" -Events @('checkout.session.completed','payment_intent.succeeded')
param(
    [Parameter(Mandatory=$true)] [string]$Url,
    [Parameter(Mandatory=$false)] [string]$ApiVersion = "2025-11-17.clover",
    [Parameter(Mandatory=$false)] [string]$Name = "engaging-jubilee",
    [Parameter(Mandatory=$false)] [string[]]$Events = @(
        'checkout.session.completed',
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.paid',
        'invoice.payment_failed'
    )
)

# Build the events argument
$eventsArg = $Events -join " "

Write-Host "Creating webhook endpoint for: $Url"
Write-Host "Events: $eventsArg"
Write-Host "API Version: $ApiVersion"

$stripeCmd = "stripe webhook endpoints create --url $Url --api-version $ApiVersion --description $Name --enabled-events $eventsArg"
Write-Host "Running: $stripeCmd"

# If an MCP key is provided via env var STRIPE_MCP_KEY, call the MCP JSON-RPC endpoint
if ($env:STRIPE_MCP_KEY -and $env:STRIPE_MCP_KEY -ne "") {
    Write-Host "Using Stripe MCP JSON-RPC to create the webhook..."
    $jsonPayload = @{
        jsonrpc = "2.0"
        method = "tools/call"
        params = @{
            name = "webhook_endpoints.create"
            arguments = @{
                url = $Url
                enabled_events = $Events
                api_version = $ApiVersion
                description = $Name
            }
        }
        id = 1
    } | ConvertTo-Json -Depth 6

    try {
        $response = Invoke-RestMethod -Uri "https://mcp.stripe.com/" -Method Post -Body $jsonPayload -Headers @{"Content-Type" = "application/json"; "Authorization" = "Bearer $env:STRIPE_MCP_KEY"}
        Write-Host "MCP Response:`n$response | ConvertTo-Json -Depth 6"

        if ($response.result -and $response.result.secret) {
            $secret = $response.result.secret
            Write-Host "Webhook secret found: $secret"
            Write-Host "Store this in STRIPE_WEBHOOK_SECRET in your environment or .env file."
        } else {
            Write-Warning "Could not extract webhook secret from the MCP response. Check the Dashboard or raw response above."
        }
    } catch {
        Write-Error "Error calling MCP: $_"
        exit 1
    }
    exit 0
}

# Fallback to using the Stripe CLI
try {
    $output = & stripe webhook endpoints create --url $Url --api-version $ApiVersion --description $Name --enabled-events $Events
    Write-Host "Webhook result:`n$output"
    Write-Host "Copy the signing secret (whsec_...) from the output and save to your environment as STRIPE_WEBHOOK_SECRET"
} catch {
    Write-Error "Error creating webhook endpoint: $_"
    exit 1
}
