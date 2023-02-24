import * as React from "react";
import { Text, Pressable, SafeAreaView, TextInput } from "react-native";
import globalStyle from '../globalStyle';
import {firebaseAuth} from '../firebase';

export default class DeliveryAddress extends React.Component {
  // Holds the values of the text input fields on this screen.
  constructor(props) {
    super(props);
    this.state = {
      addressInput: "",
      cityInput: "",
      zipCodeInput: "",
      StateInput: "",
    };
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
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="Zip Code"
          placeholderTextColor={"#000"}
        />
        <TextInput
          style={globalStyle.loginSignUpInputContainer}
          placeholder="State"
          placeholderTextColor={"#000"}
        />

        <Pressable
          style={globalStyle.wideButtonStyle}
        >
          <Text style={globalStyle.wideButtonText}>Update</Text>
        </Pressable>
      </SafeAreaView>
    )
  }
}