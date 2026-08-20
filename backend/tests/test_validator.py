from health_checks.validator import validate_record
from models.schemas import EXPECTED_SCHEMA
from confidence.scorer import calculate_record_confidence

sample_record = {
    "product_name": "Lenovo IdeaPad Slim 3",
    "number_of_reviews": 3,
    "stock_availability": "In stock",
    "product_page_url": "https://amazon.in/xyz"
}

issues = validate_record(sample_record, EXPECTED_SCHEMA["amazon_laptops"])
print(issues)
confidence_result = calculate_record_confidence(sample_record, EXPECTED_SCHEMA["amazon_laptops"])
print(confidence_result)