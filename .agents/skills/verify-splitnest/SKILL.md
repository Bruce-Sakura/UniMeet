---
name: verify-splitnest
description: Run whenever completing a feature, refactoring, or verifying SplitNest before declaring a task done.
---

## SplitNest Verification Workflow

Execute this end-to-end verification sequence before marking any task complete:

1. **Check 200-line limit across all source files:**
   ```bash
   find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -exec wc -l {} +
   ```
   Every file must strictly contain fewer than 200 lines. If any file reaches 200 lines, refactor by responsibility into `src/lib/` or `src/components/`.

2. **Lint static analysis:**
   ```bash
   npm run lint
   ```
   Must exit with code 0 and zero lint warnings or errors.

3. **Run automated test suite (including the £60/3-person split and deterministic remainder rounding):**
   ```bash
   npm run test
   ```
   All unit and DOM integration tests in `src/lib/splitnest.test.ts` and `src/App.test.tsx` must pass.

4. **Verify TypeScript compilation and production bundle build:**
   ```bash
   npm run build
   ```
   `tsc -b && vite build` must exit 0 and emit clean assets to `dist/`.

5. **Headless browser smoke test:**
   Launch the dev server and verify the full user lifecycle:
   - Household setup with distinct names (and inline error retention on duplicates).
   - Add expense with payer selection and participant checkboxes (and inline error retention if fields are omitted).
   - Recalculation of net balances (£60 split produces +£40 owed to payer, £20 owed by non-payers).
   - `localStorage` persistence across page reload.
   - Deletion of an expense with immediate balance recalculation to settled.
