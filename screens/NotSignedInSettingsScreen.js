import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native";
import globalStyle from "../globalStyle";
import { PAGE_ID } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * This screen is shown when a user not signed in clicks the settings button on the navbar.
 * This screen exists so that a user can be redirected to the sign in screen.
 */

export default class NotSignedInSettings extends React.Component {

  componentDidMount() {
    /**
     * The sign up screen has a back button and that screen can be accessed
     * from this screen and the Log In screen. The previousPage variable 
     * will allow those screens to determine which screen to go back to.
     */
    AsyncStorage.setItem("previousPage", "4");
  }


  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText} accessibilityRole="header">
          Settings
        </Text>
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
        <Text style={globalStyle.paragraph} accessibilityRole="text">
          Sign in to access settings and make purchases. If you don't have an
          account yet, it is quick and easy to make one.
        </Text>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(PAGE_ID.login)}
          accessibilityRole="button"
        >
          <Text style={globalStyle.wideButtonText}>Log In</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(PAGE_ID.sign_up)}
          accessibilityRole="button"
        >
          <Text style={globalStyle.wideButtonText}>Sign Up</Text>
        </Pressable>
        <Image
          style={style.logo}
          source={require("../assets/ispylogofinal.png")}
          accessible={true}
          accessibilityLabel="I Spy Shopper logo"
        />
        <View style={globalStyle.navBarContainer}>
          <View style={globalStyle.buttons} testID="Test_NavigationBar">
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.search)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/search.png")}
                accessible={true}
                accessibilityLabel="Magnifying Glass Icon"
              />
              <Text style={{ textAlign: "center" }}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.cart)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/cart.png")}
                accessible={true}
                accessibilityLabel="Shopping Cart Icon"
              />
              <Text style={{ textAlign: "center" }}>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.orders)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/orders.png")}
                accessible={true}
                accessibilityLabel="Reciept Icon"
              />
              <Text style={{ textAlign: "center" }}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.settings)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel="Gear Icon"
              />
              <Text style={{ textAlign: "center" }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  logo: {
    marginTop: 30,
    width: 60,
    height: 60,
    alignSelf: "center",
  },
});

