import { Alert } from "react-native";

/**
 * These functions do exactly what their name implies.
 * They are used on the screen that updates delivery addresses.
 */

function addressIsValidOrEmpty(address) {
  if (
    (address.match("[0-9]+.*") && address.length <= 40) ||
    address.length === 0
  ) {
    return true;
  } else {
    Alert.alert("Address is formatted incorrectly.");
  }
  return false;
}

function cityIsValidOrEmpty(city) {
  if (city.length <= 20) {
    return true;
  } else {
    Alert.alert("City names can't be more than 20 characters long.");
    return false;
  }
}

function zipCodeIsNotBanned(zipCodeString) {
  let zipCodeInt = parseInt(zipCodeString, 10);
  if (
    // Hawaiian zip code range
    (zipCodeInt >= 96701 && zipCodeInt <= 96898) ||
    // Alaskan zip code range
    (zipCodeInt >= 99501 && zipCodeInt <= 99950)
  ) {
    Alert.alert(
      "Unfortunately, we can't deliver groceries to your zip code. Sorry."
    );
    return false;
  }
  return true;
}

function zipCodeIsValidOrEmpty(zipCode) {
  if (zipCode.length === 0) {
    return true;
  } else if (zipCode.length === 5) {
    if (zipCodeIsNotBanned(zipCode)) {
      return true;
    }
  } else if (zipCode.length !== 5) {
    Alert.alert("Zip codes must be five digits long.");
  }
  return false;
}

function stateIsValidOrEmpty(state) {
  /**
   *  All 48 state names and abbreviations from the continental US are valid,
   *  plus Washington DC's name and abbreviation.
   */
  if (
    state === "Alabama" ||
    state === "Arizona" ||
    state === "Arkansas" ||
    state === "California" ||
    state === "Colorado" ||
    state === "Connecticut" ||
    state === "Delaware" ||
    state === "Florida" ||
    state === "Georgia" ||
    state === "Idaho" ||
    state === "Illinois" ||
    state === "Indiana" ||
    state === "Iowa" ||
    state === "Kansas" ||
    state === "Kentucky" ||
    state === "Louisiana" ||
    state === "Maine" ||
    state === "Maryland" ||
    state === "Massachusetts" ||
    state === "Michigan" ||
    state === "Minnesota" ||
    state === "Mississippi" ||
    state === "Missouri" ||
    state === "Montana" ||
    state === "Nebraska" ||
    state === "Nevada" ||
    state === "New Hampshire" ||
    state === "New Jersey" ||
    state === "New Mexico" ||
    state === "New York" ||
    state === "North Carolina" ||
    state === "North Dakota" ||
    state === "Ohio" ||
    state === "Oklahoma" ||
    state === "Oregon" ||
    state === "Pennsylvania" ||
    state === "Rhode Island" ||
    state === "South Carolina" ||
    state === "South Dakota" ||
    state === "Tennessee" ||
    state === "Texas" ||
    state === "Utah" ||
    state === "Vermont" ||
    state === "Virginia" ||
    state === "Washington" ||
    state === "Washington DC" ||
    state === "West Virginia" ||
    state === "Wisconsin" ||
    state === "Wyoming" ||
    state === "AL" ||
    state === "AZ" ||
    state === "AR" ||
    state === "CA" ||
    state === "CO" ||
    state === "CT" ||
    state === "DE" ||
    state === "DC" ||
    state === "FL" ||
    state === "GA" ||
    state === "ID" ||
    state === "IL" ||
    state === "IN" ||
    state === "IA" ||
    state === "KS" ||
    state === "KY" ||
    state === "LA" ||
    state === "ME" ||
    state === "MD" ||
    state === "MA" ||
    state === "MI" ||
    state === "MN" ||
    state === "MS" ||
    state === "MO" ||
    state === "MT" ||
    state === "NE" ||
    state === "NV" ||
    state === "NH" ||
    state === "NJ" ||
    state === "NM" ||
    state === "NY" ||
    state === "NC" ||
    state === "ND" ||
    state === "OH" ||
    state === "OK" ||
    state === "OR" ||
    state === "PA" ||
    state === "RI" ||
    state === "SC" ||
    state === "SD" ||
    state === "TN" ||
    state === "TX" ||
    state === "UT" ||
    state === "VT" ||
    state === "VA" ||
    state === "WA" ||
    state === "WV" ||
    state === "WI" ||
    state === "WY" ||
    state === ""
  ) {
    return true;
    // There are no Kroger stores in Alaska and Hawaii, nor can they be driven to from another state.
  } else if (
    state === "Alaska" ||
    state === "Hawaii" ||
    state === "AK" ||
    state === "HI"
  ) {
    Alert.alert(
      "Unfortunately, we can't deliver groceries to your state. Sorry."
    );
  } else {
    Alert.alert("You didn't enter a valid state.");
  }
  return false;
}

export {
  addressIsValidOrEmpty,
  cityIsValidOrEmpty,
  zipCodeIsValidOrEmpty,
  stateIsValidOrEmpty,
};
