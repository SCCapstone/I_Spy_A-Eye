import * as React from "react";

import { PAGE_ID } from "../utils/constants";
import { Text, Pressable, SafeAreaView, TextInput, View } from "react-native";
import globalStyle from "../globalStyle";
import { firebaseAuth } from "../utils/firebase";
import firebase from "firebase";
require("firebase/auth");
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenURLButton } from "../functions/RedirectButton";

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
      location: ""
    };
  }

  async updateCurrentLocationState() {
    this.setState({
      location: `${await AsyncStorage.getItem("locationID")}`,
    });
  }

  // Function to redirect users to search screen if they are already signed in.
  componentDidMount() {
    this.updateCurrentLocationState();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userID = user.uid;
        AsyncStorage.setItem("userID", userID);
        AsyncStorage.setItem("userEmail", user.email);
        console.log(`Current user ID: ${userID}`); 
        this.props.pageChange(PAGE_ID.location);
      } else {
        console.log("No user is logged in.");
        AsyncStorage.setItem("userID", "none");
        // Determines what text to render for the gear button on the navbar.
        AsyncStorage.setItem("SettingsOrLogIn", "Log In");
      }
    });

    /**
     * The sign up screen has a back button and that screen can be accessed
     * from this screen and the Not Signed In Settings screen. The previousPage
     * variable will allow those screens to determine which screen to go back to.
     */
    AsyncStorage.setItem("previousPage", "0");
  }

  /**
   * This function handles logging in through Firebase. If a login is successful,
   * the user is redirected to the Search Screen. Async storage is also updated
   * to allow for easy access to Firestore.
   * @param {*} state the values of the text fields on this page.
   */
  login(state) {
    firebaseAuth
      .signInWithEmailAndPassword(state.emailInput, state.passwordInput)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user.email, " successfully logged in.");
        var userID = user.uid;
        AsyncStorage.setItem("userID", userID);
        AsyncStorage.setItem("userEmail", user.email);
        // Determins what text to render in Navbar
        AsyncStorage.setItem("SettingsOrLogIn", "Settings");
        console.log(`Current user ID: ${userID}`);
        this.props.pageChange(PAGE_ID.location);
      })
      .catch((error) => alert(error.message));
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText} accessibilityRole="header">
          I Spy Shopper
        </Text>
        <TextInput
          style={globalStyle.wideInputContainer}
          placeholder="Email"
          placeholderTextColor={"#000"}
          onChangeText={(newEmailInput) =>
            this.setState({ emailInput: newEmailInput.trim() })
          }
          testID="Test_EmailTextBar"
        />
        <TextInput
          style={globalStyle.wideInputContainer}
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
          accessibilityRole="button"
        >
          <Text style={globalStyle.wideButtonText}>Log In</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(PAGE_ID.sign_up)}
          testID="Test_SignUpButton"
          accessibilityRole="button"
        >
          <Text style={globalStyle.wideButtonText}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(PAGE_ID.location)}
          testID="Test_SignInSkip"
          accessibilityRole="button"
        >
          <Text style={globalStyle.wideButtonText}>
            Continue Without Signing in
          </Text>
        </Pressable>
        <View style={globalStyle.wideButtonStyle}>
          <OpenURLButton url={"https://youtu.be/DwAJMdrL24c"}>Tutorial</OpenURLButton>
        </View>
      </SafeAreaView>
    );
  }
}
