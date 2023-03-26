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

/**
 * Function to check if card expiry is expired by comparing it against the current date.
 * @param {*} expiry the date to check
 * @returns true if expiry is not expired, else false
 */
function cardIsNotExpired(expiry) {
  const date = new Date();
  // Expiry dates have its year listed in two digits.
  let currentYear = date.getFullYear().toString().substring(2, 4);
  // Months in JavaScript are numbered starting at 0.
  let currentMonth = date.getMonth() + 1;
  let expiryMonth = expiry.substring(0, 2);
  let expiryYear = expiry.substring(3, 5);

  // An expiry month can't be compared with the current month if it has a zero prepended.
  if (expiryMonth.charAt(0) === "0") {
    expiryMonth = expiryMonth.substring(1, 2);
  }
  if (
    expiryYear > currentYear ||
    (expiryYear === currentYear && expiryMonth > currentMonth)
  ) {
    return true;
  } else {
    Alert.alert("The card you have entered is expired.");
  }
  return false;
}

/**
 * Function to check wether an expiry is formatted correctly and not expired, or just
 * empty.
 * @param {*} expiry the card expiration date to check.
 * @returns true if expiry is valid or empty, else false.
 */
function expiryIsValidOrEmpty(expiry) {
  if (expiry.match("(0[1-9]|1[0-2])/[0-9][0-9]") && cardIsNotExpired(expiry)) {
    return true;
  } else if (expiry.length === 0) {
    return true;
  }
   else if (!expiry.match("(0[1-9]|1[0-2])/[0-9][0-9]")) {
    Alert.alert("The expiry you inputed is formatted incorrectly.");
  }
  return false;
}

export {
  nameIsValidOrEmpty,
  securityCodeIsValidOrEmpty,
  cardNumberIsValidOrEmpty,
  expiryIsValidOrEmpty,
};
