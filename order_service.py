from flask import Flask, Request
from flask_restful import Resource, Api



order_data = {
    "dish_name": "dish1", 
    "quantity": 3, 
}

# URL of the Stock microservice
stock_url = "http://localhost:5000/stock"  

# Make an HTTP POST request to the Stock microservice
response = Request.post(stock_url, json=order_data)

# Check the response from the Stock microservice
if response.status_code == 200:
    updated_stock_data = response.json()
    print("Stock updated successfully:")
    print(updated_stock_data)
else:
    print("Failed to update stock")

