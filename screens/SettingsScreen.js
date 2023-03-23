import * as React from "react";
import { PAGE_ID } from "../utils/constants";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native";
import { firebaseAuth } from "../utils/firebase";
import globalStyle from "../globalStyle";
require("firebase/auth");
import AsyncStorage from "@react-native-async-storage/async-storage";
import {OpenURLButton} from '../functions/RedirectButton'


export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOrLogIn: "",
      currentEmail: "",
    };
  }

  /**
   * Function to sign out users through Firebase. After a successful sign out, the user
   * is redirected to the Log In screen.
   */
  signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        this.props.pageChange(PAGE_ID.login);
      })
      .catch((error) => alert(error.message));
  };

  async updateCurrentEmailState() {
    this.setState({
      currentEmail: `Signed in as: ${await AsyncStorage.getItem("userEmail")}`,
    });
  }

  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn"),
    });
  }

  componentDidMount() {
    this.updateNavBarText();
    this.updateCurrentEmailState();
    /**
     * The Billing Address and Delivery Address screens have back buttons and can
     * be accessed from this screen and the Checkout screen. The previousPage
     * variable will allow those screens to determine which screen to go back to.
     */
    AsyncStorage.setItem("previousPage", "4");
  }

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
        <Text style={globalStyle.subHeaderText}>Personal:</Text>
        <Text style={style.signedInText}>{this.state.currentEmail}</Text>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(PAGE_ID.delivery_address)}
        >
          <Text style={globalStyle.wideButtonText}>
            Change Delivery Address
          </Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(PAGE_ID.billing_info)}
        >
          <Text style={globalStyle.wideButtonText}>Change Billing Info</Text>
        </Pressable>
        <Pressable style={globalStyle.wideButtonStyle}>
          <Text style={globalStyle.wideButtonText}>Clear Shopping History</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.signOut()}
        >
          <Text style={globalStyle.wideButtonText}>Sign Out</Text>
        </Pressable>
        <View style={globalStyle.wideButtonStyle} >
          <OpenURLButton url={'https://google.com'}>Tutorial</OpenURLButton>
        </View>
        <View style={globalStyle.container}>
          <View style={globalStyle.buttons}>
            <TouchableOpacity onPress={() => this.props.pageChange(1)}>

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
              <Text style={{ textAlign: "center" }}>
                {this.state.settingsOrLogIn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  signedInText: {
    marginLeft: 8,
    fontSize: 17,
  },
});
