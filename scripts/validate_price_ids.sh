#!/usr/bin/env bash
set -euo pipefail

MISSING=0
check_env() {
  local key="$1"
  local id="${!key:-}"
  if [[ -z "$id" ]]; then
    echo "[WARN] Env $key is not set"
    MISSING=1
    return
  fi
  # Verify price exists via stripe CLI
  if ! stripe prices retrieve "$id" --quiet >/dev/null 2>&1; then
    echo "[ERROR] Price ID $id set in $key could not be found in Stripe"
    MISSING=1
  else
    echo "[OK] $key -> $id"
  fi
}

check_env VITE_STRIPE_PRICE_STARTER_SPARK_MONTHLY
check_env VITE_STRIPE_PRICE_STARTER_SPARK_YEARLY
check_env VITE_STRIPE_PRICE_BRAND_PULSE_MONTHLY
check_env VITE_STRIPE_PRICE_BRAND_PULSE_YEARLY
check_env VITE_STRIPE_PRICE_IMPACT_ENGINE_MONTHLY
check_env VITE_STRIPE_PRICE_IMPACT_ENGINE_YEARLY
check_env VITE_STRIPE_PRICE_DIGITAL_LAUNCH_PRO_ONE_TIME
check_env VITE_STRIPE_PRICE_VISUAL_VAULT_ONE_TIME
check_env VITE_STRIPE_PRICE_AUTOMATEIQ_ONE_TIME
check_env VITE_STRIPE_PRICE_LOCAL_SURGE_ONE_TIME
check_env VITE_STRIPE_PRICE_COMMERCE_BOOST_ONE_TIME
check_env VITE_STRIPE_PRICE_DATA_PULSE_ONE_TIME

if [[ $MISSING -eq 1 ]]; then
  echo ""
  echo "One or more price IDs are missing or invalid. Please set env variables and rerun scripts/create_price_ids.sh or update Vercel envs."
  exit 1
fi

echo "All price IDs are valid."
