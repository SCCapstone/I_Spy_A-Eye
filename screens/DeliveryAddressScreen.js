import * as React from "react";
import { PAGE_ID } from "../constants";
import { Text, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import firebase from 'firebase';
require('firebase/auth');
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class DeliveryAddress extends React.Component {

  // Holds the values of the text input fields on this screen.
  constructor(props) {
    super(props);
    this.state = {
      addressInput: "",
      cityInput: "",
      zipCodeInput: "",
      stateInput: ""
    };
  }

  // Function to get the current user's delivery address stored in Firestore.
  async getDeliveryAddress() {
    let dataResponse = await firebase.firestore().collection('users').doc(await AsyncStorage.getItem("userID")).get();
    this.setState({ addressInput: dataResponse._delegate._document.data.value.mapValue.fields.address.stringValue });
    this.setState({ cityInput: dataResponse._delegate._document.data.value.mapValue.fields.city.stringValue });
    this.setState({ zipCodeInput: dataResponse._delegate._document.data.value.mapValue.fields.zipCode.stringValue });
    this.setState({ stateInput: dataResponse._delegate._document.data.value.mapValue.fields.state.stringValue });
  }

  componentDidMount() {
    this.getDeliveryAddress();
  }

  /**
   * Function to update the current user's
   * @param {*} addressInput 
   * @param {*} cityInput 
   * @param {*} zipCodeInput 
   * @param {*} stateInput 
   */
  saveDeliveryAddressFirestore(addressInput, cityInput, zipCodeInput, stateInput) {
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.firestore().collection('users')
        .doc(user.uid).set({
          address: addressInput,
          city: cityInput,
          zipCode: zipCodeInput,
          state: stateInput
        });
    });
    // Returns user back to settings screen.
    this.props.pageChange(PAGE_ID.settings);
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen} >
        <Text style={globalStyle.headerText}>Delivery Address</Text>
        <Pressable
          style={globalStyle.backButtonStyle}
          // Returns user back to settings screen.
          onPress={() => this.props.pageChange(PAGE_ID.settings)}
        >
          <Text style={globalStyle.backButtonText}>&lt; Back</Text>
        </Pressable>
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Street Address"
          value={this.state.addressInput}
          placeholderTextColor={"#000"}
          onChangeText={(newAddressInput) =>
            this.setState({ addressInput: newAddressInput })
          }

        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="City"
          value={this.state.cityInput}
          placeholderTextColor={"#000"}
          onChangeText={(newCityInput) =>
            this.setState({ cityInput: newCityInput })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Zip Code"
          value={this.state.zipCodeInput}
          placeholderTextColor={"#000"}
          onChangeText={(newZipCodeInput) =>
            this.setState({ zipCodeInput: newZipCodeInput })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="State"
          value={this.state.stateInput}
          placeholderTextColor={"#000"}
          onChangeText={(newStateInput) =>
            this.setState({ stateInput: newStateInput })
          }
        />

        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() =>
            this.saveDeliveryAddressFirestore(
              this.state.addressInput,
              this.state.cityInput,
              this.state.zipCodeInput,
              this.state.stateInput
            )}
        >
          <Text style={globalStyle.wideButtonText}>Update</Text>
        </Pressable>
      </SafeAreaView>
    )
  }
}