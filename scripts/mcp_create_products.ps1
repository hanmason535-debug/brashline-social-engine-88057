# Create products and prices via Stripe MCP JSON-RPC using STRIPE_MCP_KEY
# Usage: $env:STRIPE_MCP_KEY='<YOUR_RESTRICTED_KEY>'; .\scripts\mcp_create_products.ps1 scripts\products.mcp.json
param(
    [string]$Input = 'scripts\products.mcp.json'
)

if (-not $env:STRIPE_MCP_KEY -or $env:STRIPE_MCP_KEY -eq '') {
    Write-Error 'STRIPE_MCP_KEY is not set. Please set the restricted key in environment before using this script.'
    exit 1
}

if (-not (Test-Path $Input)) {
    Write-Error "Input file $Input not found"
    exit 1
}

$json = Get-Content $Input -Raw | ConvertFrom-Json
$MCP_URL = 'https://mcp.stripe.com/'
$Headers = @{ 'Content-Type' = 'application/json'; 'Authorization' = "Bearer $env:STRIPE_MCP_KEY" }
 $results = @{ products = @() }

Write-Host '🚀 Creating products/prices via MCP...'
foreach ($p in $json.products) {
    $name = $p.name
    $description = $p.description
    $active = $p.active
    $tier = $p.tier

    $payload = @{
        jsonrpc = '2.0'
        method = 'tools/call'
        params = @{
            name = 'products.create'
            arguments = @{
                name = $name
                description = $description
                active = $active
                metadata = @{ app = 'brashline'; tier = $tier }
            }
        }
        id = 1
    } | ConvertTo-Json -Depth 6

    try {
        $response = Invoke-RestMethod -Uri $MCP_URL -Method Post -Body $payload -Headers $Headers
        $product_id = $response.result.id
        Write-Host "Created product: $name -> $product_id"
        $tier = $p.tier
        $results.products += @{ id = $product_id; name = $name; tier = $tier; prices = @() }

        foreach ($pr in $p.prices) {
            $billing = $pr.billing
            $unit_amount = $pr.unit_amount
            $currency = $pr.currency
            $recurring = $pr.recurring

            if ($billing -eq 'one-time') {
                $arguments = @{ product = $product_id; unit_amount = $unit_amount; currency = $currency }
            } else {
                $arguments = @{ product = $product_id; unit_amount = $unit_amount; currency = $currency; recurring = @{ interval = $recurring.interval } }
            }

            $payloadPrice = @{
                jsonrpc = '2.0'
                method = 'tools/call'
                params = @{
                    name = 'prices.create'
                    arguments = $arguments
                }
                id = 2
            } | ConvertTo-Json -Depth 6

            $respPrice = Invoke-RestMethod -Uri $MCP_URL -Method Post -Body $payloadPrice -Headers $Headers
            $price_id = $respPrice.result.id
            Write-Host "  Price created ($billing): $price_id -> $unit_amount $currency"
            $results.products[-1].prices += @{ id = $price_id; billing = $billing; unit_amount = $unit_amount; currency = $currency }
        }

    } catch {
        Write-Error "Error creating product: $_"
        exit 1
    }
}

Write-Host '✅ Done creating products and prices via MCP.'
$results | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 scripts\generated_prices.json
Write-Host "Saved generated prices to scripts/generated_prices.json"
exit 0
