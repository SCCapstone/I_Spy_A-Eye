import * as React from "react";
import { Text, View, StyleSheet, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';

export default class Page0 extends React.Component {
  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>I Spy Shopper</Text>
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Username"
          placeholderTextColor={"#000000"}
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Password"
          placeholderTextColor={"#000000"}
        />

        <Pressable
          style={styles.loginButtonStyle}
        >
          <Text style={styles.logInText}>Log In</Text>
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