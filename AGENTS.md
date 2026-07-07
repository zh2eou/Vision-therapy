# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single frontend app (no backend) living in `app/`: a Vite + React 19 + TypeScript
"Circle of Concentration" vision-therapy exercise. State is client-side only (React `useReducer`
+ `localStorage`); there is no server or database.

- All commands run from the `app/` directory (that is where `package.json` lives).
- Dev server: `npm run dev` (Vite, serves on http://localhost:5173/).
- Build: `npm run build` (runs `tsc -b` then `vite build`).
- Lint: `npm run lint` (ESLint). Note: `npm run lint` currently reports pre-existing errors in
  `src/App.tsx`, `src/audio.ts`, and `src/components/AnswerInput.tsx` (React hooks / `no-explicit-any`
  rules). These exist on `main` and are unrelated to environment setup.
- No test runner is configured (no `test` script, no test files).
- Node 22 is required (Vite 8 needs Node 20.19+/22.12+).
