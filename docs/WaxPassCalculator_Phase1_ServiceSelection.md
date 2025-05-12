# Wax Pass Calculator: Phase 1 - Service Selection

## 1. Overview

This phase allows users to select the waxing services they are interested in. The selections made here will determine which Wax Pass options are presented in the next phase.

## 2. UI Elements & User Interaction

**Screen: "Choose Your Services"**

*   **Layout:**
    *   A clean, scrollable list of services.
    *   Services are grouped by categories (e.g., "Face", "Body", "Bikini Area") for easy navigation. These categories should be derived from the service data.
*   **Service Display (for each service item):
    *   `Service Name`: (e.g., "Eyebrows", "Brazilian")
    *   `Standard Price`: (e.g., "$25", "$66")
    *   `Add Button`: A `+` icon or a button labeled "Select" or "Add".
*   **Search Functionality:**
    *   A prominent search bar allowing users to type and filter the service list by name.
*   **"My Selections" Summary Section:**
    *   Can be a collapsible section at the bottom or a persistent sidebar.
    *   Updates in real-time as the user adds/removes services.
    *   Lists each selected service and its standard price.
    *   Displays a running subtotal of the standard prices of all selected services (this is for user information before pass calculations).
    *   Each item in the summary should have a "Remove" option (e.g., an `X` icon or a "Remove" button).
*   **Call to Action (CTA) Button:**
    *   Labeled "Find My Best Pass" or "Calculate Savings".
    *   This button is disabled if no services are selected and becomes enabled once at least one service is added to "My Selections".

**User Flow:**

1.  User navigates to the Wax Pass Calculator (starting at this screen).
2.  User can browse services by scrolling through categories or use the search bar.
3.  User taps the "Add" button next to a service they are interested in.
    *   The service is added to the "My Selections" summary.
    *   The subtotal in the summary updates.
    *   The CTA button becomes enabled if it was previously disabled.
4.  User can add multiple services.
5.  User can remove a service from "My Selections" by tapping its corresponding "Remove" option.
    *   The service is removed from the summary.
    *   The subtotal updates.
    *   If no services remain selected, the CTA button becomes disabled.
6.  Once the user is satisfied with their selections, they tap the "Find My Best Pass" button.

## 3. Data Requirements & Assumptions (Input)

*   **Input from Data Model:** A list of all available service objects.
*   **Each Service Object should contain (at minimum):
    *   `service_id` (unique identifier)
    *   `service_name` (display name, e.g., "Brazilian")
    *   `standard_price` (numerical value, e.g., 66)
    *   `category` (e.g., "Bikini Area", "Face")
    *   `is_eligible_for_prepaid_pass` (boolean)
    *   `is_eligible_for_unlimited_pass` (boolean)

## 4. Data Flow (Output to Phase 2)

*   Upon tapping the CTA, the system passes a list of the selected `service_id`s (or `service_name`s if used as primary keys for lookup) to Phase 2.
    *   Example: `["brazilian_service_id", "underarms_service_id"]` 