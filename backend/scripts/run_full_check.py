import json
import requests

def run_check(collector_name, file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    
    response = requests.post(
        f"http://127.0.0.1:8000/check/{collector_name}",
        json=records
    )
    result = response.json()
    print(f"\n=== {collector_name} ===")
    print(f"Records checked: {result['records_checked']}")
    print(f"Average confidence: {result['average_confidence']}%")
    return result

if __name__ == "__main__":
    run_check("amazon_laptops", "../scrapers/amazon_latest.json")
    run_check("books", "../scrapers/books_latest.json")