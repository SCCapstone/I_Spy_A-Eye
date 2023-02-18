import * as React from "react";
import { Text, View, TouchableOpacity, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { firebaseAuth } from "../firebase";
import globalStyle from "../globalStyle";
require('firebase/auth');


export default class Page4 extends React.Component {

  /**
   * Function to sign out users through Firebase. After a successful sign out, the user
   * is redirected to the Log In screen.
   */
  signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        this.props.pageChange(0);
      })
      .catch((error) => alert(error.message));
  };

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>Settings</Text>
        <Text
          style={{ fontWeight: "bold", fontSize: 30, marginLeft: 8 }}
        >
          Personal:
        </Text>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.props.pageChange(7)}
        >
          <Text style={globalStyle.wideButtonText}>Change Delivery Address</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
        >
          <Text style={globalStyle.wideButtonText}>Clear Shopping History</Text>
        </Pressable>
        <Pressable
          style={globalStyle.wideButtonStyle}
          onPress={() => this.signOut()}
        >
          <Text style={globalStyle.wideButtonText}>Sign Out</Text>
        </Pressable>
        <View style={globalStyle.container}>
          <View style={globalStyle.buttons}>
            <TouchableOpacity onPress={() => this.props.pageChange(1)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/search.png")}
                accessible={true}
                accessibilityLabel={"Magnifying Glass Icon"}
              />
              <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(2)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/cart.png")}
                accessible={true}
                accessibilityLabel={"Shopping Cart Icon"}
              />
              <Text>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(3)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/orders.png")}
                accessible={true}
                accessibilityLabel={"Reciept Icon"}
              />
              <Text>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(4)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
