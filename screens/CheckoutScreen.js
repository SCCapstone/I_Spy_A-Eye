import React from "react";
import { PAGE_ID } from "../utils/constants";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
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
    };
  }

  // Function to get the current user's delivery address stored in Firestore.
  async getDeliveryAddress() {
    let res = await firebase
      .firestore()
      .collection("users")
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

  componentDidMount() {
    this.getDeliveryAddress();
  }

  confirm = () => {
    alert("Thank you for your purchase!");
    this.props.pageChange(PAGE_ID.orders);
  };

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/*Takes user back to the cart screen*/}
            <Pressable onPress={() => this.props.pageChange(PAGE_ID.cart)}>
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
            <Text style={style.header}>Checkout</Text>
          </View>

          {/*Horizontal line*/}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 10,
              marginTop: 20,
            }}
          />
          <ScrollView>
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
              style={globalStyle.headerButtonStyle}
              onPress={() => this.props.pageChange(PAGE_ID.delivery_address)}
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
            <Pressable 
              style={globalStyle.headerButtonStyle}
              // onPress={() => this.props.pageChange(PAGE_ID.delivery_address)}
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
  input: {
    backgroundColor: "white",
    width: 350,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    marginLeft: 25,
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
});
