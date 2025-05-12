# Wax Pass Calculator: Phase 2 - Pass Recommendations & Comparison

## 1. Overview

This phase takes the services selected by the user in Phase 1 and presents all eligible Wax Pass options for each service individually. It performs the necessary calculations to show discounted prices, savings, and payment plan breakdowns, allowing the user to make an informed choice.

## 2. UI Elements & User Interaction

**Screen: "Your Wax Pass Options"** (or similar title)

*   **Layout:**
    *   The screen is organized by the services selected in Phase 1.
    *   For each selected service, its `Service Name` and `Standard Price` are displayed as a section header.
    *   Under each service header, a series of "Pass Cards" are displayed for all eligible Wax Passes.
*   **Pass Card Display (for each eligible pass option under a service):
    *   `Pass Title`: (e.g., "Brazilian - Unlimited (12 Months, 2-Week Visits)", "Eyebrows - Prepaid (Buy 9, Get 3 Free)")
    *   `Your Price Per Visit`: Calculated discounted price.
    *   `Standard Price Per Visit`: Reiterated for comparison.
    *   `Savings Per Visit`: Clearly shown (e.g., "You save $16.50 each time!").
    *   `Total Pass Cost`: Full price for the pass package (e.g., "$594 for 12 visits" or "$332 for 13 months unlimited").
    *   `Total Services/Duration`: (e.g., "12 services total" or "Unlimited visits for 13 months (approx. 28 visits)").
    *   `Total Savings with Pass`: Total amount saved over the life of the pass.
    *   `Payment Options Section`:
        *   Radio buttons or a segmented control for: "Pay in Full", "2 Payments", "3 Payments", "4 Payments".
        *   Displays the calculated amount per installment next to each option (e.g., "4 Payments of $148.50 each").
        *   Defaults to "Pay in Full" or the most common/recommended option.
    *   `Details/Info Icon (Optional)`: A small `(i)` icon to provide a brief explanation of the pass terms if needed (e.g., "Visit every 2 weeks for 12 months" or "Prepay for 9 services, get 3 additional free").
    *   `Select This Pass Button`: A button to choose this specific pass configuration (including the selected payment plan) for the service.
*   **UX Enhancements:**
    *   **"Best Value" Badge:** Optionally highlight the pass card that offers the most significant percentage or absolute savings for that particular service.
    *   **Clear Demarcation:** Visually separate the sections for each selected service if multiple services were chosen in Phase 1.
    *   **Navigation:** A clear way to go back to Phase 1 to modify service selections.

**User Flow:**

1.  User lands on this screen after selecting services in Phase 1.
2.  The screen displays sections for each selected service.
3.  Within each service section, the user sees cards for all applicable pass types (Prepaid, Unlimited based on eligibility).
4.  For each pass card, the user can see all calculated financial details and savings.
5.  User can interact with the "Payment Options" selector on a pass card to see how installment payments change.
6.  User can decide to select a pass for one service, multiple services, or no passes at all.
7.  To select a pass, the user clicks the "Select This Pass" button on the desired pass card (this action implies the currently selected payment option for that pass is also chosen).
    *   The UI could visually indicate which pass has been selected for a service (e.g., highlighting the card or button, changing button text to "Selected").
    *   A user can change their mind and select a different pass or payment option for the same service; the latest selection for that service is what counts.
8.  Once the user has made their pass selections (if any) for the services they are interested in, they proceed via a main CTA button like "Continue to Summary" or "Add to Cart".

## 3. Logic & Calculations Engine

*   **Input:** List of selected `service_id`s (or names) from Phase 1.
*   **For each `service_id`:**
    1.  **Fetch Service Data:**
        *   `standard_price`
        *   `is_eligible_for_prepaid_pass`
        *   `is_eligible_for_unlimited_pass`
    2.  **If `is_eligible_for_prepaid_pass`:**
        *   Fetch all applicable prepaid pass rules for this service (e.g., B9G3, B9G2, B6G1).
        *   For each rule:
            *   `Total Pass Cost` = `standard_price` × `rule.paid_services`
            *   `Total Services in Pass` = `rule.paid_services` + `rule.free_services`
            *   `Discounted Price Per Visit` = `Total Pass Cost` / `Total Services in Pass`
            *   `Savings Per Visit` = `standard_price` - `Discounted Price Per Visit`
            *   `Total Savings with Pass` = `Savings Per Visit` × `Total Services in Pass`
            *   Generate display data for the pass card.
    3.  **If `is_eligible_for_unlimited_pass`:**
        *   Fetch all applicable unlimited pass types for this service (e.g., 12U2, 12U3, 13U2, 13U3).
        *   For each unlimited pass type:
            *   Retrieve its fixed `total_pass_price` (specific to this service and pass type).
            *   Retrieve its `estimated_visits_for_savings_calculation`.
            *   `Discounted Price Per Visit (Effective)` = `total_pass_price` / `estimated_visits`
            *   `Savings Per Visit` = `standard_price` - `Discounted Price Per Visit (Effective)`
            *   `Total Savings with Pass` = `Savings Per Visit` × `estimated_visits`
            *   Generate display data for the pass card.
    4.  **Payment Plan Calculations:**
        *   For any `Total Pass Cost` calculated above, provide options for 2, 3, and 4 installments by dividing `Total Pass Cost` by the number of installments. Ensure correct rounding to match spreadsheet examples.

## 4. Data Requirements & Assumptions

*   Access to the structured data model (detailed in `WaxPassCalculator_DataModel_Assumptions.md`). This includes:
    *   Service details (standard price, pass eligibility).
    *   Definitions of prepaid pass rules (paid services, free services).
    *   Fixed total costs for *each specific service and unlimited pass type combination*.
    *   Estimated number of visits for calculating savings on unlimited passes.

## 5. Data Flow (Output to Phase 3)

*   A list of *chosen* pass configurations. Each item in the list represents a pass selected by the user for a specific service and should include:
    *   `service_id` / `service_name`
    *   `pass_type_selected` (e.g., "Prepaid B9G3", "Unlimited 13U2")
    *   `pass_title_display` (e.g., "Brazilian - Prepaid (Buy 9, Get 3 Free)")
    *   `final_total_pass_cost` (the total cost of the chosen pass for this service)
    *   `selected_payment_plan`: An object like `{ installments: 4, amount_per_installment: 148.50, first_payment_due: 148.50 }`
    *   `total_savings_achieved_for_this_pass` 