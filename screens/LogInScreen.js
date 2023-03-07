import * as React from "react";
import { Text, StyleSheet, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import {firebaseAuth} from '../firebase';

/**
 * This is the first screen users will see when they start the app. Users can login
 * and be redirected to the search screen, or they can click the Sign Up button and
 * be redirected to the Create an Account screen. 
 */

export default class Login extends React.Component {
  // Holds the values of the text input fields on this screen.
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: "",
    };
  }

  /**
   * This function handles logging in through Firebase. If a login is successful,
   * the user is redirected to the Search Screen.
   * @param {*} state the values of the text fields on this page.
   */
  login(state) {
    firebaseAuth
      .signInWithEmailAndPassword(state.emailInput, state.passwordInput)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user.email, " successfully logged in.");
        this.props.pageChange(1);
      })
      .catch((error) => alert(error.message));
  };

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>I Spy Shopper</Text>
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Email"
          placeholderTextColor={"#000"}
          onChangeText={(newEmailInput) =>
            this.setState({ emailInput: newEmailInput.trim() })
          }
          testID="Test_EmailTextBar"
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Password"
          placeholderTextColor={"#000"}
          secureTextEntry={true}
          onChangeText={(newPasswordInput) =>
            this.setState({ passwordInput: newPasswordInput })
          }
          testID="Test_PasswordTextBar"
        />

        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.login(this.state)}
          testID="Test_LogInButton"
        >
          <Text style={globalStyle.wideButtonText}>Log In</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(6)}
          testID="Test_SignUpButton"
        >
          <Text style={globalStyle.wideButtonText}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(1)}
          testID="Test_SignInSkip"
        >
          <Text style={globalStyle.wideButtonText}>Continue Without Signing in</Text>
        </Pressable>
      </SafeAreaView>
    )
  }
}
