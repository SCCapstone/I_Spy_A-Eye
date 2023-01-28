import "react-native";
import React from "react";
import CartScreen from "../screens/CartScreen";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";

// testing to make sure jest works
test("function test", () => {
    const Cart = renderer.create(<CartScreen/>).getInstance()
    expect(Cart.addProduct(2)).toEqual(20)
})

// testing if the component renders
test("renders correctly", () => {
    render(<CartScreen/>)
})

// testing if addPrices returns some kind of number (int/float)
test("addPrices should return a number", () => {
    const Price = renderer.create(<CartScreen/>).getInstance()
    expect(Price.addPrices()).toBeGreaterThanOrEqual(0)
})

// testing if the buy button exists
test("should find buy button via the id name", () => {
    const IdName = 'buyButton'
    const {getByTestId} = render(<CartScreen/>)
    const buyButton = getByTestId(IdName)
    expect(buyButton).toBeTruthy()
})