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

function zipCodeBelongsToState(state, zipCode) {
if ((state === "" && zipCode !== "") || (state !== "" && zipCode === "") || (state === "" && zipCode === "")) {
  return true;
}
else if ((state === "Alaska" || state === "AK") && zipCode >= 99501 && zipCode <= 99950) {return true;}
else if ((state === "Alabama" || state === "AL") && zipCode >= 35004 && zipCode <= 36925) {return true;}
else if ((state === "Arkansas" || state === "AR") && zipCode >= 71601 && zipCode <= 72959) {return true;}
else if ((state === "Arkansas (Texarkana)" || state === "AR") && zipCode >= 75502 && zipCode <= 75502) {return true;}
else if ((state === "Arizona" || state === "AZ") && zipCode >= 85001 && zipCode <= 86556) {return true;}
else if ((state === "California" || state === "CA") && zipCode >= 90001 && zipCode <= 96162) {return true;}
else if ((state === "Colorado" || state === "CO") && zipCode >= 80001 && zipCode <= 81658) {return true;}
else if ((state === "Connecticut" || state === "CT") && zipCode >= 6001 && zipCode <= 6389) {return true;}
else if ((state === "Connecticut" || state === "CT") && zipCode >= 6401 && zipCode <= 6928) {return true;}
else if ((state === "Dist of Columbia" || state === "DC") && zipCode >= 20001 && zipCode <= 20039) {return true;}
else if ((state === "Dist of Columbia" || state === "DC") && zipCode >= 20042 && zipCode <= 20599) {return true;}
else if ((state === "Dist of Columbia" || state === "DC") && zipCode >= 20799 && zipCode <= 20799) {return true;}
else if ((state === "Delaware" || state === "DE") && zipCode >= 19701 && zipCode <= 19980) {return true;}
else if ((state === "Florida" || state === "FL") && zipCode >= 32004 && zipCode <= 34997) {return true;}
else if ((state === "Georgia" || state === "GA") && zipCode >= 30001 && zipCode <= 31999) {return true;}
else if ((state === "Georga (Atlanta)" || state === "GA") && zipCode >= 39901 && zipCode <= 39901) {return true;}
else if ((state === "Hawaii" || state === "HI") && zipCode >= 96701 && zipCode <= 96898) {return true;}
else if ((state === "Iowa" || state === "IA") && zipCode >= 50001 && zipCode <= 52809) {return true;}
else if ((state === "Iowa (OMAHA)" || state === "IA") && zipCode >= 68119 && zipCode <= 68120) {return true;}
else if ((state === "Idaho" || state === "ID") && zipCode >= 83201 && zipCode <= 83876) {return true;}
else if ((state === "Illinois" || state === "IL") && zipCode >= 60001 && zipCode <= 62999) {return true;}
else if ((state === "Indiana" || state === "IN") && zipCode >= 46001 && zipCode <= 47997) {return true;}
else if ((state === "Kansas" || state === "KS") && zipCode >= 66002 && zipCode <= 67954) {return true;}
else if ((state === "Kentucky" || state === "KY") && zipCode >= 40003 && zipCode <= 42788) {return true;}
else if ((state === "Louisiana" || state === "LA") && zipCode >= 70001 && zipCode <= 71232) {return true;}
else if ((state === "Louisiana" || state === "LA") && zipCode >= 71234 && zipCode <= 71497) {return true;}
else if ((state === "Massachusetts" || state === "MA") && zipCode >= 1001 && zipCode <= 2791) {return true;}
else if ((state === "Massachusetts (Andover)" || state === "MA") && zipCode >= 5501 && zipCode <= 5544) {return true;}
else if ((state === "Maryland" || state === "MD") && zipCode >= 20331 && zipCode <= 20331) {return true;}
else if ((state === "Maryland" || state === "MD") && zipCode >= 20335 && zipCode <= 20797) {return true;}
else if ((state === "Maryland" || state === "MD") && zipCode >= 20812 && zipCode <= 21930) {return true;}
else if ((state === "Maine" || state === "ME") && zipCode >= 3901 && zipCode <= 4992) {return true;}
else if ((state === "Michigan" || state === "MI") && zipCode >= 48001 && zipCode <= 49971) {return true;}
else if ((state === "Minnesota" || state === "MN") && zipCode >= 55001 && zipCode <= 56763) {return true;}
else if ((state === "kc96 DataMO" || state === "MO") && zipCode >= 63001 && zipCode <= 65899) {return true;}
else if ((state === "Mississippi" || state === "MS") && zipCode >= 38601 && zipCode <= 39776) {return true;}
else if ((state === "Mississippi(Warren)" || state === "MS") && zipCode >= 71233 && zipCode <= 71233) {return true;}
else if ((state === "Montana" || state === "MT") && zipCode >= 59001 && zipCode <= 59937) {return true;}
else if ((state === "North Carolina" || state === "NC") && zipCode >= 27006 && zipCode <= 28909) {return true;}
else if ((state === "North Dakota" || state === "ND") && zipCode >= 58001 && zipCode <= 58856) {return true;}
else if ((state === "Nebraska" || state === "NE") && zipCode >= 68001 && zipCode <= 68118) {return true;}
else if ((state === "Nebraska" || state === "NE") && zipCode >= 68122 && zipCode <= 69367) {return true;}
else if ((state === "New Hampshire" || state === "NH") && zipCode >= 3031 && zipCode <= 3897) {return true;}
else if ((state === "New Jersey" || state === "NJ") && zipCode >= 7001 && zipCode <= 8989) {return true;}
else if ((state === "New Mexico" || state === "NM") && zipCode >= 87001 && zipCode <= 88441) {return true;}
else if ((state === "Nevada" || state === "NV") && zipCode >= 88901 && zipCode <= 89883) {return true;}
else if ((state === "New York (Fishers Is)" || state === "NY") && zipCode >= 6390 && zipCode <= 6390) {return true;}
else if ((state === "New York" || state === "NY") && zipCode >= 10001 && zipCode <= 14975) {return true;}
else if ((state === "Ohio" || state === "OH") && zipCode >= 43001 && zipCode <= 45999) {return true;}
else if ((state === "Oklahoma" || state === "OK") && zipCode >= 73001 && zipCode <= 73199) {return true;}
else if ((state === "Oklahoma" || state === "OK") && zipCode >= 73401 && zipCode <= 74966) {return true;}
else if ((state === "Oregon" || state === "OR") && zipCode >= 97001 && zipCode <= 97920) {return true;}
else if ((state === "Pennsylvania" || state === "PA") && zipCode >= 15001 && zipCode <= 19640) {return true;}
else if ((state === "Puerto Rico" || state === "PR") && zipCode >= 0 && zipCode <= 0) {return true;}
else if ((state === "Rhode Island" || state === "RI") && zipCode >= 2801 && zipCode <= 2940) {return true;}
else if ((state === "South Carolina" || state === "SC") && zipCode >= 29001 && zipCode <= 29948) {return true;}
else if ((state === "South Dakota" || state === "SD") && zipCode >= 57001 && zipCode <= 57799) {return true;}
else if ((state === "Tennessee" || state === "TN") && zipCode >= 37010 && zipCode <= 38589) {return true;}
else if ((state === "Texas (Austin)" || state === "TX") && zipCode >= 73301 && zipCode <= 73301) {return true;}
else if ((state === "Texas" || state === "TX") && zipCode >= 75001 && zipCode <= 75501) {return true;}
else if ((state === "Texas" || state === "TX") && zipCode >= 75503 && zipCode <= 79999) {return true;}
else if ((state === "Texas (El Paso)" || state === "TX") && zipCode >= 88510 && zipCode <= 88589) {return true;}
else if ((state === "Utah" || state === "UT") && zipCode >= 84001 && zipCode <= 84784) {return true;}
else if ((state === "Virginia" || state === "VA") && zipCode >= 20040 && zipCode <= 20041) {return true;}
else if ((state === "Virginia" || state === "VA") && zipCode >= 20040 && zipCode <= 20167) {return true;}
else if ((state === "Virginia" || state === "VA") && zipCode >= 20042 && zipCode <= 20042) {return true;}
else if ((state === "Virginia" || state === "VA") && zipCode >= 22001 && zipCode <= 24658) {return true;}
else if ((state === "Vermont" || state === "VT") && zipCode >= 5001 && zipCode <= 5495) {return true;}
else if ((state === "Vermont" || state === "VT") && zipCode >= 5601 && zipCode <= 5907) {return true;}
else if ((state === "Washington" || state === "WA") && zipCode >= 98001 && zipCode <= 99403) {return true;}
else if ((state === "Wisconsin" || state === "WI") && zipCode >= 53001 && zipCode <= 54990) {return true;}
else if ((state === "West Virginia" || state === "WV") && zipCode >= 24701 && zipCode <= 26886) {return true;}
else if ((state === "Wyoming" || state === "WY") && zipCode >= 82001 && zipCode <= 83128) {return true;}
else {
  Alert.alert("The Zip code you entered does not belong to the state you entered.");
  return false;
}

}

export {
  addressIsValidOrEmpty,
  cityIsValidOrEmpty,
  zipCodeIsValidOrEmpty,
  stateIsValidOrEmpty,
  zipCodeBelongsToState
};
