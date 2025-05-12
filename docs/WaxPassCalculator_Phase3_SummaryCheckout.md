# Wax Pass Calculator: Phase 3 - Summary & Checkout Integration

## 1. Overview

This final phase displays a summary of all Wax Passes the user has selected in Phase 2, along with their chosen payment plans. It then directs the user to the app's existing payment or checkout system to complete the purchase.

## 2. UI Elements & User Interaction

**Screen: "Review Your Selections" / "Order Summary" / Cart Integration**

*   **Layout:**
    *   This could be a dedicated summary screen or an integrated part of the app's existing shopping cart/checkout flow.
    *   If multiple passes were selected, each should be listed as a distinct item.
*   **Summary Item Display (for each chosen pass):
    *   `Service Name`: (e.g., "Brazilian")
    *   `Pass Details`: (e.g., "Prepaid (Buy 9, Get 3 Free)" or "Unlimited (13 Months, 2-Week Visits)")
    *   `Total Cost for this Pass`: (e.g., "$594.00")
    *   `Chosen Payment Plan`: (e.g., "4 Payments of $148.50")
    *   `Amount Due Today (for this pass)`: (e.g., "$148.50")
    *   `Future Payment Schedule (if applicable)`:
        *   A brief list of subsequent payment amounts and their due dates (e.g., "Next payment: $148.50 on [Date + 1 month]").
    *   `Savings for this Pass`: (e.g., "You're saving $198.00!")
    *   Option to "Edit" or "Remove" this pass selection, which would take the user back to Phase 2 (ideally, to the context of that specific service).
*   **Overall Totals Section:**
    *   `Subtotal Due Today`: Sum of all "Amount Due Today" for each selected pass.
    *   `Total Savings (All Passes)`: Sum of savings from all selected passes.
    *   Any applicable taxes or fees (if relevant to your app's checkout).
    *   `Grand Total Due Today`.
*   **Call to Action (CTA) Button:**
    *   Labeled "Proceed to Payment", "Confirm & Pay", or similar, appropriate for your app's checkout flow.

**User Flow:**

1.  User lands on this screen after making their pass selections in Phase 2.
2.  The screen displays a clear summary of each chosen Wax Pass, including the service, pass type, cost, chosen payment plan, amount due today, and future payment schedule (if any).
3.  The user can review all selections and total amounts.
4.  If the user wants to change a selection, they can use an "Edit" or "Remove" option for a specific pass, which should navigate them back appropriately (likely to Phase 2, focused on that service).
5.  Once satisfied, the user taps the "Proceed to Payment" CTA.
6.  The user is then transitioned to the app's standard payment processing screens.

## 3. Data Requirements & Assumptions (Input)

*   **Input from Phase 2:** A list of chosen pass configuration objects. Each object includes:
    *   `service_id` / `service_name`
    *   `pass_type_selected`
    *   `pass_title_display`
    *   `final_total_pass_cost`
    *   `selected_payment_plan`: { `installments`, `amount_per_installment`, `first_payment_due` }
    *   `total_savings_achieved_for_this_pass`

## 4. Integration with Checkout System

*   The `Grand Total Due Today` and the details of the items being purchased (the Wax Passes) must be passed to the payment processing system.
*   **Important Consideration for Subscriptions/Installments:** If your app supports recurring payments or subscriptions, the future payment schedule for installment plans needs to be handled correctly. This might involve:
    *   Storing the payment schedule associated with the user's account.
    *   Setting up recurring billing through your payment gateway if the passes are sold as subscriptions with installments.
    *   If the passes are one-time purchases with installments managed by an external financing option, ensure the handoff is smooth.
    *   The exact mechanism will depend on your existing payment infrastructure.

## 5. Post-Purchase

*   After successful payment, the user should see a confirmation.
*   The purchased Wax Passes should be reflected in the user's account/profile within the app, showing their validity, services covered, and any remaining visits or duration. 