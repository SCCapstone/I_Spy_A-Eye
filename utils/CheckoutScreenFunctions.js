/**
 * These function exists to keep checking out secure by hiding 
 * sensitive user data.
 */

/**
 * Function to take in a card number and return the last four digits
 * with asterisks prepended. If the user did not save a card number,
 * the empty string is just returned.
 * @param {*} cardNumber the string of the user's card number
 * @returns the securly formatted card number string 
 */
function showOnlyFourDigitsOfCardNumber(cardNumber) {
  if (cardNumber === "") {
    return "";
  }
  return "************" + cardNumber.substring(12, 16);
}

/**
 * Function to take in a security code and return just three asteriks.
 * If the user did not save a security code, the empty string is just
 * returned.
 * @param {*} securityCode the string of the user's card security code
 * @returns the securely formatted security code string
 */
function replaceSecurityCodeWithAsterisks(securityCode) {
  if (securityCode === "") {
    return "";
  }
  return "***"
}

export {showOnlyFourDigitsOfCardNumber, replaceSecurityCodeWithAsterisks};