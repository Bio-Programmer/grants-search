from openai import OpenAI
import requests
from bs4 import BeautifulSoup
import json
import os

# Initialize OpenAI client
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# Load grant example template
with open("./grant_example.json", "r") as f:
    GRANT_EXAMPLE = f.read()


def extract_html(url: str) -> str:
    """Fetch HTML content from a given URL.

    Args:
        url: The URL to fetch content from

    Returns:
        The HTML content as a string, or empty string if fetch fails
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return ""


def extract_grants(text_content: str, url: str) -> dict:
    """Extract grant links from HTML content using OpenAI.

    Args:
        text_content: The HTML content to analyze
        url: The source URL of the content

    Returns:
        A dictionary containing a list of grant URLs
    """
    prompt = f"""
    Given the following html content from the webpage {url}, extract a list of links to grants on this page. 
    The links should refer to the specific grant programs and not be other informational pages.

    If we are on a webpage displaying grant information, return a JSON with the field "links" that is a list 
    of urls to the grant pages. Importantly, I need the full urls, not relative ones. If no grants are listed, 
    the list should be empty.

    HTML content:
    {text_content}
    """

    response = client.chat.completions.create(
        model="o3-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    try:
        return json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        print("Error: Unable to parse the API response as JSON.")
        return {"links": []}


def extract_grant_info(text_content: str) -> dict:
    """Extract structured grant information from HTML content using OpenAI.

    Args:
        text_content: The HTML content to analyze

    Returns:
        A dictionary containing the extracted grant information
    """
    prompt = f"""
    Given the following html content from a webpage, extract grant information as well as possible 
    according to the json schema of this example:

    ---
    {GRANT_EXAMPLE}
    ---

    If a field is not available, just put null into the corresponding field. Return the json.

    HTML content:
    {text_content}
    """

    response = client.chat.completions.create(
        model="o3-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    try:
        return json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        print("Error: Unable to parse the API response as JSON.")
        return {}


def main(url: str) -> None:
    """Main function to scrape and process grant information.

    Args:
        url: The URL to start scraping from
    """
    # Get initial page content
    html_content = extract_html(url)
    grants = extract_grants(html_content, url)

    # Process each grant link
    all_grants = []
    for grant_link in grants.get("links", []):
        page_content = extract_html(grant_link)
        grant_data = extract_grant_info(page_content)
        all_grants.append(grant_data)

    # Save results
    with open('grants.jsonl', 'w') as f:
        for grant in all_grants:
            json.dump(grant, f)
            f.write('\n')

    print(f"Saved {len(all_grants)} grants to grants.jsonl")


if __name__ == '__main__':
    main("https://undergradresearch.stanford.edu/fund-your-project/explore-student-grants/small")