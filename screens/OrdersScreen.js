import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import globalStyle from "../globalStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PAGE_ID } from "../utils/constants.js";

class ListItem extends React.Component {
  render() {
    const {item} = this.props

    return(
      <View>
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{item.title}</Text>

        {/*Horizontal line*/}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 10,
            marginTop: 20
          }}
        />
      </View>
    )
  }
}

export default class Page3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOrLogIn: "",
      orders: []
    };
  }

  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn"),
    });
  }

  componentDidMount = async () => {
    this.updateNavBarText();
    try {
      const orders = await AsyncStorage.getItem("ordersScreen")
      this.displayOrders()
      //this.removingOrders()

      if (orders) {
        this.setState({orders})
      }
    } catch (err) {
      console.log(err)
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.length !== this.state.orders.length) {
      // something did change, save everything in products to local storage
      await AsyncStorage.setItem("ordersScreen", JSON.stringify(this.state.orders))
    }
  }

  displayOrders = async () => {
    let arrayItems = await AsyncStorage.getItem("orders")
    arrayItems = JSON.parse(arrayItems)
    let array = arrayItems
    if (array) {
      await AsyncStorage.setItem("clearing", JSON.stringify(array))
      this.setState({orders: array})
    }
    console.log(this.state.orders)
  }

  removingOrders = async () => {
    let ordersArray = await AsyncStorage.getItem("removeOrders")
    ordersArray = JSON.parse(ordersArray)
    this.setState({orders: ordersArray})
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          {/*Header*/}
          <Text style={style.header}>Orders</Text>

          {/*Horizontal line*/}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 10,
              marginTop: 5,
            }}
          />
          <View
            style={{
              borderBottomColor: "lightgrey",
              borderBottomWidth: 5,
            }}
          />

          <FlatList
            data={this.state.orders}
            renderItem={({item, index}) =>
              <ListItem
                item={item}
              />
            }
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={globalStyle.navBarContainer}>
          <View style={globalStyle.buttons} testID="Test_NavigationBar">
            <TouchableOpacity 
              onPress={() => this.props.pageChange(PAGE_ID.search)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/search.png")}
                accessible={true}
                accessibilityLabel={"Magnifying Glass Icon"}
              />
              <Text style={{textAlign: "center"}}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.props.pageChange(PAGE_ID.cart)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/cart.png")}
                accessible={true}
                accessibilityLabel={"Shopping Cart Icon"}
              />
              <Text style={{textAlign: "center"}}>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.props.pageChange(PAGE_ID.orders)}
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/orders.png")}
                accessible={true}
                accessibilityLabel={"Reciept Icon"}
              />
              <Text style={{textAlign: "center"}}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.props.pageChange(PAGE_ID.settings)} 
              style={globalStyle.navButtonContainer}
            >
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text style={{textAlign: "center"}}>{this.state.settingsOrLogIn}</Text>
            </TouchableOpacity>
          </View>
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
  },
});
