import {Alert} from 'react-native';

  /**
   * Function to check if user entered in a valid new password. It makes sure the "Password" and 
   * "Confrim Password" fields match. Additionally, it checks if required character types are in
   * the password. Firebase requires passwords to just be at least 6 characters, but we are 
   * going a step beyond and requiring more password secruity. Users will be alerted as to why
   * passwords aren't considered valid.
   * @param passwordInput the value of the first password input text field on the Sign Up page.
   * @param confirmPasswordInput the value of the second password input text field on the Sign
   * Up page.
   * @returns true if password and confirm password are valid, else false.
   */
  function newPasswordIsValid(passwordInput, confirmPasswordInput) {
    const allowedSpecialChars = 
    /[~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöùúûüýþÿ]/;
    const allCharsAllowed =
    /[^~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöùúûüýþÿabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]*/;
    // If any of boolean vars below are false, then this function returns false at the end.
    let hasCapitalChar = passwordInput.match(".*[A-Z]+.*");
    let hasLowercaseChar = passwordInput.match(".*[a-z]+.*");
    let hasDigitChar = passwordInput.match(".*[0-9]+.*");
    let hasSpecialChar = allowedSpecialChars.test(passwordInput);
    let hasAllowedChars = allCharsAllowed.test(passwordInput);

    if (passwordInput === confirmPasswordInput && passwordInput.length >= 8 && passwordInput.length <= 32 
      && hasCapitalChar && hasLowercaseChar && hasDigitChar && hasSpecialChar && hasAllowedChars) {
      return true;
    } else if (passwordInput !== confirmPasswordInput) {
      Alert.alert("Passwords don't match.");
    } else if (passwordInput.length < 8) {
      Alert.alert("Passwords must be 8 or more characters long.");
    } else if (passwordInput.length > 32) {
      Alert.alert("Password is too long. Passwords cannot be longer than 32 characters.");
    } else if (!hasCapitalChar) {
      Alert.alert("Passwords must contain an uppercase letter.");
    } else if (!hasLowercaseChar) {
      Alert.alert("Passwords must contain a lowercase letter.");
    } else if (!hasDigitChar) {
      Alert.alert("Passwords must contain a number.");
    } else if (!hasSpecialChar) {
      Alert.alert("Passwords must contain a non alpha-numeric character.");
    } else if (!hasAllowedChars) {
      Alert.alert("Password contains a character that isn't allowed.");
    }
    return false;
  }

  export {newPasswordIsValid};