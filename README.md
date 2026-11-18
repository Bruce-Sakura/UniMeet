# SplitNest

SplitNest is a browser-only shared expense ledger designed specifically for university housemates. It provides equal expense splitting, deterministic integer-pence debt tracking, net balances, and full transaction history with zero cloud setup, backend dependencies, or account logins.

---

## Features

- **Household Onboarding & Setup:** Establish a household name and register at least two housemates with validation that prevents duplicate or blank names.
- **Fair Equal Splitting (Integer Pence):** All calculations are executed in integer pence with deterministic remainder distribution (roster-order), ensuring split shares sum to the exact penny of the original bill.
- **Real-Time Net Balances:** Instant recalculation showing exactly who is owed money (`is owed £X.XX`), who owes money (`owes £X.XX`), and who is settled (`settled (£0.00)`).
- **Expense Journal & Deletion:** View all logged expenses with per-member split share chips, searchable descriptions and payers, and immediate deletion with automatic ledger recalculation.
- **Reliable Local Persistence:** Household configuration and expense journals persist securely in browser `localStorage` across page refreshes with explicit failure diagnostics.
- **Boutique Hotel Aesthetic & Full Responsiveness:** Styled with an editorial aesthetic (warm stone paper `#f7f5ed`, olive green `#4a573e` CTAs, terracotta alerts, Cormorant Garamond typography), fully responsive across desktop and mobile (tested at 375×812 with zero overflow).

---

## Tech Stack & Architecture

- **UI & Runtime:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Persistence:** Browser `localStorage` (guarded by runtime shape assertions and failure alerts)
- **Quality & Testing:** ESLint, Vitest, React Testing Library, Chrome DevTools Protocol (CDP) end-to-end automation
- **Architecture Constraints:** Every source file under `src/` is strictly under 200 lines by responsibility (`src/types/`, `src/lib/`, `src/components/`).

---

## Quick Start (Clean Checkout)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

---

## Verification & Scripts

All verification scripts are configured in `package.json` and pass with exit code `0`:

- **Lint:**
  ```bash
  npm run lint
  ```
- **Unit & Integration Tests:**
  ```bash
  npm test
  ```
  Runs 10 unit and integration tests covering integer-pence math, deterministic remainder distribution, validation errors, input retention, and the £60 3-way split case.
- **Production Build:**
  ```bash
  npm run build
  ```
  Type-checks with `tsc -b` and builds production bundle to `dist/`.

---

## Acceptance Criteria Status

All acceptance criteria from the brief and `AGENTS.md` are **100% PASS**:

1. **AC1 (Household Setup & Input Validation):** PASS — Requires name & ≥2 distinct members; inline error retains inputs on failure.
2. **AC2 (Expense Validation & Input Retention):** PASS — Validates description, positive GBP amount, and payer; preserves user inputs on error.
3. **AC3 (Equal Splitting & £60 Test Case):** PASS — £60 split across Alice (payer), Bob, and Charlie results in Alice owed £40.00, Bob owing £20.00, Charlie owing £20.00.
4. **AC4 (Recalculation on Deletion):** PASS — Deleting an expense immediately restores all members to settled (£0.00).
5. **AC5 (Persistence Across Refresh):** PASS — Full household state, active balances, and expense journal restore from `localStorage`.
6. **Edge Case A (£100 Split):** PASS — £100 split 3 ways yields £33.34 (Alice), £33.33 (Bob), £33.33 (Charlie), totalling exactly £100.00.
7. **Edge Case B (Mobile 375×812):** PASS — Zero horizontal overflow (`scrollWidth <= window.innerWidth`); all inputs and buttons reachable and usable.
