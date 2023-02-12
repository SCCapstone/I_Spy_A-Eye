import * as React from "react";
import { Text, View, StyleSheet, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';

export default class SignUp extends React.Component {
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
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Password"
          placeholderTextColor={"#000"}
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Confirm Password"
          placeholderTextColor={"#000"}
        />

        <Pressable
          style={styles.loginButtonStyle}
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
    backgroundColor: 'black',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 20,
    maxHeight: 50,
    minHeight: 50,
  },

});