frappe.query_reports["Machine Maintenance Consolidated"] = {
    "filters": [
        {
            "fieldname": "machine",
            "label": __("Machine"),
            "fieldtype": "Link",
            "options": "Item",
            "width": 200
        },
        {
            "fieldname": "technician",
            "label": __("Technician"),
            "fieldtype": "Link",
            "options": "Employee",
            "width": 160
        },
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "width": 120
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "width": 120
        },
        {
            "fieldname": "consolidated",
            "label": __("Consolidated"),
            "fieldtype": "Check",
            "default": 0
        }
    ],

    "formatter": function(value, row, column, idData, default_formatter) {
        value = default_formatter(value, row, column, idData);
        value = $(`<div>${value}</div>`);  // wrap value

        const LValue = $(value).css("font-weight", "normal");

        // Color based on Status
        if (idData && column.fieldname === "status") {
            if (idData.status === "Overdue") {
                LValue.addClass('bg-danger text-black w-100 h-100'); // Red
            } else if (idData.status === "Scheduled") {
                LValue.addClass('bg-warning text-black w-100 h-100'); // Yellow
            } else if (idData.status === "Completed") {
                LValue.addClass('bg-success text-black w-100 h-100'); // Green
            } else if (idData.status === "Consolidated") {
                LValue.addClass('bg-info text-black w-100 h-100'); // Blue
            }
        }

        value = LValue.wrap("<p></p>").parent().html();  // wrap with paragraph
        return value;
    }
};