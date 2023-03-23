import "react-native";
import { expiryIsValidOrEmpty } from "../utils/BillingInfoFunctions";

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