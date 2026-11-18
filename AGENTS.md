# SplitNest — Agent Rules

## Scope
- Build a browser-only expense splitter for university housemates, matching the product brief.
- Include household setup, equal expense splitting, net balances, expense history, and deletion only.
- Exclude login, payments, invites, chores, shopping lists, live sync, and native apps.

## Stack and structure
- Use React, TypeScript, Vite, Tailwind CSS, and browser localStorage; support Vercel deployment.
- Keep UI in `src/components/`, types in `src/types/`, and pure calculations in `src/lib/`.
- Use integer pence for arithmetic; round split remainders deterministically so shares total the original bill.
- Keep each source file under 200 lines; split larger files by responsibility.
- Do not add a dependency without explaining why an existing package or browser API is insufficient.

## Required behaviour
- Require a household name and at least two non-empty, distinct housemate names.
- Require a non-empty expense description, positive GBP amount, valid payer, and at least one participant.
- On invalid submission, show an inline error without clearing entered values.
- Recalculate expense shares and net balances immediately after adding or deleting an expense.
- Save household and expense changes to localStorage; restore them after refresh.
- Test the £60/three-person case: Alice paid; Alice is owed £40, Bob and Charlie owe £20 each.

## Hardening and reliability
- Maintain invariant accessible names on all form controls: visual restyling or copy edits must never alter or remove accessible roles and names (e.g. submit buttons must retain accessible name 'Add expense') relied upon by screen readers and automated test suites.
- Never swallow errors in empty catch blocks: all storage, network, or parsing operations must return explicit status indicators and log actionable diagnostics or surface inline user warnings on failure.

## Definition of done
- Provide working `dev`, `lint`, `test`, and `build` scripts in `package.json`.
- Run `npm run lint`, `npm run test`, and `npm run build`; all must exit successfully.
- Run `npm run dev` and verify setup, add, split, delete, invalid input, and refresh in a browser.
- Never claim completion when a check fails; report the failed command and remaining issue.
