# Lamitube ERP — UI Mockup

Interactive HTML mockup of an ERP for a laminated tube (lamitube) manufacturer.
Static screens with hardcoded sample data — no backend.

**Live:** https://waffbeen.github.io/lamitube-erp-mockup/

## Scope

Built from the tube manufacturing company's side. Printing is outsourced to a
separate company (Monarch Print Pvt. Ltd.) with its own GST and its own software;
printing job data flows back through a backend database sync.

## Flow

Enquiry → Estimation → Quotation → Sales Order → Production Work Order
→ Scheduling → Procurement → RMQC → Production (incl. outsourced printing)
→ IPQC → Packing → FGQC → Delivery Note → COA → Dispatch → Actual Costing
→ Complaint → RCA → CAPA

Three mandatory quality gates: **RMQC**, **IPQC**, **FGQC** (after packing).

## 55 screens

| Module | Screens |
|---|---|
| Dashboard | 1 |
| Sales | 4 |
| Master | 7 |
| Planning | 2 |
| Purchase & Inventory | 12 |
| Manufacturing | 4 |
| Quality | 4 |
| Dispatch | 4 |
| Complaint & CAPA | 3 |
| Integration | 1 |
| MIS Report | 13 |

## Also in here

- `flow.html` — interactive process flow diagram
- `Lamitube-ERP-Flow.pdf` — two-page flow document

## Running locally

No build step. Open `index.html` in a browser.

## Structure

- `assets/tokens.css` — design tokens (light + dark)
- `assets/app.css` — component kit
- `assets/app.js` — shell, sidebar, chat, notifications, approvals
- `assets/chart.js` — inline-SVG charts, no library
- `assets/demo.js` — browser-only demo data so the flow runs end to end
