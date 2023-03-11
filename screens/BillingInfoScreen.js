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

export default class BillingInfoScreen extends React.Component {
  constructor(props) {
    super(props);
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
            {/*The user can choose to have products delivered or available for pick-up*/}
            <Text style={{ marginLeft: 25, marginTop: 10 }}>
              Delivery or Pick-Up
            </Text>
            <TextInput placeholder="Pick-Up" style={globalStyle.wideInputContainer} />

            {/*The user can input the delivery address*/}
            <Text style={{ marginLeft: 25, marginTop: 10 }}>
              Delivery Address
            </Text>
            <TextInput style={globalStyle.wideInputContainer} />

            {/*The user can input billing information*/}
            <Text style={{ marginLeft: 25, marginTop: 10 }}>Name on Card</Text>
            <TextInput style={globalStyle.wideInputContainer} />

            <Text style={{ marginLeft: 25, marginTop: 10 }}>Card Number</Text>
            <TextInput style={globalStyle.wideInputContainer} />

            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 25, marginTop: 10 }}>Expiry Date</Text>
              <Text style={{ marginLeft: 125, marginTop: 10 }}>
                Security Code
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TextInput style={style.date_code} />

              <TextInput
                style={[style.date_code, { marginLeft: 40 }]}
                keyboardType={"numeric"}
              />
            </View>

            <Text style={{ marginLeft: 25, marginTop: 10 }}>
              Zip/Postal Code
            </Text>
            <TextInput style={style.input} keyboardType={"numeric"} />
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
});
