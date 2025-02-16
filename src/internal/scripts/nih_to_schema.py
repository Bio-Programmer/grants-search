import json

def format_json_with_g_keys(input_data):
    formatted_data = {}
    
    for idx, item in enumerate(input_data, start=15):  # Start counting from 15
        # Create the new key (g15, g16, etc.)
        key = f"g{idx}"
        
        # Format the data according to the desired structure
        formatted_item = {
            "title": item["title"],
            "description": item["description"],
            "eligibility": item["eligibility"],
            "amountMin": item["amount_min"],
            "amountMax": item["amount_max"],
            "url": item["url"],
            "deadline": item["deadline"],
            "nextCycleStartDate": item["next_cycle_start"]
        }
        
        formatted_data[key] = formatted_item
    
    return formatted_data

def save_to_file(data, output_filename):
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Data successfully saved to {output_filename}")

# Read input JSON
with open("transformed_nih_projects.json", 'r', encoding='utf-8') as f:
    input_data = json.load(f)

formatted_data = format_json_with_g_keys(input_data)
output_filename = "nih_schema_output.json"
save_to_file(formatted_data, output_filename)