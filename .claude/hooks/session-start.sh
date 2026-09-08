#!/bin/bash
set -euo pipefail

# Install dev tooling (Prettier + html-validate) so linting and formatting
# work in Claude Code sessions. Idempotent and non-interactive.
# `npm install` (not `npm ci`) is used so the resulting node_modules is cached.

cd "$CLAUDE_PROJECT_DIR"
npm install --no-audit --no-fund
