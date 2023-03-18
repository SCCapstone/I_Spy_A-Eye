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

export default class BillingInfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInput: "",
      cardNumberInput: "",
      expiryInput: "",
      securityCodeInput: "",
    };
  }

  // Function to get the current user's billing info stored in Firestore.
  async getBillingInfo() {
    let res = await firebase
      .firestore()
      .collection("billing")
      .doc(await AsyncStorage.getItem("userID"))
      .get();
    this.setState({
      nameInput:
        res._delegate._document.data.value.mapValue.fields.name.stringValue,
    });
    this.setState({
      cardNumberInput:
        res._delegate._document.data.value.mapValue.fields.cardNumber
          .stringValue,
    });
    this.setState({
      expiryInput:
        res._delegate._document.data.value.mapValue.fields.expiry.stringValue,
    });
    this.setState({
      securityCodeInput:
        res._delegate._document.data.value.mapValue.fields.securityCode
          .stringValue,
    });
  }

  componentDidMount() {
    this.getBillingInfo();
  }

  saveBillingInfoFirestore(
    nameInput,
    cardNumberInput,
    expiryInput,
    securityCodeInput
  ) {
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.firestore().collection("billing").doc(user.uid).set({
        name: nameInput,
        cardNumber: cardNumberInput,
        expiry: expiryInput,
        securityCode: securityCodeInput,
      });
    });
    // Returns user back to settings screen.
    this.props.pageChange(PAGE_ID.settings);
    this.state = {
      nameInput: "",
      cardNumberInput: "",
      expiryInput: "",
      securityCodeInput: "",
    };
  }

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
            <Text style={style.header}>Billing Info</Text>
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
            {/*The user can input billing information*/}
            <Text style={globalStyle.paragraph}>Name on Card</Text>
            <TextInput
              style={globalStyle.billingDeliveryInput}
              value={this.state.nameInput}
              onChangeText={(newNameInput) =>
                this.setState({ nameInput: newNameInput })
              }
            />

            <Text style={globalStyle.paragraph}>Card Number</Text>
            <TextInput
              placeholder="#### #### #### ####"
              placeholderTextColor={"#000"}
              style={globalStyle.billingDeliveryInput}
              onChangeText={(newCardNumberInput) =>
                this.setState({ cardNumberInput: newCardNumberInput })
              }
              value={this.state.cardNumberInput}
            />
            <View style={{ flexDirection: "row" }}>
              <View style={style.date_codeContainter}>
                <Text style={globalStyle.paragraph}>Expiry Date</Text>
                <TextInput
                  placeholder="MM/YY"
                  placeholderTextColor={"#000"}
                  style={style.date_code}
                  value={this.state.expiryInput}
                  onChangeText={(newExpiryInput) =>
                    this.setState({ expiryInput: newExpiryInput })
                  }
                />
              </View>
              <View style={style.date_codeContainter}>
                <Text style={globalStyle.paragraph}>Security Code</Text>
                <TextInput
                  placeholder="###"
                  placeholderTextColor={"#000"}
                  style={style.date_code}
                  keyboardType={"numeric"}
                  value={this.state.securityCodeInput}
                  onChangeText={(newSecurityCodeInput) =>
                    this.setState({ securityCodeInput: newSecurityCodeInput })
                  }
                />
              </View>
            </View>

            <Pressable
              style={globalStyle.wideButtonStyle}
              onPress={() =>
                this.saveBillingInfoFirestore(
                  this.state.nameInput,
                  this.state.cardNumberInput,
                  this.state.expiryInput,
                  this.state.securityCodeInput
                )
              }
            >
              <Text style={globalStyle.wideButtonText}>Update</Text>
            </Pressable>
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
    paddingHorizontal: 25,
    borderWidth: 7,
    borderRadius: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 18,
    maxHeight: 60,
    minHeight: 50,
  },
  date_codeContainter: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: "40%",
    maxWidth: "40%",
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
});
