param(
  [string]$OutFile = "price-ids.json",
  [string]$Mode = "mcp" # or 'cli'
)

if ($Mode -eq "cli") {
  if (-not (Get-Command stripe -ErrorAction SilentlyContinue)) { Write-Error "Stripe CLI required"; exit 1 }
  $prices = stripe prices list --limit 100 --format json | ConvertFrom-Json
  $products = stripe products list --limit 100 --format json | ConvertFrom-Json
} else {
  if (-not $env:STRIPE_MCP_KEY) { Write-Error "STRIPE_MCP_KEY env var required for MCP mode"; exit 1 }
  $payloadPrices = '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"prices.list","arguments":{"limit":100}},"id":1}'
  $payloadProducts = '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"products.list","arguments":{"limit":100}},"id":2}'
  $responsePrices = Invoke-RestMethod -Uri "https://mcp.stripe.com/" -Method Post -Body $payloadPrices -Headers @{"Content-Type" = "application/json"; "Authorization" = "Bearer $env:STRIPE_MCP_KEY"}
  $responseProducts = Invoke-RestMethod -Uri "https://mcp.stripe.com/" -Method Post -Body $payloadProducts -Headers @{"Content-Type" = "application/json"; "Authorization" = "Bearer $env:STRIPE_MCP_KEY"}
  $prices = $responsePrices.result.data
  $products = $responseProducts.result.data
}

# Construct mapping
$mapping = @{}
foreach ($p in $products) {
  $mapping[$p.name] = @{}
}
foreach ($pr in $prices) {
  $prod = $products | Where-Object { $_.id -eq $pr.product }
  if ($null -eq $prod) { continue }
  $name = $prod.name
  if ($null -ne $pr.recurring) {
    if ($pr.recurring.interval -eq "month") { $mapping[$name].monthly = $pr.id }
    elseif ($pr.recurring.interval -eq "year") { $mapping[$name].yearly = $pr.id }
  }
}

$mapping | ConvertTo-Json -Depth 7 | Out-File -FilePath $OutFile -Encoding UTF8
Write-Host "Exported price mapping to $OutFile"
Write-Host ((Get-Content $OutFile) -join "\n")
