import "react-native";
import React from "react";
import CheckoutScreen from "../screens/CheckoutScreen";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";

// testing if the component renders
test("renders correctly", () => {
    render(<CheckoutScreen/>)
})