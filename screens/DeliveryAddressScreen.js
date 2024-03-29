import * as React from "react";
import {
  addressIsValidOrEmpty,
  cityIsValidOrEmpty,
  zipCodeIsValidOrEmpty,
  stateIsValidOrEmpty,
  zipCodeBelongsToState
} from "../utils/DeliveryAddressFunctions";
import {
  Text,
  Pressable,
  SafeAreaView,
  TextInput,
  ScrollView,
  View,
} from "react-native";
import globalStyle from "../globalStyle";
import firebase from "firebase";
require("firebase/auth");
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class DeliveryAddress extends React.Component {
  // Holds the values of the text input fields on this screen.
  constructor(props) {
    super(props);
    this.state = {
      addressInput: "",
      cityInput: "",
      zipCodeInput: "",
      stateInput: "",
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
      addressInput:
        res._delegate._document.data.value.mapValue.fields.address.stringValue,
    });
    this.setState({
      cityInput:
        res._delegate._document.data.value.mapValue.fields.city.stringValue,
    });
    this.setState({
      zipCodeInput:
        res._delegate._document.data.value.mapValue.fields.zipCode.stringValue,
    });
    this.setState({
      stateInput:
        res._delegate._document.data.value.mapValue.fields.state.stringValue,
    });
  }

  componentDidMount() {
    this.getDeliveryAddress();
  }

  /**
   * Function to update the current user's deleivery address in Firestore.
   * @param {*} addressInput the address of the current user
   * @param {*} cityInput the city of the current user
   * @param {*} zipCodeInput the zip code of the current user
   * @param {*} stateInput the state of the current user
   */
  async saveDeliveryAddressFirestore(
    addressInput,
    cityInput,
    zipCodeInput,
    stateInput
  ) {
    /**
     * This will disable the saving of incorrect information while giving a chance
     * for users to leave fields blank. Empty info isn't allowed when users try to
     * confirm a purchase however.
     */
    if (
      addressIsValidOrEmpty(addressInput) &&
      cityIsValidOrEmpty(cityInput) &&
      zipCodeIsValidOrEmpty(zipCodeInput) &&
      stateIsValidOrEmpty(stateInput) &&
      zipCodeBelongsToState(stateInput, zipCodeInput)
    ) {
      firebase.auth().onAuthStateChanged(function (user) {
        firebase.firestore().collection("delivery").doc(user.uid).set({
          address: addressInput,
          city: cityInput,
          zipCode: zipCodeInput,
          state: stateInput,
        });
      });
      this.returnToPreviousPage();
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
        <Text style={globalStyle.headerText} accessibilityRole="header">
          Delivery Address
        </Text>
        <Pressable
          style={globalStyle.smallButtonStyle}
          // Returns user back to previous page.
          onPress={() => this.returnToPreviousPage()}
          accessibilityRole="button"
        >
          <Text style={globalStyle.smallButtonText}>&lt; Back</Text>
        </Pressable>
        <ScrollView>
          <Text style={globalStyle.paragraph}>Street Address</Text>
          <TextInput
            style={globalStyle.billingDeliveryInput}
            value={this.state.addressInput}
            onChangeText={(newAddressInput) =>
              this.setState({ addressInput: newAddressInput })
            }
          />
          <Text style={globalStyle.paragraph}>City</Text>
          <TextInput
            style={globalStyle.billingDeliveryInput}
            value={this.state.cityInput}
            onChangeText={(newCityInput) =>
              this.setState({ cityInput: newCityInput })
            }
          />
          <View style={globalStyle.date_codes}>
            <View style={globalStyle.date_codeContainter_left}>
              <Text style={globalStyle.paragraph}>Zip Code</Text>
              <TextInput
                style={globalStyle.date_code}
                placeholder="#####"
                value={this.state.zipCodeInput}
                placeholderTextColor={"#000"}
                onChangeText={(newZipCodeInput) =>
                  this.setState({ zipCodeInput: newZipCodeInput })
                }
              />
            </View>
            <View style={globalStyle.date_codeContainter_right}>
              <Text style={globalStyle.paragraph}>State</Text>
              <TextInput
                style={globalStyle.date_code}
                placeholder="Name or Abbreviation"
                value={this.state.stateInput}
                placeholderTextColor={"#000"}
                onChangeText={(newStateInput) =>
                  this.setState({ stateInput: newStateInput })
                }
              />
            </View>
          </View>
          <Pressable
            style={globalStyle.wideButtonStyle}
            onPress={() =>
              this.saveDeliveryAddressFirestore(
                this.state.addressInput,
                this.state.cityInput,
                this.state.zipCodeInput,
                this.state.stateInput
              )
            }
            accessibilityRole="button"
          >
            <Text style={globalStyle.wideButtonText}>Update</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
