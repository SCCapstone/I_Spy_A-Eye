import * as React from "react";
import { Text, View, TouchableOpacity, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { firebaseAuth } from "../utils/firebase";
import globalStyle from "../globalStyle";
require("firebase/auth");

/**
 * This screen is shown when a user not signed in clicks the settings button on the navbar.
 * This screen exists so that a user can be redirected to the sign in screen.
 */

export default class NotSignedInSettings extends React.Component {
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

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>Settings</Text>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.signOut()}
        >
          <Text style={globalStyle.wideButtonText}>Log In</Text>
        </Pressable>
        <Text style={globalStyle.paragraph}>
          Sign in to access settings and make purchases.
        </Text>
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
