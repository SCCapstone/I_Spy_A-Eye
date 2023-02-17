import * as React from "react";
import { Text, StyleSheet, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import {firebaseAuth} from '../firebase';
import { newPasswordIsValid } from "../functions/SignUpScreenFunctions";

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
          this.props.pageChange(0);
        })
        .catch((error) => alert(error.message));
    }
  };

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>Create an Account</Text>
        <Pressable
          style={globalStyle.backButtonStyle}
          onPress={() => this.props.pageChange(0)}
        >
          <Text style={globalStyle.backButtonText}>&lt; Back</Text>
        </Pressable>
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Email"
          placeholderTextColor={"#000"}
          onChangeText={(newEmailInput) =>
            this.setState({ emailInput: newEmailInput.trim() })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Password"
          placeholderTextColor={"#000"}
          secureTextEntry={true}
          onChangeText={(newPasswordInput) =>
            this.setState({ passwordInput: newPasswordInput })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
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
        >
          <Text style={styles.logInText}>Sign Up</Text>
        </Pressable>
        <Text style={globalStyle.paragraph}>
          Your password must be at least 8 characters long. it must contain an uppercase
          letter, a lowercase letter, a number, and a non-alphanumeric character.
        </Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  logInText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
});