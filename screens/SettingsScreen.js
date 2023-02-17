import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { firebaseAuth } from "../firebase";
import globalStyle from "../globalStyle";
import firebase from 'firebase';
require('firebase/auth');


export default class Page4 extends React.Component {

  /**
   * Function to sign out users through Firebase. After a successful sign out, the user
   * is redirected to the Log In screen.
   */
  signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        this.props.pageChange(0);
      })
      .catch((error) => alert(error.message));
  };

  isLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in.");
        return true;
      } else {
        console.log("No user is logged in.");
        return false;
      }
    });
  };

  

  render() {
    if (this.isLoggedIn()) {
      return (
        <SafeAreaView style={globalStyle.wholeScreen}>
          <Text style={globalStyle.headerText}>Settings</Text>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() => this.signOut()}
          >
            <Text style={styles.SignOutText}>Sign Out</Text>
          </Pressable>
          <View style={globalStyle.container}>
            <View style={globalStyle.buttons}>
              <TouchableOpacity onPress={() => this.props.pageChange(1)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/search.png")}
                  accessible={true}
                  accessibilityLabel={"Magnifying Glass Icon"}
                />
                <Text>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.pageChange(2)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/cart.png")}
                  accessible={true}
                  accessibilityLabel={"Shopping Cart Icon"}
                />
                <Text>My Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.pageChange(3)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/orders.png")}
                  accessible={true}
                  accessibilityLabel={"Reciept Icon"}
                />
                <Text>Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.pageChange(4)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/gear.png")}
                  accessible={true}
                  accessibilityLabel={"Gear Icon"}
                />
                <Text>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }
    else {
      return (
        <SafeAreaView style={globalStyle.wholeScreen}>
          <Text style={globalStyle.headerText}>Settings</Text>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() => this.signOut()}
          >
            <Text style={styles.SignOutText}>Log In</Text>
          </Pressable>
          <Text>Sign in to access settings.</Text>
          <View style={globalStyle.container}>
            <View style={globalStyle.buttons}>
              <TouchableOpacity onPress={() => this.props.pageChange(1)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/search.png")}
                  accessible={true}
                  accessibilityLabel={"Magnifying Glass Icon"}
                />
                <Text>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.pageChange(2)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/cart.png")}
                  accessible={true}
                  accessibilityLabel={"Shopping Cart Icon"}
                />
                <Text>My Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.pageChange(3)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/orders.png")}
                  accessible={true}
                  accessibilityLabel={"Reciept Icon"}
                />
                <Text>Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.pageChange(4)}>
                <Image
                  style={globalStyle.icon}
                  source={require("../assets/gear.png")}
                  accessible={true}
                  accessibilityLabel={"Gear Icon"}
                />
                <Text>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  SignOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
});
