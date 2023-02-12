import * as React from "react";
import { Text, View, StyleSheet, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import {firebaseAuth} from '../firebase'

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
   * Function to create user accounts through firebase. It makes sure the "Password" and 
   * "Confrim Password" fields match. Firebase requires passwords to be at least 6
   * characters but we are going a step beyond.
   * @param {*} state the values of the text fields on this page.
   */
  signUp(state) {
    // If user entered password information meets the requirements.
    if (state.passwordInput === state.confirmPasswordInput && state.passwordInput >= 8) {
      firebaseAuth
        .createUserWithEmailAndPassword(state.emailInput, state.passwordInput)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log(user.email, " successfully registered.");
        })
        .catch((error) => alert(error.message));
    } else if (state.passwordInput !== state.confirmPasswordInput) {
      alert("Passwords don't match.");
    } else if (state.passwordInput.length < 8 && state.confirmPasswordInput.length < 8) {
      alert("Passwords must be 8 or more characters long.");
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