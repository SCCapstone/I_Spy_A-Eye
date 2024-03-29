import "react-native";
import {
  addressIsValidOrEmpty,
  zipCodeIsValidOrEmpty,
  zipCodeBelongsToState,
} from "../utils/DeliveryAddressFunctions";

test("Addresses must contain a digit as the first character. Otherwise, they aren't valid.", () => {
  const validaddress = addressIsValidOrEmpty("Ten Street");
  expect(validaddress).toBe(false);
});

test("This address should be valid: 466 S. Courtland Drive", () => {
  const validaddress = addressIsValidOrEmpty("466 S. Courtland Drive");
  expect(validaddress).toBe(true);
});

test("Empty addresses are valid for saving in Firestore", () => {
  const validaddress = addressIsValidOrEmpty("");
  expect(validaddress).toBe(true);
});

test("This zip code should be valid: 23456", () => {
  const validzipcode = zipCodeIsValidOrEmpty("23456");
  expect(validzipcode).toBe(true);
});

test("Empty zip codes are valid for saving in Firestore", () => {
  const validzipcode = zipCodeIsValidOrEmpty("");
  expect(validzipcode).toBe(true);
});

test("This zip code should be invalid: 2345", () => {
  const validzipcode = zipCodeIsValidOrEmpty("2345");
  expect(validzipcode).toBe(false);
});

test("Hawaiian zip code should be invalid", () => {
  const validzipcode = zipCodeIsValidOrEmpty("96701");
  expect(validzipcode).toBe(false);
});

test("Alaskan zip code should be invalid", () => {
  const validzipcode = zipCodeIsValidOrEmpty("99501");
  expect(validzipcode).toBe(false);
});

test("23456 should belong to Virginia", () => {
  const zipCodeBelongs = zipCodeBelongsToState("Virginia", 23456);
  expect(zipCodeBelongs).toBe(true);
});

test("23456 should not belong to South Carolina", () => {
  const zipCodeBelongs = zipCodeBelongsToState("South Carolina", 23456);
  expect(zipCodeBelongs).toBe(false);
});

test("A state can be empty ", () => {
  const zipCodeBelongs = zipCodeBelongsToState("", 23456);
  expect(zipCodeBelongs).toBe(true);
});

test("A zip code can be empty ", () => {
  const zipCodeBelongs = zipCodeBelongsToState("AK", "");
  expect(zipCodeBelongs).toBe(true);
});

test("Both the zip code and state can be empty ", () => {
  const zipCodeBelongs = zipCodeBelongsToState("", "");
  expect(zipCodeBelongs).toBe(true);
});