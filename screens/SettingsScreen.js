import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { firebaseAuth } from "../firebase";
import globalStyle from "../globalStyle";

export default class Page4 extends React.Component {

  /**
   * Function to sign out users through Firebase. After a successful sign out, the user
   * is redirected to the Log In screen.
   */
  signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        alert("Successfully signed out.");
        this.props.pageChange(0);
      })
      .catch((error) => alert(error.message));
  };

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text style={globalStyle.headerText}>Settings</Text>
        <Pressable
          style={styles.signOutButtonStyle}
          onPress={() => this.signOut()}
        >
          <Text style={styles.SignOutText}>Sign Out</Text>
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

const styles = StyleSheet.create({
  signOutButtonStyle: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 20,
    maxHeight: 50,
    minHeight: 50,
  },
  SignOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
});
