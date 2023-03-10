import "react-native";
import { newPasswordIsValid } from "../utils/SignUpScreenFunctions";


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

test("This password should be accepted: ßpaS8wOrd10000000000000000000000", () => {
  const validPasswordChoice = newPasswordIsValid("ßpaS8wOrd10000000000000000000000", "ßpaS8wOrd10000000000000000000000");
  expect(validPasswordChoice).toBe(true); 
})

test("Passwords longer than 32 chars should be rejected.", () => {
  const validPasswordChoice = newPasswordIsValid("ßpaS8wOrd100000000000000000000001", "ßpaS8wOrd100000000000000000000001");
  expect(validPasswordChoice).toBe(false); 
})

test("This password should be accepted: PassWord123☘️", () => {
  const validPasswordChoice = newPasswordIsValid("PassWord123☘️", "PassWord123☘️");
  expect(validPasswordChoice).toBe(true); 
})