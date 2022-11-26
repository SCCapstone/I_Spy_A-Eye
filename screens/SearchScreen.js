import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import {useState} from 'react'
import { SafeAreaView } from "react-native";
import globalStyle from "../globalStyle";
import { Buffer } from 'buffer';
import base64 from 'react-native-base64';


 /* var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.kroger.com/v1/products?filter.term=milk",
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }
  
  var answer = fetch(settings.url, {
    method: settings.method,
    headers: settings.headers
  })
  .then((response) => response.json())
  .then((body) => {
    //console.log('Success:', data);
    console.log(body.data.map(function(item) {var item1={}; item1["brand"] = item.brand; return item1}).filter(item=>item.brand=="Kroger"));
  })
  .catch((error) => {
    console.error('Error:', error);
  });
*/
export default class Page1 extends React.Component {
  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <Text>Search</Text>
        <View style={globalStyle.container}>
          <View style={globalStyle.buttons}>
            <TouchableOpacity onPress={() => this.props.pageChange(1)}>
              <Image
                style={globalStyle.icon}
                source={require("./gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(2)}>
              <Image
                style={globalStyle.icon}
                source={require("./gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(3)}>
              <Image
                style={globalStyle.icon}
                source={require("./gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(4)}>
              <Image
                style={globalStyle.icon}
                source={require("./gear.png")}
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

const styles = StyleSheet.create({});
