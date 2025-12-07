# Columns for the Report
def get_columns(filters):
    columns = [
        {"fieldname": "machine", "label": _("Machine"), "fieldtype": "Link", "options": "Item", "width": 200},
        {"fieldname": "maintenance_date", "label": _("Maintenance Date"), "fieldtype": "Date", "width": 120},
        {"fieldname": "technician", "label": _("Technician"), "fieldtype": "Link", "options": "Employee", "width": 160},
        {"fieldname": "status", "label": _("Status"), "fieldtype": "Data", "width": 120},
        {"fieldname": "total_cost", "label": _("Total Cost"), "fieldtype": "Currency", "width": 130},
    ]
    return columns


# Fetch Data for the Report
def get_data(filters):

    # Consolidates multiple rows per machine into a single summary row
    def consolidate_results(data):
        summary = {}
        for row in data:
            key = row.machine

            # Initialize summary row
            if key not in summary:
                summary[key] = {
                    "machine": row.machine,
                    "maintenance_date": None,
                    "technician": None,
                    "status": "Consolidated",
                    "total_cost": 0
                }

            # Add cost to the total
            summary[key]["total_cost"] = (summary[key]["total_cost"] or 0) + (row.total_cost or 0)

        return list(summary.values())

    # Check if consolidation enabled
    consolidated = filters.get("consolidated")

    # Build SQL filter conditions
    conditions = ""
    if filters.get("machine"):
        conditions += " AND mm.machine_name = %(machine)s"
    if filters.get("technician"):
        conditions += " AND mm.technician = %(technician)s"
    if filters.get("from_date") and filters.get("to_date"):
        conditions += " AND mm.maintenance_date BETWEEN %(from_date)s AND %(to_date)s"

    # Query Machine Maintenance records
    sql = f"""
        SELECT
            mm.name,
            mm.machine_name AS machine,
            mm.maintenance_date,
            mm.technician,
            mm.status,
            mm.cost AS total_cost
        FROM `tabMachine Maintenance` mm
        WHERE mm.docstatus < 2
        {conditions}
        ORDER BY mm.machine_name, mm.maintenance_date
    """

    results = frappe.db.sql(sql, filters, as_dict=True)

    # Return consolidated or detailed results
    return consolidate_results(results) if consolidated else results

# Report Execution
data = get_columns(filters), get_data(filters)
