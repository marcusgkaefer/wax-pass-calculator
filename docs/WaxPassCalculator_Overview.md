# Wax Pass Calculator: UI/UX Workflow Overview

## 1. Purpose

The Wax Pass Calculator is a feature designed to help users easily understand and select the most beneficial Wax Pass options based on their chosen waxing services. It aims to replicate and enhance the logic currently present in spreadsheet-based calculators (`Price Sheet.html`, `User 1.html`, etc.) by providing a clear, interactive, and integrated in-app experience.

## 2. User Benefits

*   **Clarity on Savings:** Users can clearly see the per-visit and total savings for various pass options.
*   **Informed Decisions:** Provides all necessary information to choose the most economical pass for their needs.
*   **Flexible Payment Options:** Displays available payment plans (e.g., 2, 3, or 4 installments).
*   **Seamless Integration:** Guides the user from service selection to pass purchase within the app.
*   **Personalized Recommendations:** Shows relevant passes based on individually selected services.

## 3. Key Workflow Phases

The calculator workflow is divided into three main phases:

### Phase 1: Service Selection
*   Users browse and select one or more waxing services they are interested in.
*   A running summary of selected services and their standard prices is displayed.

### Phase 2: Pass Recommendations & Comparison
*   For each service selected by the user, the system identifies and displays all eligible Wax Pass options (Prepaid and Unlimited).
*   Detailed calculations are shown for each pass:
    *   Discounted price per visit.
    *   Savings per visit.
    *   Total pass cost.
    *   Total savings with the pass.
*   Available payment plans (Pay in Full, 2, 3, or 4 installments) are presented with calculated installment amounts.
*   Users can select a preferred pass and payment plan for each service.

### Phase 3: Summary & Checkout Integration
*   A summary of all chosen Wax Passes is presented, including the selected services, pass details, payment plans, and amounts due.
*   The user is then guided to the app's existing checkout process to complete the purchase.

## 4. Data Source Reference

*   The primary reference for service prices, pass rules, eligibility, and calculation logic is derived from the provided HTML spreadsheet exports:
    *   `docs/Price Sheet.html` (for master data)
    *   `docs/User 1.html`, `docs/User 2.html`, `docs/User 3.html` (for examples of user selections and calculations).

## 5. Core Assumptions (to be detailed in `WaxPassCalculator_DataModel_Assumptions.md`)

*   The system can access structured data representing services, their standard prices, and eligibility for different pass types.
*   Specific rules for Prepaid passes (e.g., "Buy X Get Y") are defined per service or globally.
*   Fixed total prices for each Unlimited pass variation (e.g., "12 Months Unlimited, 2-Week Visits") are available per eligible service.
*   Payment plan options (number of installments) are consistently applicable. 