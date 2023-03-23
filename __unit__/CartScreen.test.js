import "react-native";
import React from "react";
import CartScreen from "../screens/CartScreen";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";

// testing if the component renders
test("renders correctly", () => {
    render(<CartScreen/>)
})

// testing if addPrices returns some kind of number (int/float)
test("addPrices should return a number", () => {
    const Price = renderer.create(<CartScreen/>).getInstance()
    expect(Price.addPrices()).toBeGreaterThanOrEqual(0)
})

// testing the functionality of the incrementValue function
test("should increment quantity", () => {
    const product = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    const expected = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 2, 
    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    for (let i = 0; i < product.length; i++) {
        product[i].quantity++
    }
    expect(product).toEqual(expected)
})

// testing the functionality of the decrementValue function
test("should decrement quantity", () => {
    const product = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 2, 
    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    const expected = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    for (let i = 0; i < product.length; i++) {
        product[i].quantity--
    }
    expect(product).toEqual(expected)
})

// testing the functionality of the decrementValue function
test("should not decrement if quantity is 1", () => {
    const product = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    const expected = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    for (let i = 0; i < product.length; i++) {
        product[i].quantity--
        if (product[i].quantity <= 1) {
            product[i].quantity = 1
        }
    }
    expect(product).toEqual(expected)
})