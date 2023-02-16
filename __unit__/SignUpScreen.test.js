import "react-native";
import { newPasswordIsValid } from "../functions/SignUpScreenFunctions";


test("The Password and Confirm Password field must have matching input.", () => {
  const validPasswordChoice = newPasswordIsValid("Password123$", "Password123$_");
  expect(validPasswordChoice).toBe(false); 
})

test("Passwords are rejected if they are shorter than 8 characters.", () => {
  const validPasswordChoice = newPasswordIsValid("Pas123$", "Pas123$");
  expect(validPasswordChoice).toBe(false); 
})

test("Passwords are rejected if they don't contain a special character.", () => {
  const validPasswordChoice = newPasswordIsValid("Password123", "Password123");
  expect(validPasswordChoice).toBe(false); 
})

test("Passwords are rejected if they don't contain an uppercase character.", () => {
  const validPasswordChoice = newPasswordIsValid("password123$", "password123$");
  expect(validPasswordChoice).toBe(false); 
})

test("Passwords are rejected if they don't contain a lowercase character.", () => {
  const validPasswordChoice = newPasswordIsValid("PASSWORD123$", "PASSWORD123$");
  expect(validPasswordChoice).toBe(false); 
})

test("This password should be accepted: ðñòF13_zz1", () => {
  const validPasswordChoice = newPasswordIsValid("ðñòF13_zz1", "ðñòF13_zz1");
  expect(validPasswordChoice).toBe(true); 
})

test("This password should be accepted: ßpaSsword1", () => {
  const validPasswordChoice = newPasswordIsValid("ßpaSsword1", "ßpaSsword1");
  expect(validPasswordChoice).toBe(true); 
})

test("This password should be accepted: ßpaS8wOrd1", () => {
  const validPasswordChoice = newPasswordIsValid("ßpaS8wOrd1", "ßpaS8wOrd1");
  expect(validPasswordChoice).toBe(true); 
})