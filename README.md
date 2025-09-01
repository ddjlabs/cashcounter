# Cash Counter

![Build Status](https://github.com/ddjlabs/cashcounter/actions/workflows/release-on-main.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
<!-- Add a real coverage badge if you use a coverage service like Codecov or Coveralls -->

A minimal offline Electron app to count U.S. currency with printing and PDF export.

- Cross-platform (Windows, macOS, Linux). Initial release focuses on Windows MSI.
- Offline only. No persistence. Clean, calculator-like UI.

## Features

- **Minimal, Calculator-like UI:** Clean, responsive interface for quick cash counting.
- **Supports All U.S. Denominations:** Inputs for bills ($100, $50, $20, $10, $5, $2, $1) and coins (50¢, 25¢, 10¢, 5¢, 1¢).
- **Live Validation:** Only whole, non-negative integers are accepted for counts. Invalid input is highlighted.
- **Real-time Calculation:** Subtotals and grand total update as you type.
- **Print and PDF Export:** Print the report or export it as a PDF, including a timestamp and optional description.
- **Keyboard Shortcuts:**  
  - Ctrl+P: Print  
  - Ctrl+E: Export PDF  
  - Ctrl+C: Calculate (if a button is present)
- **Reset and Exit:** Quickly clear all fields or exit the app.
- **No Data Persistence:** All data is cleared on exit; nothing is stored on disk.
- **Cross-platform:** Works on Windows, macOS, and Linux (Windows MSI build supported).

## How it Works

- **Main Process (`src/main.js`):**  
  - Sets up the Electron window and application menu.
  - Handles print, export, reset, and exit actions via IPC and menu.
  - Uses Electron's `printToPDF` and system dialogs for export/print.

- **Preload Script (`src/preload.js`):**  
  - Exposes safe APIs (`print`, `exportPdf`, `exit`, `onReset`) to the renderer via `contextBridge`.

- **Calculation Library (`src/lib/calc.js`):**  
  - Defines denominations and their values in cents.
  - Provides functions for validation, subtotal, and grand total calculation.
  - Ensures all math is done in integer cents to avoid floating-point errors.

- **Renderer (`src/renderer/renderer.js`):**  
  - Dynamically builds the input grid for all denominations.
  - Handles user input, validation, and live subtotal/grand total updates.
  - Manages print/export/reset/exit actions and keyboard shortcuts.
  - Populates a print-optimized report for printing/PDF export.

- **UI (`src/renderer/index.html`, `styles.css`):**  
  - Modern, accessible layout with print-optimized styles.
  - Print and export include a timestamp and optional description.

## Requirements Summary (from `docs/prd.md`)
- Inputs for bills: $100, $50, $20, $10, $5, $2, $1
- Inputs for coins: 50¢, 25¢, 10¢, 5¢, 1¢
- Validate whole non-negative integers only
- Calculate subtotals and grand total
- Print and Export to PDF
- Keyboard shortcuts: Ctrl+P (Print), Ctrl+E (Export), Ctrl+C (Calculate)

## Project Structure
```
.
├── docs/
│   └── prd.md
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── lib/
│   │   └── calc.js
│   ├── main.js
│   ├── preload.js
│   └── renderer/
│       ├── index.html
│       ├── renderer.js
│       └── styles.css
├── tests/
│   └── calc.test.js
├── jest.config.cjs
└── package.json
```

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Run the app in development
```bash
npm run dev
```

3. Run unit tests
```bash
npm test
```

4. Build Windows MSI (on Windows)
```bash
npm run build:win
```
MSI will be output to `dist/`.

## Notes
- Calculations are done in integer cents to avoid floating-point errors (`src/lib/calc.js`).
- The renderer loads the report table dynamically after calculation.
- Printing uses the system print dialog; PDF export uses a save dialog and Electron `printToPDF`.
- No data is stored on disk; app opens with blank fields every time.
