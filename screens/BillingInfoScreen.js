import React from "react";
import {
  nameIsValidOrEmpty,
  securityCodeIsValidOrEmpty,
  cardNumberIsValidOrEmpty,
  expiryIsValidOrEmpty
} from "../utils/BillingInfoFunctions";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ImageBackground,
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
    /**
     * This will disable the saving of incorrect information while giving a chance
     * for users to leave fields blank. Empty info isn't allowed when users try to
     * confirm a purchase however.
     */
    if (
      nameIsValidOrEmpty(nameInput) &&
      securityCodeIsValidOrEmpty(securityCodeInput) &&
      cardNumberIsValidOrEmpty(cardNumberInput) &&
      expiryIsValidOrEmpty(expiryInput)
    ) {
      firebase.auth().onAuthStateChanged(function (user) {
        firebase.firestore().collection("billing").doc(user.uid).set({
          name: nameInput,
          cardNumber: cardNumberInput,
          expiry: expiryInput,
          securityCode: securityCodeInput,
        });
      });

      this.returnToPreviousPage();
      this.state = {
        nameInput: "",
        cardNumberInput: "",
        expiryInput: "",
        securityCodeInput: "",
      };
    }
  }

  // Returns user back to previous screen.
  async returnToPreviousPage() {
    this.props.pageChange(
      parseInt(await AsyncStorage.getItem("previousPage"), 10)
    );
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => this.returnToPreviousPage()}>
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
          <ScrollView stickyHeaderIndices={[0]}>
          <View style={{height: 5}}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={require("../assets/shadow.png")}
              imageStyle={{ resizeMode: "repeat" }}
            ></ImageBackground>
          </View>
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
              placeholder="################"
              keyboardType={"numeric"}
              placeholderTextColor={"#000"}
              style={globalStyle.billingDeliveryInput}
              onChangeText={(newCardNumberInput) =>
                this.setState({ cardNumberInput: newCardNumberInput })
              }
              value={this.state.cardNumberInput}
            />
            <View style={globalStyle.date_codes}>
              <View style={globalStyle.date_codeContainter}>
                <Text style={globalStyle.paragraph}>Expiry Date</Text>
                <TextInput
                  placeholder="MM/YY"
                  placeholderTextColor={"#000"}
                  style={globalStyle.date_code}
                  value={this.state.expiryInput}
                  onChangeText={(newExpiryInput) =>
                    this.setState({ expiryInput: newExpiryInput })
                  }
                />
              </View>
              <View style={globalStyle.date_codeContainter}>
                <Text style={globalStyle.paragraph}>Security Code</Text>
                <TextInput
                  placeholder="###"
                  placeholderTextColor={"#000"}
                  style={globalStyle.date_code}
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
