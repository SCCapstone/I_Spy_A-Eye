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
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

class ListItem extends React.Component {
  render() {
    const {item} = this.props

    return(
      <View>
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{item.title}</Text>
        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{color: 'black', fontSize: 25, marginHorizontal: 20}}>${item.price}</Text>
          <Text style={{fontSize: 25, marginRight: 20}}>Quantity: {item.quantity}</Text>
        </View>

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
      orders: [],
    };
  }

  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn"),
    });
  }

  // when component loads on the screen
  componentDidMount = async () => {
    this.updateNavBarText();
    try {
      // grab data from local storage
      const orders = JSON.parse(await AsyncStorage.getItem("ordersScreen"))
      this.displayOrders()
      
      if (orders != null) {
        this.setState({orders})
      }
    } catch (err) {
      console.log(err)
    }
  }

  // invoked immediately after updating occurs (ex: removing)
  // saving data
  componentDidUpdate = async (prevProps, prevState) => {
    // if the previous state changes are not the same as current state changes
    if (prevState.length !== this.state.orders.length) {
      // something did change, save everything in products to local storage
      await AsyncStorage.setItem("ordersScreen", JSON.stringify(this.state.orders))
    }
  }

  // displays orders on the screen
  displayOrders = async () => {
    // for (let i = 0; i < this.state.orders; i++) {
    //   let arrayItems = await AsyncStorage.getItem("orders")
    //   arrayItems = JSON.parse(arrayItems)
    //   if (arrayItems) {
    //     let array = arrayItems
    //   }
    // }
    let arrayItems = await AsyncStorage.getItem("orders")
    arrayItems = JSON.parse(arrayItems)
    let array = arrayItems
    if (array) {
      this.setState({orders: array})
    }
    console.log(this.state.orders)
  }

  // clears order history
  removingOrders = async () => {
    await AsyncStorage.removeItem("orders")
    this.setState({orders: []})
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          <View style={{flexDirection: 'row'}}>
            {/*Header*/}
            <Text style={style.header}>Orders</Text>
            <Pressable style={style.clearButton} onPress={() => this.removingOrders()}>
              <Text style={style.clearButtonText}>Clear History</Text>
            </Pressable>
          </View>

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
            contentContainerStyle={{paddingBottom: 75}}
            data={this.state.orders}
            renderItem={({item, index}) =>
              <ListItem
                item={item}
              />
            }
            keyExtractor={(item, index) => index.toString()}
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
    fontSize: 40,
    marginTop: 35,
    marginLeft: 30
  },
  clearButton: {
    marginHorizontal: 100,
    marginTop: 40,
    marginBottom: 5,
    backgroundColor: 'black',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
});
