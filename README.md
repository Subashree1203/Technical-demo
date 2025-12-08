# Technical-demo

1. Custom DocType & Fields

Create a new DocType: Machine Maintenance

Fields:
Machine Name (Link, Item)
Maintenance Date (Date)
Maintenance Type (Select: Preventive, Corrective)
Completion Date (Date)
Technician (Link, Employee)
Status (Select: Scheduled, Completed, Overdue)
Cost (Currency)
Notes (Seperate Tab which have the same Notes Functionality in Lead)
Table: Parts Used
           Fields: Part (Link, Item), Quantity (Float),Rate, Amount (Currency, read-only, computed)

          Make Cost auto-calculate as the sum of all Amount in Parts Used.

2. Client-Side Script
Hide Notes field if Status is Scheduled.
Automatically set Maintenance Date to today if creating a new record.
Auto-update Status to Overdue if Maintenance Date < today and Status is not Completed.
Add a button “Mark Completed” to set Status = Completed and record the completion date.
3. Server-Side Script / DocEvents

On submission of Machine Maintenance:

Create a Journal Entry to log the maintenance cost against:
              Ensure the Journal Entry respects currency conversion to the company currency
              Debit: Maintenance Expense account
              Credit: Cash/Bank account
Validate that Technician is assigned; throw an error if empty.
4. Workflow

Workflow states: Draft → Scheduled → Completed → Closed
Transition rules:
           Draft → Scheduled : Only Technician role
           Scheduled → Completed : Only Technician
           Completed → Closed : Manager approval
           On transition to Closed, send email to the Operations manager.

5. Report

Create a Script Report Machine Maintenance Report
Columns: Machine, Maintenance Date, Technician, Status, Total Cost,Consolidated (Check Box)
Filters: Machine, Technician, Date Range
When Consolidated = True:
           Group all maintenance entries by Machine
           Sum Total Cost per machine
           Display one row per machine with aggregated totals
When Consolidated = False:
           Show individual maintenance entries (default report view)
           Highlight rows based on Status:

           Overdue → Red background ,Scheduled → Yellow,Completed → Green

Create a Print Format for the report with grouped totals.
6. Notifications
Send email notifications:

              When maintenance is completed
              When maintenance becomes overdue
              When maintenance is scheduled
7. Dashboard / KPIs
Create a dashboard for Machine Maintenance:
Number of completed maintenance tasks

Number of overdue maintenance tasks

Total maintenance cost this month

Add charts:

Pie chart for Status distribution (Scheduled, Completed, Overdue)

Maintenance cost trend by month

