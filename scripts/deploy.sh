#!/usr/bin/env bash
set -euo pipefail

STAGE="${1:-dev}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Deploying Serverless stack — stage: ${STAGE}"
npx serverless deploy --stage "$STAGE"
