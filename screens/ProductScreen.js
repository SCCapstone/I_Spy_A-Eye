import React from "react";
import {Alert, Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, Pressable, FlatList, TextInput, SafeAreaView, ScrollView } from "react-native";
import globalStyle from "../globalStyle"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGE_ID } from "../utils/constants.js";
import { token } from "../App.js";
import { Button } from "react-native-paper";

  function showAlert(alertTitle, alertMsg) {
    Alert.alert(alertTitle, alertMsg, [{ text: "OK" }], { cancelable: true });
  }

  export default class SettingsScreen extends React.Component {
    constructor(props) {
      super(props);
        this.state = {
          productID: "",
          productName: "",
          productPrice: "",
          productUntiPrice: "",
          productStock: "",
          productImage: "",
          location: "",
          Results: []
        };
    }

    async updateProductID() {
        this.setState({
          productID: `${await AsyncStorage.getItem("productID")}`,
        });
      }

    async updateProductName() {
        this.setState({
          productName: `${await AsyncStorage.getItem("productName")}`,
        });
      }
    async updateProductPrice() {
        this.setState({
          productPrice: `${await AsyncStorage.getItem("productPrice")}`,
        });
      }
    async updateProductUnitPrice() {
        this.setState({
          productUnitPrice: `${await AsyncStorage.getItem("productUnitPrice")}`,
        });
      }
    async updateProductStock() {
        this.setState({
          productStock: `${await AsyncStorage.getItem("productStock")}`,
        });
      }
    async updateProductImage() {
        this.setState({
          productImage: `${await AsyncStorage.getItem("productImage")}`,
        });
      }
    componentDidMount() {
        this.updateProductID();
        this.updateProductName();
        this.updateProductPrice();
        this.updateProductUnitPrice();
        this.updateProductStock();
        this.updateProductImage();
    }
    render() {
        return(
            <SafeAreaView style={globalStyle.wholeScreen}>
                <View>
                    <Text style={globalStyle.headerText} testID="Test_SearchTextHeader">Product Details</Text>
                    <View
                    style={{
                        borderBottomColor: "black",
                        borderBottomWidth: 10,
                        marginTop: 20,
                    }}
                    />
                    <View style={{ height: 5 }}>
                        <ImageBackground
                        style={{ width: "100%", height: "100%" }}
                        source={require("../assets/shadow.png")}
                        imageStyle={{ resizeMode: "repeat" }}
                        ></ImageBackground>
                    </View>
                    <ScrollView>
                        <View style={{width: 120, paddingHorizontal: 10, paddingVertical: 8, flex:1}}>
                            <Pressable style={globalStyle.headerButtonStyle} onPress={() => {
                                this.props.pageChange(PAGE_ID.search)
                                }}> 
                                <Text style={globalStyle.headerButtonText}>Back</Text>
                            </Pressable>
                        </View>
                        <View style={styles.ProductTitleBox}>
                                <Text style = {styles.ProductTitleText}>{this.state.productName}</Text>
                        </View>
                        <Text></Text>
                        <View style={styles.PriceInfoBox}>
                                <Text style={styles.PriceText}>${this.state.productPrice}</Text>
                                <Text style= {styles.PriceText}>{this.state.productUnitPrice}</Text>
                        </View>
                        <View style={styles.StockInfoBox}>
                                <Text style={styles.PriceText}>Stock: {this.state.productStock}</Text>
                        </View>
                        <Image style = {styles.Image}source={{uri: this.state.productImage}}/>
                    </ScrollView>
                </View>
                <View style={globalStyle.navBarContainer}>
          <View style={globalStyle.buttons} testID="Test_NavigationBar">
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.search)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/search.png")}
                accessible={true}
                accessibilityLabel="Magnifying Glass Icon"
              />
              <Text style={{ textAlign: "center" }}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.cart)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/cart.png")}
                accessible={true}
                accessibilityLabel="Shopping Cart Icon"
              />
              <Text style={{ textAlign: "center" }}>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.orders)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/orders.png")}
                accessible={true}
                accessibilityLabel="Reciept Icon"
              />
              <Text style={{ textAlign: "center" }}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.pageChange(PAGE_ID.settings)}
              style={globalStyle.navButtonContainer}
              accessibilityRole="menuitem"
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel="Gear Icon"
              />
              <Text style={{ textAlign: "center" }}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    ProductTitleBox: {
        flex: 1,
        paddingHorizontal: 10
    },
    ProductTitleText: {
        fontWeight:"bold",
        fontSize: 28,
    },
    PriceInfoBox: {
        flex: .8,
        flexDirection: 'row',
        paddingHorizontal:10,
        justifyContent:'space-between',
    },
    StockInfoBox: {
        flex: .8,
        flexDirection: 'row',
        paddingHorizontal:10,
        justifyContent:'space-between',
        paddingBottom:10
    },
    PriceText: {
        fontSize: 20
    },
    Image: {
        width:300,
        height:300,
        alignSelf:'center',
        borderColor:'black',
        borderWidth: 5,
        borderRadius:20
    }
})