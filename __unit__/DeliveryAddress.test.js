import "react-native";
import { addressIsValidOrEmpty } from "../utils/DeliveryAddressFunctions";

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
