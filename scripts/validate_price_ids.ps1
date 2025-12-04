Param()
function Check-Price([string]$key) {
  $id = (Get-Item env:$key -ErrorAction SilentlyContinue).Value
  if (-not $id) {
    Write-Host "[WARN] Env $key is not set"
    return $false
  }
  try {
    $r = stripe prices retrieve $id --format json | ConvertFrom-Json
    Write-Host "[OK] $key -> $($r.id)"
    return $true
  } catch {
    Write-Host "[ERROR] Price ID $id set in $key could not be found in Stripe"
    return $false
  }
}

$keys = @(
  'VITE_STRIPE_PRICE_STARTER_SPARK_MONTHLY',
  'VITE_STRIPE_PRICE_STARTER_SPARK_YEARLY',
  'VITE_STRIPE_PRICE_BRAND_PULSE_MONTHLY',
  'VITE_STRIPE_PRICE_BRAND_PULSE_YEARLY',
  'VITE_STRIPE_PRICE_IMPACT_ENGINE_MONTHLY',
  'VITE_STRIPE_PRICE_IMPACT_ENGINE_YEARLY',
  'VITE_STRIPE_PRICE_DIGITAL_LAUNCH_PRO_ONE_TIME',
  'VITE_STRIPE_PRICE_VISUAL_VAULT_ONE_TIME',
  'VITE_STRIPE_PRICE_AUTOMATEIQ_ONE_TIME',
  'VITE_STRIPE_PRICE_LOCAL_SURGE_ONE_TIME',
  'VITE_STRIPE_PRICE_COMMERCE_BOOST_ONE_TIME',
  'VITE_STRIPE_PRICE_DATA_PULSE_ONE_TIME'
)

$ok = $true
foreach ($k in $keys) { if (-not (Check-Price $k)) { $ok = $false } }

if (-not $ok) { exit 1 }
Write-Host "All price IDs are valid."
