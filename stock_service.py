from flask import Flask, request, jsonify
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

stock = {
    "dish1": {"name": "Dish 1", "quantity": 10},
    "dish2": {"name": "Dish 2", "quantity": 5},
}

class Stock(Resource):
    def get(self):
        return stock

    def put(self, dish_name):
        data = request.get_json()
        # Update the stock
        if dish_name in stock:
            stock[dish_name] = data
            return stock[dish_name]
        else:
            return {"message": "Dish not found"}, 404

    def post(self):
        data = request.get_json()
        dish_name = data.get("dish_name")
        quantity = data.get("quantity")
        # Check if the dish exists in stock
        if dish_name in stock:
            if stock[dish_name]["quantity"] >= quantity:
                stock[dish_name]["quantity"] -= quantity
                return stock[dish_name]
            else:
                return {"message": "Not enough stock"}, 400
        else:
            return {"message": "Dish not found"}, 404

api.add_resource(Stock, '/stock')

if __name__ == '__main__':
    app.run(debug=True)

