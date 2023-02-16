import "react-native";
import { newPasswordIsValid } from "../functions/SignUpScreenFunctions";


test("The Password and Confirm Password field must have matching input.", () => {
  const validPasswordChoice = newPasswordIsValid("Password123$", "Password123$_");
  expect(validPasswordChoice).toBe(false); 
})