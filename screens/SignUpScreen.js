import * as React from "react";
import { Text, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from "../globalStyle";
import { firebaseAuth } from "../utils/firebase";
import { newPasswordIsValid } from "../utils/SignUpScreenFunctions";
import { PAGE_ID } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class SignUp extends React.Component {
  // Holds the values of the text input fields on this screen.
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: "",
      confirmPasswordInput: "",
    };
  }

  // Returns user back to previous screen.
  async returnToPreviousPage() {
    this.props.pageChange(
      parseInt(await AsyncStorage.getItem("previousPage"), 10)
    );
  }

  /**
   * Function to create user accounts through Firebase if the user enters valid info. After the
   * user signs up, the user is alerted and then redirected to the Log In screen.
   * @param {*} state the values of the text fields on this page.
   */
  signUp(state) {
    // If user entered password information meets the requirements.
    if (newPasswordIsValid(state.passwordInput, state.confirmPasswordInput)) {
      firebaseAuth
        .createUserWithEmailAndPassword(state.emailInput, state.passwordInput)
        .then((userCredentials) => {
          const user = userCredentials.user;
          alert("You have successfully registered!");
          console.log(user.email, " successfully registered.");
          this.props.pageChange(PAGE_ID.location);
          /**
           * Determines what text to render for the gear button on the navbar. This
           * call to AsyncStorage is also called when the user logs in. This call
           * is also here since the User is doesn't go back to the log in screen
           * untill after signing out and logging back in.
           */
          AsyncStorage.setItem("SettingsOrLogIn", "Settings");
        })
        .catch((error) => alert(error.message));
    }
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText} accessibilityRole="header">
          Create an Account
        </Text>
        <Pressable
          style={globalStyle.smallButtonStyle}
          onPress={() => this.returnToPreviousPage()}
          accessibilityRole="button"
        >
          <Text style={globalStyle.smallButtonText}>&lt; Back</Text>
        </Pressable>
        <TextInput
          style={globalStyle.wideInputContainer}
          placeholder="Email"
          placeholderTextColor={"#000"}
          onChangeText={(newEmailInput) =>
            this.setState({ emailInput: newEmailInput.trim() })
          }
        />
        <TextInput
          style={globalStyle.wideInputContainer}
          placeholder="Password"
          placeholderTextColor={"#000"}
          secureTextEntry={true}
          onChangeText={(newPasswordInput) =>
            this.setState({ passwordInput: newPasswordInput })
          }
        />
        <TextInput
          style={globalStyle.wideInputContainer}
          placeholder="Confirm Password"
          placeholderTextColor={"#000"}
          secureTextEntry={true}
          onChangeText={(newConfirmPasswordInput) =>
            this.setState({ confirmPasswordInput: newConfirmPasswordInput })
          }
        />

        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.signUp(this.state)}
          accessibilityRole="button"
        >
          <Text style={globalStyle.wideButtonText}>Sign Up</Text>
        </Pressable>
        <Text style={globalStyle.paragraph}>
          Your password must be at least 8 characters long. It must contain an
          uppercase letter, a lowercase letter, a number, and a non-alphanumeric
          character.
        </Text>
      </SafeAreaView>
    );
  }
}
