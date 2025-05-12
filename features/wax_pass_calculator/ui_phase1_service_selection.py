"""
Conceptual UI logic for Phase 1: Service Selection of the Wax Pass Calculator.

This script simulates how the UI for service selection might interact with the
calculator_engine.py. It's not a real UI, but rather a placeholder for the
logic that a real UI framework (React, Vue, Swift, Kotlin, etc.) would implement.
"""

# Assuming calculator_engine.py is in the same directory or accessible via path
from .calculator_engine import MASTER_PRICE_SHEET_DATA, get_service_details 

class ServiceSelectionScreen:
    def __init__(self):
        self.all_services = MASTER_PRICE_SHEET_DATA['services']
        self.selected_services_data = [] # Stores dicts of selected service details
        self.selected_service_names = [] # Stores just the names for passing to next phase

    def display_available_services(self):
        """Simulates displaying all available services, grouped by category."""
        print("--- Welcome to the Wax Pass Calculator! ---")
        print("Please select the services you're interested in:")
        
        # Group services by category for display
        categories = {}
        for name, details in self.all_services.items():
            cat = details.get('category', 'Uncategorized')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append((name, details['standard_price']))
        
        service_options = []
        service_index = 1
        for category, services_in_cat in categories.items():
            print(f"\n--- {category} ---")
            for name, price in services_in_cat:
                print(f"  {service_index}. {name} - ${price}")
                service_options.append(name)
                service_index += 1
        return service_options

    def handle_user_selection(self, available_options):
        """Simulates user selecting services from the displayed list."""
        print("\nEnter the numbers of the services you want, separated by commas (e.g., 1,3,5).")
        print("Or type 'done' when finished.")
        
        while True:
            user_input = input("> ")
            if user_input.lower() == 'done':
                if not self.selected_service_names:
                    print("Please select at least one service to proceed.")
                    continue # Or re-prompt, or allow exiting
                break

            try:
                choices = [int(i.strip()) for i in user_input.split(',')]
                current_round_selections = []
                valid_choice_made = False
                for choice_idx in choices:
                    if 1 <= choice_idx <= len(available_options):
                        service_name = available_options[choice_idx - 1]
                        if service_name not in self.selected_service_names:
                            service_details = get_service_details(service_name)
                            if service_details:
                                self.selected_service_names.append(service_name)
                                self.selected_services_data.append({
                                    'name': service_name,
                                    'standard_price': service_details['standard_price']
                                })
                                current_round_selections.append(service_name)
                                valid_choice_made = True
                            else:
                                print(f"Warning: Details for '{service_name}' not found.")
                        else:
                            print(f"Info: '{service_name}' is already selected.")
                            valid_choice_made = True # Still a valid interaction
                    else:
                        print(f"Invalid choice: {choice_idx}. Please choose from available numbers.")
                
                if current_round_selections:
                    print(f"Added: {", ".join(current_round_selections)}")
                
                if self.selected_services_data:
                    print("\n--- Your Selections ---")
                    total_standard_cost = 0
                    for item in self.selected_services_data:
                        print(f"  - {item['name']} (${item['standard_price']})")
                        total_standard_cost += item['standard_price']
                    print(f"Subtotal (Standard Price): ${total_standard_cost:.2f}")
                    print("\nAdd more services by number, or type 'done'.")
                elif valid_choice_made: # A choice was made but maybe it was already selected
                    print("No new services added. Add services by number, or type 'done'.")
                
            except ValueError:
                print("Invalid input. Please use numbers separated by commas, or type 'done'.")
        
        print("\nProceeding to find best pass options for:")
        for service in self.selected_service_names:
            print(f"- {service}")
        return self.selected_service_names

    def run_phase1(self):
        """Runs the simulated Phase 1 service selection process."""
        available_options = self.display_available_services()
        selected_services = self.handle_user_selection(available_options)
        # In a real app, these selected_services would be passed to the UI for Phase 2.
        return selected_services

if __name__ == '__main__':
    # This simulates running Phase 1 and getting the selected services.
    # The output (selected_service_names) would then be the input for Phase 2 UI logic.
    ui_phase1 = ServiceSelectionScreen()
    final_selected_services = ui_phase1.run_phase1()
    print("\nPhase 1 Complete. Selected services to pass to Phase 2:", final_selected_services)

    # Conceptual next step: Call Phase 2 UI with final_selected_services
    # e.g., ui_phase2 = ServiceRecommendationScreen(final_selected_services)
    # ui_phase2.run_phase2() 