# Validate Technician is present before submitting
if not doc.technician:
    frappe.throw("Technician is required before submission.")

# Get Default Company 
company = frappe.db.get_single_value("Global Defaults", "default_company")

# Intialise Accounts for the Debit and Credit
expense_acc = "Maintenance Expense - D"
cash_acc = "Cash/Bank - D"

# Create Journal Entry
je = frappe.new_doc("Journal Entry")
je.voucher_type = "Journal Entry"
je.company = company
je.posting_date = frappe.utils.nowdate()

# Store Machine Maintenance ID in Journal Entry
je.custom_machine_id = doc.name

# Add Debit Entry
je.append("accounts", {
    "account": expense_acc,
    "debit_in_account_currency": doc.cost
})

# Add Credit Entry
je.append("accounts", {
    "account": cash_acc,
    "credit_in_account_currency": doc.cost
})

# Insert & Submit the Journal Entry
je.insert()
je.submit()


frappe.msgprint(f"Journal Entry {je.name} created successfully and linked to Machine Maintenance {doc.name}.")
