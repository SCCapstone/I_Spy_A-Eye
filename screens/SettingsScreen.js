import * as React from "react";
import { PAGE_ID } from "../utils/constants";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native";
import globalStyle from "../globalStyle";
import firebase from "firebase";
require("firebase/auth");
import { deAuthUser } from "../utils/SettingsScreenFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenURLButton } from "../functions/RedirectButton";
import { RadioButton } from "react-native-paper";

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOrLogIn: "",
      currentEmail: "",
      currentLocation: "",
      // This variable controls what radio button is currently selected.
      checked: "20",
    };
  }

  async saveProductsPerPageInFirestore(productsPerPageInput) {
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.firestore().collection("productsPerPage").doc(user.uid).set({
        number: productsPerPageInput,
      });
      ToastAndroid.show("Saved!", 400);
    });
  }

  /**
   * Function to get the user's products per page setting stored in Firestore.
   * The state of the radio buttons are updated from the retrieved value.
   */
  async getProductsPerPage() {
    let res = await firebase
      .firestore()
      .collection("productsPerPage")
      .doc(await AsyncStorage.getItem("userID"))
      .get();
    this.setState({
      checked:
        res._delegate._document.data.value.mapValue.fields.number.stringValue,
    });
  }

  /**
   * Function to get the current user's email address and update the Text component
   * displaying this info.
   */
  async updateCurrentEmailState() {
    this.setState({
      currentEmail: `Signed in as: ${await AsyncStorage.getItem("userEmail")}`,
    });
  }

  async updateCurrentLocationState() {
    this.setState({
      currentLocation: `Location: ${await AsyncStorage.getItem(
        "selectedLocation"
      )}`,
    });
  }

  componentDidMount() {
    this.updateCurrentEmailState();
    this.updateCurrentLocationState();
    /**
     * The Billing Address and Delivery Address screens have back buttons and can
     * be accessed from this screen and the Checkout screen. The previousPage
     * variable will allow those screens to determine which screen to go back to.
     */
    AsyncStorage.setItem("previousPage", "4");
    this.getProductsPerPage();
  }

  signOut() {
    deAuthUser();
    this.props.pageChange(PAGE_ID.login);
  }

  render() {
    const { checked } = this.state;
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
        {/* OverScroll being enabled ruins shadow effect */}
        <ScrollView stickyHeaderIndices={[0]} overScrollMode="never">
          <View style={{ height: 5 }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../assets/shadow.png")}
              imageStyle={{ resizeMode: "repeat" }}
            ></ImageBackground>
          </View>
          <Text style={globalStyle.subHeaderText} accessibilityRole="header">
            Personal:
          </Text>
          <Text style={style.signedInText}>{this.state.currentEmail}</Text>
          <Text style={style.signedInText}>{this.state.currentLocation}</Text>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() => this.props.pageChange(PAGE_ID.delivery_address)}
            accessibilityRole="button"
          >
            <Text style={globalStyle.wideButtonText}>
              Change Delivery Address
            </Text>
          </Pressable>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() => this.props.pageChange(PAGE_ID.billing_info)}
            accessibilityRole="button"
          >
            <Text style={globalStyle.wideButtonText}>Change Billing Info</Text>
          </Pressable>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() => this.props.pageChange(PAGE_ID.location)}
            testID="Test_LocationChange"
          >
            <Text style={globalStyle.wideButtonText}>Change Location</Text>
          </Pressable>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() => this.signOut()}
            accessibilityRole="button"
          >
            <Text style={globalStyle.wideButtonText}>Sign Out</Text>
          </Pressable>
          <View style={{ minHeight: 24 }}></View>
          <Text style={globalStyle.subHeaderText} accessibilityRole="header">
            Other:
          </Text>
          <Text style={style.subSubHeaderText}>Search Results Per Page</Text>
          <RadioButton.Group accessibilityRole="radiogroup">
            <RadioButton.Item
              color="#000"
              uncheckedColor="#000"
              value="10"
              label="10 products per page"
              status={checked === "10" ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: "10" });
              }}
              accessibilityRole="radio"
            />
            <RadioButton.Item
              color="#000"
              uncheckedColor="#000"
              value="20"
              label="20 products per page"
              status={checked === "20" ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: "20" });
              }}
              accessibilityRole="radio"
            />
            <RadioButton.Item
              color="#000"
              uncheckedColor="#000"
              value="30"
              label="30 products per page"
              status={checked === "30" ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: "30" });
              }}
              accessibilityRole="radio"
            />
          </RadioButton.Group>
          <Pressable
            style={globalStyle.smallButtonStyle}
            onPress={() =>
              this.saveProductsPerPageInFirestore(this.state.checked)
            }
          >
            <Text style={globalStyle.smallButtonText}>Save</Text>
          </Pressable>
          <View style={globalStyle.wideButtonStyle}>
            <OpenURLButton url={"https://youtu.be/DwAJMdrL24c"}>Tutorial</OpenURLButton>
          </View>
          {/* Empty space so that the navbar doesn't cover the bottom of the settings page */}
          <View style={{ minHeight: 100 }}></View>
        </ScrollView>
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
              <Text style={{ textAlign: "center" }}>Settings</Text>
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
  subSubHeaderText: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
  },
});
