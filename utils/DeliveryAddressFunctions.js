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

function zipCodeIsValidOrEmpty(zipCode) {
  if (zipCode.length === 0 || zipCode.length === 5) {
    return true;
  } else {
    Alert.alert("Zip codes must be five digits long.");
    return false;
  }
}

function stateIsValidOrEmpty(state) {
  // All 50 state names and abbreviations are valid, plus Washington DC.
  if (
    state === "Alabama" ||
    state === "Alaska" ||
    state === "Arizona" ||
    state === "Arkansas" ||
    state === "California" ||
    state === "Colorado" ||
    state === "Connecticut" ||
    state === "Delaware" ||
    state === "Florida" ||
    state === "Georgia" ||
    state === "Hawaii" ||
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
    state === "AK" ||
    state === "AZ" ||
    state === "AR" ||
    state === "CA" ||
    state === "CO" ||
    state === "CT" ||
    state === "DE" ||
    state === "DC" ||
    state === "FL" ||
    state === "GA" ||
    state === "HI" ||
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
  } else {
    Alert.alert("You didn't enter a valid state.");
    return false;
  }
}

export { addressIsValidOrEmpty, cityIsValidOrEmpty, zipCodeIsValidOrEmpty, stateIsValidOrEmpty };
