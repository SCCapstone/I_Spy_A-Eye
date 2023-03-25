import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native";
import { firebaseAuth } from "../utils/firebase";
import globalStyle from "../globalStyle";
require("firebase/auth");
import { PAGE_ID } from "../utils/constants";

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
        {/*Horizontal line*/}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 10,
            marginTop: 20,
          }}
        />
        <View style={{ height: 5 }}>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../assets/shadow.png")}
            imageStyle={{ resizeMode: "repeat" }}
          ></ImageBackground>
        </View>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.signOut()}
        >
          <Text style={globalStyle.wideButtonText}>Log In</Text>
        </Pressable>
        <Text style={globalStyle.paragraph}>
          Sign in to access settings and make purchases.
        </Text>
        <View style={globalStyle.navBarContainer}>
          <View style={globalStyle.buttons} testID="Test_NavigationBar">
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.search)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/search.png")}
                accessible={true}
                accessibilityLabel={"Magnifying Glass Icon"}
              />
              <Text style={{ textAlign: "center" }}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.cart)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/cart.png")}
                accessible={true}
                accessibilityLabel={"Shopping Cart Icon"}
              />
              <Text style={{ textAlign: "center" }}>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.orders)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/orders.png")}
                accessible={true}
                accessibilityLabel={"Reciept Icon"}
              />
              <Text style={{ textAlign: "center" }}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.settings)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text style={{ textAlign: "center" }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
