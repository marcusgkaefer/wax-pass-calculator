# Wax Pass Calculator: Data Model Assumptions

## 1. Overview

This document outlines the assumed data structures and availability required for the Wax Pass Calculator to function correctly. The actual data model will be defined and implemented at a later stage. These assumptions are based on the analysis of `Price Sheet.html` and the user-specific `User X.html` files.

## 2. Service Data

It's assumed that a structured list of all available waxing services can be accessed. Each service object would ideally contain:

*   `service_id`: A unique identifier for the service (e.g., "arms_full", "brazilian").
*   `service_name`: The display name of the service (e.g., "Arms - Full", "Brazilian").
*   `standard_price`: The regular, non-discounted price of the service (e.g., `52` for Arms - Full).
*   `category`: For UI grouping (e.g., "Body", "Face", "Bikini Area").
*   `is_eligible_for_prepaid_pass`: Boolean, indicating if the service can be included in a prepaid pass (derived from Column C in `Price Sheet.html`).
*   `is_eligible_for_unlimited_pass`: Boolean, indicating if the service can be included in an unlimited pass (derived from Column D in `Price Sheet.html`).
*   `prepaid_pass_rules_applicable`: (If `is_eligible_for_prepaid_pass` is true) A list of identifiers or objects representing the types of prepaid passes available for this service (e.g., ["B9G3", "B9G2", "B6G1"]).
*   `unlimited_pass_options_available`: (If `is_eligible_for_unlimited_pass` is true) A list of identifiers or objects representing the types of unlimited passes available for this service (e.g., ["12U2", "12U3", "13U2", "13U3"]).

## 3. Prepaid Pass Rule Definitions

For each type of prepaid pass (e.g., "B9G3"), a definition is needed:

*   `pass_rule_id`: (e.g., "B9G3")
*   `description`: (e.g., "Buy 9, Get 3 Free")
*   `paid_services`: The number of services the user pays for (e.g., `9`).
*   `free_services`: The number of additional free services (e.g., `3`).

**Calculation Basis:**
*   `Total Pass Cost` for a service with this rule = `service.standard_price` × `paid_services`.
*   `Total Services in Pass` = `paid_services` + `free_services`.
*   `Discounted Price Per Visit` = `Total Pass Cost` / `Total Services in Pass`.

## 4. Unlimited Pass Option Definitions

For each type of unlimited pass (e.g., "12U2") *and for each specific service it applies to*, a detailed definition is needed. This is because the total price of an unlimited pass often varies by service.

*   `unlimited_pass_config_id`: A unique ID for a specific service + unlimited pass type combination (e.g., "brazilian_12U2").
*   `service_id_fk`: Foreign key linking to the `service_id`.
*   `pass_type_code`: (e.g., "12U2", "12U3", "13U2", "13U3" - from `Price Sheet.html` headers).
*   `description`: (e.g., "12 Months Unlimited, visits every 2 weeks").
*   `total_pass_price`: **This is a fixed, specific price** for *this service* with *this unlimited pass type*. This value is crucial and is observed in the `User X.html` files (e.g., $714 for Bikini Full 12U2WK in User 1.html; $332 for Underarms 13U2WK in User 3.html).
*   `duration_months`: (e.g., `12` for 12U2, `13` for 13U2).
*   `visit_frequency_weeks`: (e.g., `2` for 2WK, `3` for 3WK).
*   `estimated_visits_for_savings_calculation`: The number of visits used as a basis for calculating per-visit savings (e.g., for 12 months/2-week visits, this might be `(52 weeks / 2) = 26 visits`. For 13 months/2-week, `( (52/12*13) / 2 ) approx 28 visits`. The exact number should match spreadsheet logic if specified, or be consistently calculated).

**Calculation Basis:**
*   `Discounted Price Per Visit (Effective)` = `total_pass_price` / `estimated_visits_for_savings_calculation`.

## 5. Payment Plans

*   It's assumed that payment plans (Pay in Full, 2 Payments, 3 Payments, 4 Payments) are universally available for all passes that result in a `Total Pass Cost`.
*   The installment calculation is `Total Pass Cost / number_of_installments`.
*   First payment is due today, subsequent payments are monthly on the same day of the month.

## 6. Data Accessibility

The application must have an efficient way to:
*   Fetch all services and their basic details.
*   For a given service, determine its eligibility for prepaid/unlimited passes.
*   For a service eligible for prepaid passes, retrieve the list of applicable prepaid rules (B9G3, etc.).
*   For a service eligible for unlimited passes, retrieve the list of specific unlimited pass configurations (including their unique `total_pass_price` for that service and pass type).

This structured approach to data will be essential for the calculation engine to accurately replicate the spreadsheet outcomes. 