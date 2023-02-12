import * as React from "react";
import { Text, StyleSheet, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import {firebaseAuth} from '../firebase';

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
   * Function to check if user entered in a valid new password. It makes sure the "Password" and 
   * "Confrim Password" fields match. Firebase requires passwords to be at least 6 characters,
   * but we are going a step beyond and requiring 8. Users will be alerted as to why passwords
   * aren't considered valid.
   * @param {*} state the values of the text fields on this page.
   * @returns true if password and confirm password are valid, else false.
   */
  newPasswordIsValid(state) {
    if (state.passwordInput === state.confirmPasswordInput && state.passwordInput.length >= 8) {
      return true;
    } else if (state.passwordInput !== state.confirmPasswordInput) {
      alert("Passwords don't match.");
      return false;
    } else if (state.passwordInput.length < 8 && state.confirmPasswordInput.length < 8) {
      alert("Passwords must be 8 or more characters long.");
      return false;
    }
    return false;
  }

  /**
   * Function to create user accounts through Firebase if the user enters valid info. After the
   * user signs up, the user is alerted and then redirected to the Log In screen.
   * @param {*} state the values of the text fields on this page.
   */
  signUp(state) {
    // If user entered password information meets the requirements.
    if (this.newPasswordIsValid(state)) {
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
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Name"
          placeholderTextColor={"#000"}
        />
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
          style={styles.loginButtonStyle}
          onPress={() => this.signUp(this.state)}
        >
          <Text style={styles.logInText}>Sign Up</Text>
        </Pressable>
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
  loginButtonStyle: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 20,
    maxHeight: 50,
    minHeight: 50,
  },

});