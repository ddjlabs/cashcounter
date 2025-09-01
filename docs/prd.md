# Cash Counting Application – Product Requirement Document

## Overview
The Cash Counting Application is a desktop tool built with **Electron** to assist users in counting physical U.S. currency. It will run on **Windows, Mac, and Linux**, with the initial release focusing on **Windows MSI installer packaging**. The application provides a simple interface for inputting counts of bills and coins, calculates the total, and generates a printable/exportable report.

## Purpose
This application helps users quickly total the value of physical U.S. currency, including both bills and coins. It ensures accuracy in manual cash counts and provides a formatted report for recordkeeping.

---

## Supported Currency Denominations
- **Bills:** $100, $50, $20, $10, $5, $2, $1  
- **Coins:** $0.50, $0.25, $0.10, $0.05, $0.01  

---

## Functional Requirements

### User Interface
- Provide **text boxes** for each denomination.  
- Text boxes accept **only whole positive integers** (no decimals, negatives, or non-numeric input).  
- Pressing **Tab** moves focus to the next denomination field.  
- A **Calculate Total** button computes the total and displays:  
  - Subtotal per denomination  
  - Grand total  

### Report Generation
- A **Print Report** button generates a report with:  
  - Tabular layout of denominations, quantity, subtotal  
  - Grand total  
  - Date and time of the count  
  - Simple header with application logo  

- Reports can be:  
  - Printed directly to the **default system printer**  
  - Exported to **PDF**  

### Application Behavior
- Always starts with blank fields (no persistence of previous data).  
- Works **fully offline**, with no internet requirements.  
- Minimal, clean UI similar to a calculator.  
- Optional **keyboard shortcuts**:  
  - `Ctrl+P` for Print  
  - `Ctrl+E` for Export to PDF  
  - `Ctrl+C` for Calculate  

---

## Non-Functional Requirements
- Cross-platform support: **Windows, Mac, Linux** (initial release targets Windows).  
- Windows build distributed as an **MSI installer**.  
- Performance: Calculation and report generation must complete in <1 second for typical inputs.  
- Security: No internet access required; no data storage on disk.  

---

## Deliverables
1. Electron application source code.  
2. Windows MSI installer.  
3. Documentation for installation and usage.  

---

## Future Enhancements (Out of Scope for MVP)
- Multi-currency support  
- CSV export  
- Custom logo upload  
- Persistence of last counts  
- Advanced report metadata (username, machine name)  

---

## Report Mock-Up

Below is a sample layout of the printed/exported report. In the application, this will be formatted with a logo, alignment, and clean styling.

---

# 🧾 Cash Counting Report

[LOGO HERE]

**Cash Counting Application**  
**Date/Time:** 2025-08-30 14:32  

---

### Currency Breakdown

| Denomination | Quantity | Subtotal |
|--------------|----------|----------|
| $100 Bill    | 5        | $500.00  |
| $50 Bill     | 2        | $100.00  |
| $20 Bill     | 7        | $140.00  |
| $10 Bill     | 3        | $30.00   |
| $5 Bill      | 4        | $20.00   |
| $2 Bill      | 0        | $0.00    |
| $1 Bill      | 12       | $12.00   |
| 50¢ Coin     | 6        | $3.00    |
| 25¢ Coin     | 8        | $2.00    |
| 10¢ Coin     | 10       | $1.00    |
| 5¢ Coin      | 15       | $0.75    |
| 1¢ Coin      | 23       | $0.23    |

---

### Grand Total
**$808.98**

---
