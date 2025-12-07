frappe.ui.form.on('Machine Parts', {

    // When user selects Item (Part)
    part: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (!row.part) return;

        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Item Price",
                fieldname: "price_list_rate",
                filters: {
                    item_code: row.part
                }
            },
            callback: function(r) {
                if (r.message) {
                    frappe.model.set_value(cdt, cdn, "rate", r.message.price_list_rate);
                } else {
                    frappe.model.set_value(cdt, cdn, "rate", 0);
                    frappe.msgprint("No Item Price found for this Item.");
                }
                // calculate amount after setting rate
                calculate_amount(frm, cdt, cdn);
            }
        });
    },

    quantity: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    },

    rate: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    }
});

// Helper to compute amount
function calculate_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let amount = (row.quantity || 0) * (row.rate || 0);

    frappe.model.set_value(cdt, cdn, "amount", amount);
    frm.refresh_field('parts_used');
}
