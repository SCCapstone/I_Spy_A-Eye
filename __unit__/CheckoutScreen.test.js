import "react-native";
import React from "react";
import CheckoutScreen from "../screens/CheckoutScreen";
import {
  replaceSecurityCodeWithAsterisks,
  showOnlyFourDigitsOfCardNumber,
} from "../utils/CheckoutScreenFunctions";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";

// testing if the component renders
test("renders correctly", () => {
  render(<CheckoutScreen />);
});

test("The returned value should be 12 *'s followed by the last 4 digits of the card number.", () => {
  const obfuscatedResult = showOnlyFourDigitsOfCardNumber("0000000000001234");
  expect(obfuscatedResult).toBe("************1234");
});

test("The retuned value where the input is the empty string should be the empty string.", () => {
  const obfuscatedResult = showOnlyFourDigitsOfCardNumber("");
  expect(obfuscatedResult).toBe("");
});

test("A three digit security code as input should have '***' be returned as the output", () => {
  const obfuscatedResult = replaceSecurityCodeWithAsterisks("123");
  expect(obfuscatedResult).toBe("***");
});

test("An empty string as the input should have '' be returned as the output", () => {
    const obfuscatedResult = replaceSecurityCodeWithAsterisks("");
    expect(obfuscatedResult).toBe("");
  });
