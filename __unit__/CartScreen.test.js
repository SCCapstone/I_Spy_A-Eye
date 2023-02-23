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

// testing if the buy button exists
test("should find buy button via the id name", () => {
    const IdName = 'buyButton'
    const {getByTestId} = render(<CartScreen/>)
    const buyButton = getByTestId(IdName)
    expect(buyButton).toBeTruthy()
})

// test("", () => {
//     let product = {id: 1, name: 'Deluxe Mint Chocolate Chip Ice Cream', price: '5.00', quantity: 1}
//     const increment = renderer.create(<CartScreen/>).getInstance()
//     increment.incrementValue(product, 0)
//     expect(product).toEqual(expect.objectContaining({quantity: 2}))
// })