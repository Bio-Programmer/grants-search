import requests
import json
from datetime import datetime

# Define the API endpoint
API_URL = "https://api.reporter.nih.gov/v2/projects/search"

# Define headers
HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def fetch_projects_batch(org_name, offset, limit):
    """
    Fetch a batch of active projects from the NIH Reporter API.

    Args:
        org_name (str): Name of the organization to filter by.
        offset (int): Offset for pagination.
        limit (int): Number of records to fetch per request.

    Returns:
        tuple: (results list, metadata dictionary)
    """
    payload = {
        "criteria": {
            "org_names": [org_name],
            "include_active_projects": True  # ✅ New simplified filter
        },
        "include_fields": [
            "ApplId", "SubprojectId", "FiscalYear", "Organization", "ProjectNum",
            "ProjectNumSplit", "ContactPiName", "AllText", "FullStudySection",
            "ProjectStartDate", "ProjectEndDate", "ProjectTitle", "AbstractText", 
            "AwardAmount", "ProjectDetailUrl"
        ],
        "offset": offset,  # Proper pagination handling
        "limit": limit,
        "sort_field": "project_start_date",
        "sort_order": "desc"
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)

    if response.status_code == 200:
        data = response.json()
        return data.get("results", []), data.get("meta", {})
    else:
        print(f"Error {response.status_code}: {response.text}")
        return [], {}

def fetch_all_active_projects(org_name, limit=500):
    """
    Fetch all active projects for the given organization using pagination.

    Args:
        org_name (str): Name of the organization to filter by.
        limit (int): Maximum number of records per request (default: 500).

    Returns:
        dict: Dictionary containing metadata and all active project results.
    """
    offset = 0
    all_results = []
    metadata = {}

    while True:
        results, meta = fetch_projects_batch(org_name, offset, limit)

        # Store metadata only once (from the first response)
        if not metadata and meta:
            metadata = meta

        # Append fetched results
        all_results.extend(results)
        print(f"Retrieved {len(all_results)} records (offset: {offset})...")

        # Break when fewer than 'limit' results are returned, meaning no more data to fetch
        if len(results) < limit:
            break

        offset += limit  # ✅ Properly increment offset for next batch

    return {"meta": metadata, "results": all_results}

def save_results_to_file(data, filename="nih_active_projects.json"):
    """
    Save the fetched active NIH project data to a file.

    Args:
        data (dict): The dictionary containing metadata and results.
        filename (str): The output file name (default: 'nih_active_projects.txt').
    """
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    print(f"All active projects written to {filename}")

# Main execution
if __name__ == "__main__":
    organization = "STANFORD UNIVERSITY"
    project_data = fetch_all_active_projects(organization)
    save_results_to_file(project_data)