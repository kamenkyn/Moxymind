# Moxymind Playwright Tests

Playwright tests for the Moxymind assignment. The project contains UI tests for Sauce Demo and API tests for ReqRes.

## Requirements

- Node.js 20 or newer
- npm

Install dependencies:

```bash
npm install
npx playwright install chromium
```

## Run tests

Run all tests in headless mode:

```bash
npm test
```

Run one task:

```bash
npm run test:task1
npm run test:task2
```

Run with a visible browser:

```bash
npm run test:headed
```

Run the currently selected test in Playwright Inspector:

```bash
npm run test:debug -- task_2/test/createUsers.spec.ts
```

Check TypeScript without running tests:

```bash
npm run typecheck
```

The API tests write their response examples to `task_2/results/`. Playwright reports and test artifacts are generated locally and ignored by Git.