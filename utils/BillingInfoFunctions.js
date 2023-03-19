import { Alert } from "react-native";

/**
 * These functions do exactly what their name implies.
 * They are used on the screen that updates billing info.
 */

function nameIsValidOrEmpty(name) {
  if (name.length <= 21) {
    return true;
  } else {
    Alert.alert("Names cannot exceed 21 characters.");
    return false;
  }
}

function securityCodeIsValidOrEmpty(securityCode) {
  if (securityCode.length === 0 || securityCode.length === 3) {
    return true;
  } else {
    Alert.alert("Security codes must be three digits long.");
    return false;
  }
}

function cardNumberIsValidOrEmpty(cardNumber) {
  if (cardNumber.length === 0 || cardNumber.length === 16) {
    return true;
  } else {
    Alert.alert("Card numbers must be 16 digits long.");
    return false;
  }
}

function expiryIsValidOrEmpty(expiry) {
  let expiryMatchesRegex = expiry.match("(0[1-9]|1[0-2])\/[0-9][0-9]");
  let isValidLength = false;
  if (expiry.length === 0 || expiry.length === 5) {
    isValidLength = true;
  }
  if (expiryMatchesRegex && isValidLength) {
    return true;
  } else {
    Alert.alert("The expiry you inputed is formatted incorrectly.");
  }
  return false;
}

export {
  nameIsValidOrEmpty,
  securityCodeIsValidOrEmpty,
  cardNumberIsValidOrEmpty,
  expiryIsValidOrEmpty
};
