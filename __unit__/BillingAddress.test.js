import "react-native";
import { expiryIsValidOrEmpty, nameIsValidOrEmpty, securityCodeIsValidOrEmpty, cardNumberIsValidOrEmpty } from "../utils/BillingInfoFunctions";

test("Expiry must contain a '/'", () => {
  const validExpiry = expiryIsValidOrEmpty("01-24");
  expect(validExpiry).toBe(false);
});

test("Expiry can't have invalid month", () => {
  const validExpiry = expiryIsValidOrEmpty("00/24");
  expect(validExpiry).toBe(false);
});

test("Expiry can't have invalid month", () => {
  const validExpiry = expiryIsValidOrEmpty("13/24");
  expect(validExpiry).toBe(false);
});

test("Expiry can't have invalid month", () => {
  const validExpiry = expiryIsValidOrEmpty("14/24");
  expect(validExpiry).toBe(false);
});

test("This expiry should be valid.", () => {
  const validExpiry = expiryIsValidOrEmpty("11/24");
  expect(validExpiry).toBe(true);
});

test("This expiry should be valid.", () => {
  const validExpiry = expiryIsValidOrEmpty("08/24");
  expect(validExpiry).toBe(true);
});

test("This expiry should be invalid because it is expired.", () => {
  const validExpiry = expiryIsValidOrEmpty("08/22");
  expect(validExpiry).toBe(false);
});

test("An empty expiry should be valid", () => {
  const validExpiry = expiryIsValidOrEmpty("");
  expect(validExpiry).toBe(true);
});

test("Names with non ASCII characters should be rejected", () => {
  const validName = nameIsValidOrEmpty("💩");
  expect(validName).toBe(false);
});

test("Names with non ASCII characters should be rejected", () => {
  const validName = nameIsValidOrEmpty("Ñ");
  expect(validName).toBe(false);
});

test("Empty names should be valid", () => {
  const validName = nameIsValidOrEmpty("");
  expect(validName).toBe(true);
});

test("This name should be valid: Mark", () => {
  const validName = nameIsValidOrEmpty("Mark");
  expect(validName).toBe(true);
});

test("Security codes can only contain digits", () => {
  const validCode = securityCodeIsValidOrEmpty("a41");
  expect(validCode).toBe(false);
});

test("Security codes can be empty", () => {
  const validCode = securityCodeIsValidOrEmpty("");
  expect(validCode).toBe(true);
});

test("This security code should be valid: 123", () => {
  const validCode = securityCodeIsValidOrEmpty("123");
  expect(validCode).toBe(true);
});

test("16 digit card numbers should be valid", () => {
  const validNumber = cardNumberIsValidOrEmpty("1234123412341234");
  expect(validNumber).toBe(true);
});

test("Card numbers can only contain digits", () => {
  const validNumber = cardNumberIsValidOrEmpty("123a123412341a34");
  expect(validNumber).toBe(false);
});

test("Card numbers can be empty", () => {
  const validNumber = cardNumberIsValidOrEmpty("");
  expect(validNumber).toBe(true);
});