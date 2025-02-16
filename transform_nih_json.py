import json

# Load original NIH JSON file
with open("nih_active_projects.json", "r", encoding="utf-8") as f:
    nih_json = json.load(f)

# Transform the JSON into the desired format
app_json = []

for project in nih_json.get("results", []):  # Loop through all projects
    transformed_project = {
        "title": project.get("project_title", ""),
        "description": project.get("abstract_text", ""),
        "amount_min": project.get("award_amount", 0),
        "amount_max": project.get("award_amount", 0),  # Assuming same as min
        "url": project.get("project_detail_url", ""),
        "deadline": project.get("project_end_date", ""),
        "eligibility": ["Undergraduate", "Masters Student", "Coterm", "PhD"],  # Static list
        "next_cycle_start": ""  # Static empty string
    }
    
    app_json.append(transformed_project)

# Save the transformed JSON to a new file
with open("transformed_nih_projects.json", "w", encoding="utf-8") as f:
    json.dump(app_json, f, indent=4)

print("Transformed JSON successfully written to transformed_projects.json")