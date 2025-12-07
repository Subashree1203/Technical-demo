frappe.ui.form.on('Machine Maintenance', {

    // ONLOAD: Set default maintenance date + toggle notes visibility
    onload: function(frm) {
        // Auto-set today's date on new documents
        if (frm.is_new() && !frm.doc.maintenance_date) {
            frm.set_value('maintenance_date', frappe.datetime.get_today());
        }

        toggle_notes(frm);
    },

    // REFRESH: Button logic, overdue update, UI toggles
    refresh: function(frm) {

        toggle_notes(frm);
        update_overdue(frm);

        // Check if user is a technician
        const technician = frappe.user_roles.includes("Technician");

        // Show "Mark Completed" button only for technicians on draft docs
        // AND status is neither "Open" nor "Completed"
        if (
            technician &&
            frm.doc.status !== "Open" &&
            frm.doc.status !== "Completed" &&
            frm.doc.docstatus === 0
        ) {
            frm.add_custom_button('Mark Completed', () => {

                frm.set_value('status', 'Completed');
                frm.set_value('completion_date', frappe.datetime.get_today());

                frm.save();
            });
        }
    },

    // When maintenance date changes, recalc overdue
    maintenance_date: function(frm) {
        update_overdue(frm);
    },

    // CHILD TABLE EVENTS: Add / Remove rows triggers cost calculation
    parts_used_add: function(frm) {
        calculate_total_cost(frm);
    },

    parts_used_remove: function(frm) {
        calculate_total_cost(frm);
    }
});


// CHILD TABLE – Machine Parts
// Handles rate fetching and amount calculation

frappe.ui.form.on('Machine Parts', {

    // Fetch item rate when part is chosen
    part: function(frm, cdt, cdn) {
        fetch_item_rate(frm, cdt, cdn);
    },

    // Recalculate row amount when quantity changes
    quantity: function(frm, cdt, cdn) {
        calc_row_amount(frm, cdt, cdn);
    },

    // Recalculate row amount when rate changes
    rate: function(frm, cdt, cdn) {
        calc_row_amount(frm, cdt, cdn);
    }
});

// Show/Hide Notes section depending on status
function toggle_notes(frm) {
    frm.set_df_property('notes', 'hidden', frm.doc.status === "Scheduled");
}

// Mark maintenance as overdue when date has passed
function update_overdue(frm) {

    // Skip if no date or already completed
    if (!frm.doc.maintenance_date || frm.doc.status === "Completed") return;

    // If today > maintenance_date → mark as Overdue
    if (frappe.datetime.get_diff(frappe.datetime.get_today(), frm.doc.maintenance_date) > 0) {
        frm.set_value('status', 'Overdue');
    }
}

// Fetch the item rate from Item Price for selected item
function fetch_item_rate(frm, cdt, cdn) {

    let row = locals[cdt][cdn];
    if (!row.part) return;

    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Item Price",
            fieldname: "price_list_rate",
            filters: {
                item_code: row.part,
                selling: 1
            }
        },
        callback: function(r) {

            let rate = r.message ? r.message.price_list_rate : 0;

            // Set rate on row
            frappe.model.set_value(cdt, cdn, "rate", rate);

            // Recalculate amount
            calc_row_amount(frm, cdt, cdn);
        }
    });
}

// Calculate amount for each child table row → qty × rate
function calc_row_amount(frm, cdt, cdn) {

    let row = locals[cdt][cdn];

    let amount = (row.quantity || 0) * (row.rate || 0);

    frappe.model.set_value(cdt, cdn, "amount", amount);

    calculate_total_cost(frm);
}

// Sum all row amounts into the parent "cost" field
function calculate_total_cost(frm) {

    let total = 0;

    (frm.doc.parts_used || []).forEach(row => {
        total += row.amount || 0;
    });

    frm.set_value("cost", total);
}
