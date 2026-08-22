EXPECTED_SCHEMA = {
    "amazon_laptops": {
        "product_name": {"type": "string", "required": True},
        "price": {"type": "number", "required": True, "min": 0},
        "number_of_reviews": {"type": "number", "required": True, "min": 0},
        "stock_availability": {"type": "string", "required": True, "allowed_values": ["In stock", "Out of stock", "Limited stock"]},
        "product_page_url": {"type": "string", "required": True},
    }
}

EXPECTED_SCHEMA["books"] = {
    "book_title": {"type": "string", "required": True},
    "price": {"type": "dict", "required": True},  
    "star_rating": {"type": "string", "required": True},
    "stock_availability": {"type": "string", "required": True},
    "product_page_url": {"type": "string", "required": True},
}