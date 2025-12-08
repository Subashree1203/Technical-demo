
# Technical Demo — Machine Maintenance Module

[![Repo size](https://img.shields.io/github/repo-size/Subashree1203/Technical-demo)](https://github.com/Subashree1203/Technical-demo)

> Demo implementation of a Machine Maintenance module: custom DocType, client & server scripts, workflow, reports, notifications and dashboards.

---

## Table of contents

- [Overview](#overview)  
- [Screenshots](#screenshots)  
- [Features](#features)  

---

## Overview

This project demonstrates a full maintenance workflow for machines. It includes:

- A **Machine Maintenance** DocType that captures machine, maintenance type, dates, parts used (quantity, rate, computed amount), total cost, technician, and status.
- Client scripts for UI behavior (autofill dates, calculate amounts, hide/show fields, “Mark Completed” action).
- Server scripts (DocEvents) for validation and journal entry creation on submission.
- A **Workflow**: `Draft → Scheduled → Completed → Closed` with role-based transitions and manager approval.
- A **Script report** with consolidated/individual views and status-based highlights.
- Email **notifications** for scheduled, overdue, and completed maintenance.
- A **dashboard** with KPIs and charts (status distribution, monthly cost trend).

---

## Screenshots

### Machine Maintenance Form
![Machine Maintenance Form](https://github.com/Subashree1203/Technical-demo/blob/main/Doctype/Doctype%20Preview.png?raw=true)

### Workflow Flow
![Workflow Flow](https://github.com/Subashree1203/Technical-demo/blob/main/Workflow/Workflow.png?raw=true)

### Report View
![Report View](https://github.com/Subashree1203/Technical-demo/blob/main/Reports/Report%20Image.png?raw=true)

### Dashboard / KPIs
![Dashboard](https://github.com/Subashree1203/Technical-demo/blob/main/Dashboard/Dashboard.png?raw=true)


## Features (detailed)

### DocType
- Fields:
  - Machine Name (Link to Item)
  - Maintenance Date (Date)
  - Maintenance Type (Select: Preventive / Corrective)
  - Completion Date (Date)
  - Technician (Link to Employee)
  - Status (Select: Draft / Scheduled / Completed / Overdue / Closed)
  - Parts Used (Table): Part (Link), Quantity, Rate, Amount (computed)
  - Cost (Currency) — auto-sum of the parts’ amounts
  - Notes
- Validations: Technician required on submit; total cost auto-calculated.

### Client-side behaviors
- Autofill `Maintenance Date` on new records.
- Hide `Notes` when Status = Scheduled (example behavior).
- Mark a record as overdue automatically when `Maintenance Date` < today and status not Completed.
- “Mark Completed” button sets Completion Date and Status = Completed.

### Server-side logic
- On submission, create a Journal Entry logging maintenance cost (respects company currency).
- Validations and error messages for missing mandatory fields.
- Hook for sending notification emails on state changes.

### Workflow
- States: `Draft → Scheduled → Completed → Closed`
- Role rules:
  - Draft → Scheduled: Technician
  - Scheduled → Completed: Technician
  - Completed → Closed: Manager approval
- On closing, email sent to Operations / Manager.

### Reports
- Script Report: `Machine Maintenance Report`
  - Columns: Machine, Maintenance Date, Technician, Status, Total Cost
  - Filters: Machine, Technician, Date range
  - Consolidated option: group by Machine, show aggregated totals
  - Status-based row highlighting (Overdue: red; Scheduled: yellow; Completed: green)
- Print format for consolidated/detailed export.

### Notifications
- Emails for changes:
  - When maintenance is scheduled
  - When maintenance becomes overdue
  - When maintenance is completed
  - On closing (manager notification)

### Dashboard / KPIs
- Number of completed maintenance tasks
- Number of overdue tasks
- Total maintenance cost this month
- Charts:
  - Pie chart: status distribution
  - Line/bar chart: maintenance cost trend by month
