import React from "react";
import { PAGE_ID } from "../utils/constants";
import {
  showOnlyFourDigitsOfCardNumber,
  replaceSecurityCodeWithAsterisks,
} from "../utils/CheckoutScreenFunctions";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import globalStyle from "../globalStyle";
import firebase from "firebase";
require("firebase/auth");
import AsyncStorage from "@react-native-async-storage/async-storage";

// User can checkout items in cart (Simulation)

export default class CheckoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressDelivery: "",
      cityDelivery: "",
      zipCodeDelivery: "",
      stateDelivery: "",
      nameBilling: "",
      cardNumberBilling: "",
      expiryBilling: "",
      securityCodeBilling: "",
    };
  }

  // Function to get the current user's delivery address stored in Firestore.
  async getDeliveryAddress() {
    let res = await firebase
      .firestore()
      .collection("delivery")
      .doc(await AsyncStorage.getItem("userID"))
      .get();
    this.setState({
      addressDelivery:
        res._delegate._document.data.value.mapValue.fields.address.stringValue,
    });
    this.setState({
      cityDelivery:
        res._delegate._document.data.value.mapValue.fields.city.stringValue,
    });
    this.setState({
      zipCodeDelivery:
        res._delegate._document.data.value.mapValue.fields.zipCode.stringValue,
    });
    this.setState({
      stateDelivery:
        res._delegate._document.data.value.mapValue.fields.state.stringValue,
    });
  }

  /**
   * Function to get the current user's billing info stored in Firestore.
   * The card number text and the security code text will be obfuscated for
   * displaying on this screen.
   */
  async getBillingInfo() {
    let res = await firebase
      .firestore()
      .collection("billing")
      .doc(await AsyncStorage.getItem("userID"))
      .get();
    this.setState({
      nameBilling:
        res._delegate._document.data.value.mapValue.fields.name.stringValue,
    });
    this.setState({
      cardNumberBilling: showOnlyFourDigitsOfCardNumber(
        res._delegate._document.data.value.mapValue.fields.cardNumber
          .stringValue
      ),
    });
    this.setState({
      expiryBilling:
        res._delegate._document.data.value.mapValue.fields.expiry.stringValue,
    });
    this.setState({
      securityCodeBilling: replaceSecurityCodeWithAsterisks(
        res._delegate._document.data.value.mapValue.fields.securityCode
          .stringValue
      ),
    });
  }

  async componentDidMount() {
    this.getDeliveryAddress();
    this.getBillingInfo();
    /**
     * The Billing Address and Delivery Address screens have back buttons and can
     * be accessed from this screen and the settings screen. The previousPage
     * variable will allow those screens to determine which screen to go back to.
     */
    AsyncStorage.setItem("previousPage", "5");
  }

  // Function to "make a purchase" if all info is filled out.
  confirm = async () => {
    if (
      this.state.addressDelivery !== "" &&
      this.state.cityDelivery !== "" &&
      this.state.zipCodeDelivery !== "" &&
      this.state.stateDelivery !== "" &&
      this.state.nameBilling !== "" &&
      this.state.cardNumberBilling !== "" &&
      this.state.expiryBilling !== "" &&
      this.state.securityCodeBilling !== ""
    ) {
      alert("Thank you for your purchase!");
      let arrayItems = await AsyncStorage.getItem("product")
      arrayItems = JSON.parse(arrayItems)
      let orders = arrayItems
      if (orders) {
        await AsyncStorage.setItem("orders", JSON.stringify(orders))
      }
      // removing the products array from local storage
      await AsyncStorage.removeItem("product")
      this.props.pageChange(PAGE_ID.orders);
    } else {
      alert(
        "You haven't filled out all the required information to make a purchase."
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/*Takes user back to the cart screen*/}
            <Pressable
              onPress={() => this.props.pageChange(PAGE_ID.cart)}
              accessibilityLabel="Go Back"
              accessibilityRole="button"
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 35,
                  marginLeft: 10,
                  marginTop: 20,
                }}
              >
                {"<"}
              </Text>
            </Pressable>
            <Text style={style.header} accessibilityRole="header">
              Checkout
            </Text>
          </View>

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
            {/*The user can input the delivery address*/}
            <Text style={globalStyle.subHeaderText}>Delivery Address</Text>
            <Text style={globalStyle.paragraph}>
              {this.state.addressDelivery}
            </Text>
            <Text style={style.paragraph_bot_margin}>
              {this.state.cityDelivery}, {this.state.stateDelivery}{" "}
              {this.state.zipCodeDelivery}
            </Text>
            <Pressable
              style={style.mediumWidthButton}
              onPress={() => this.props.pageChange(PAGE_ID.delivery_address)}
              accessibilityRole="button"
            >
              <Text style={globalStyle.headerButtonText}>Change</Text>
            </Pressable>
            {/*Horizontal line*/}
            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 10,
                marginTop: 20,
              }}
            />
            <Text style={globalStyle.subHeaderText}>Billing Info</Text>
            <Text style={globalStyle.paragraph}>
              {"Name: "}
              {this.state.nameBilling}
            </Text>
            <Text style={style.paragraph_bot_margin}>
              {"Card Number: "}
              {this.state.cardNumberBilling}
              {"\n"}
              {"Security Code: "}
              {this.state.securityCodeBilling}
              {"\n"}
              {"Expiration: "}
              {this.state.expiryBilling}
            </Text>
            <Pressable
              style={style.mediumWidthButton}
              onPress={() => this.props.pageChange(PAGE_ID.billing_info)}
            >
              <Text style={globalStyle.headerButtonText}>Change</Text>
            </Pressable>
            {/*Horizontal line*/}
            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 10,
                marginTop: 20,
              }}
            />
            {/*Confirm Purchase which takes user to orders screen*/}
            <Pressable
              style={style.confirmButton}
              onPress={() => this.confirm()}
            >
              <Text style={style.buttonText}>Confirm Purchase</Text>
            </Pressable>

            <View
              style={{ flexDirection: "row", marginTop: 50, marginLeft: 10 }}
            >
              {/*The user can check the estimated delivery time*/}
              <Text style={{ fontSize: 20 }}>Estimated Delivery Time: </Text>
              <Text style={{ fontSize: 20 }}>5 hours</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 45,
    marginTop: 25,
    marginHorizontal: 75,
  },
  date_code: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: 150,
    padding: 10,
    margin: 10,
    marginLeft: 25,
  },
  confirmButton: {
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    width: 300,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  paragraph_bot_margin: {
    fontSize: 18,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
  },
  mediumWidthButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    maxWidth: "45%"
  }
});
