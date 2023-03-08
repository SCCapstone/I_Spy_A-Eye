import * as React from "react";
import { Text, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import firebase from 'firebase';
require('firebase/auth');

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
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>Delivery Address</Text>
        <Pressable
          style={globalStyle.backButtonStyle}
          // Returns user back to settings screen.
          onPress={() => this.props.pageChange(4)}
        >
          <Text style={globalStyle.backButtonText}>&lt; Back</Text>
        </Pressable>
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Street Address"
          placeholderTextColor={"#000"}
          onChangeText={(newAddressInput) =>
            this.setState({ addressInput: newAddressInput.trim() })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="City"
          placeholderTextColor={"#000"}
          onChangeText={(newCityInput) =>
            this.setState({ cityInput: newCityInput.trim() })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Zip Code"
          placeholderTextColor={"#000"}
          onChangeText={(newZipCodeInput) =>
            this.setState({ zipCodeInput: newZipCodeInput.trim() })
          }
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="State"
          placeholderTextColor={"#000"}
          onChangeText={(newStateInput) =>
            this.setState({ stateInput: newStateInput.trim() })
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