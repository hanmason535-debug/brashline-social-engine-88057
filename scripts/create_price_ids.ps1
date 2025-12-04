Param(
  [Parameter(Mandatory=$true)][string]$ProductId,
  [Parameter(Mandatory=$true)][int]$MonthlyCents,
  [Parameter(Mandatory=$true)][int]$YearlyCents,
  [Parameter(Mandatory=$true)][string]$Prefix
)

Write-Host "Creating monthly price for product=$ProductId amount=$MonthlyCents"
$monthlyJson = & stripe prices create --product $ProductId --unit-amount $MonthlyCents --currency usd --recurring interval=month --format json
$monthly = $monthlyJson | ConvertFrom-Json
$monthlyId = $monthly.id

Write-Host "Creating yearly price for product=$ProductId amount=$YearlyCents"
$yearlyJson = & stripe prices create --product $ProductId --unit-amount $YearlyCents --currency usd --recurring interval=year --format json
$yearly = $yearlyJson | ConvertFrom-Json
$yearlyId = $yearly.id

Write-Host "`nAdd the following to your environment (Vite / .env / Vercel):"
Write-Host "VITE_STRIPE_PRICE_${Prefix}_MONTHLY=$monthlyId"
Write-Host "VITE_STRIPE_PRICE_${Prefix}_YEARLY=$yearlyId"
