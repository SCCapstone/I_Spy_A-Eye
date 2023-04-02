import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, FlatList, TextInput, SafeAreaView } from "react-native";
import globalStyle from "../globalStyle"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGE_ID } from "../utils/constants.js";

class ListItem extends React.Component {

  render() {
    const {item} = this.props

    return(
      <View>
        {/*Item title, depends on what the user adds to the cart*/}
        <Pressable>
          <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{item.title}</Text>
        </Pressable>

        {/*Price, quantity, and remove button*/}
        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{color: 'black', fontSize: 25, marginHorizontal: 20}}>${item.price}</Text>

          <Pressable onPress={this.props.decrementValue}>
            <Text style={{fontWeight: 'bold', fontSize: 30}}>{'<'}</Text>
          </Pressable>

          {/*No longer pulling quantity off of the state*/}
          <TextInput style={{fontSize: 25}} keyboardType='numeric'>{item.quantity}</TextInput>

          <Pressable onPress={this.props.incrementValue}>
            <Text style={{fontWeight: 'bold', fontSize: 30, marginRight: 70}}>{'>'}</Text>
          </Pressable>

          <Pressable style={style.remove} onPress={this.props.removeProduct}>
            <Text style={{color: 'white', fontSize: 19, fontWeight:'bold'}}>Remove</Text>
          </Pressable>
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

export default class CartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      settingsOrLogIn: "",
      products: []
    }
  }

  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn")
    });
  }

  // when component loads on the screen
  componentDidMount = async () => {
    this.updateNavBarText();
    try {
      // grab data from local storage
      const products = JSON.parse(await AsyncStorage.getItem("cart"))
      this.addProduct()

      // if products is not empty
      if (products !== null) {
        this.setState({products})
      }
    } catch (err) {
      console.log(err)
    }
  }

  // invoked immediately after updating occurs (ex: removing)
  // saving data
  componentDidUpdate = async (prevProps, prevState) => {
    // if the previous state changes are not the same as current state changes
    if (prevState.length !== this.state.products.length) {
      // something did change, save everything in products to local storage
      await AsyncStorage.setItem("cart", JSON.stringify(this.state.products))
    }
  }

  decrementValue = async (productID) => {
    try {
      let arrayItems = await AsyncStorage.getItem("product")
      arrayItems = JSON.parse(arrayItems)
      let array = arrayItems
      for (let i = 0; i < array.length; i++) {
        if (array[i].id == productID) {
          array[i].quantity--
          if (array[i].quantity <= 1) {
            array[i].quantity = 1
          }
          await AsyncStorage.setItem("product", JSON.stringify(array))
          this.setState({products: array})
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  incrementValue = async (productID) => {
    try {
      let arrayItems = await AsyncStorage.getItem("product")
      arrayItems = JSON.parse(arrayItems)
      let array = arrayItems
      for (let i = 0; i < array.length; i++) {
        if (array[i].id == productID) {
          array[i].quantity++
          await AsyncStorage.setItem("product", JSON.stringify(array))
          this.setState({products: array})
        }
      }
    } catch (err) {
      console.log(err)
    }
}

  // removes item from cart, dont want items to reappear so use async
  removeProduct = async (productID) => {
    try {
      let arrayItems = await AsyncStorage.getItem("product")
      arrayItems = JSON.parse(arrayItems)
      let array = this.state.products.filter((e) => {
        return e.id !== productID
      })
      await AsyncStorage.setItem("product", JSON.stringify(array))
      this.setState({products: array})
    } catch (err) {
      console.log(err)
    }
  }

  // adds product to cart
  addProduct = async () => {
    let items = await AsyncStorage.getItem("product") // grab the array from search screen
    items = JSON.parse(items) // parse it
    if (items) { // if items is not null (empty)
      this.setState({products: items}) // set the state
    }
    console.log(this.state.products)
  }

  // Add the total prices of each product
  addPrices = () => {
    let totalPrice = 0
    this.state.products.forEach((item) => {
      totalPrice += item.quantity * item.price
    })
    Math.round(totalPrice * 100) / 100
    return totalPrice
  }

  buyButton = async () => {
    this.props.pageChange(PAGE_ID.checkout)
  }

  clearCart = async () => {
    //await AsyncStorage.removeItem("product")
    this.setState({products: []})
  }

  render() {
    let deliveryPrice = 5
    let grandTotal = 0
    // if grocery total is 0 dollars
    if (this.addPrices() == 0) {
      // then grand total is 0 dollars
      grandTotal = 0
    } else {
      // otherwise give the price
     grandTotal = this.addPrices() + deliveryPrice
    }

    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          {/*Header*/}
          <Text style={style.header} testID="test_CartTextHeader">Cart</Text>

          <Text style={{fontSize: 23, marginHorizontal: 20, marginBottom: 17}} testID="test_GroceryTextHeader">Grocery Total: ${this.addPrices()}</Text>

          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 23, marginHorizontal: 20, marginRight: 30}} testID="test_DeliveryTextHeader">Delivery Price: ${deliveryPrice}.00</Text>

            {/*Takes user to the checkout screen*/}
            <Pressable testID="test_BuyButtonHeader" style={style.button} onPress={() => this.buyButton()}>
              <Text style={style.buttonText}>Buy</Text>
            </Pressable>
          </View>

          <Text style={{fontSize: 23, marginHorizontal: 20}} testID="test_GrandTotalHeader">Grand Total:     ${grandTotal}</Text>

          {/*Horizontal line*/}
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 10,
              marginTop: 20
            }}
          />
          <View
            style={{
              borderBottomColor: 'lightgrey',
              borderBottomWidth: 5
            }}
          />

          <FlatList
            contentContainerStyle={{paddingBottom: 75}}
            data={this.state.products}
            renderItem={({item, index}) =>
              <ListItem 
                item={item}
                decrementValue={() => this.decrementValue(item.id)}
                incrementValue={() => this.incrementValue(item.id)}
                removeProduct={() => this.removeProduct(item.id)}
              />
            }
            keyExtractor={(item) => item.id}
            testID="test_ItemsInCart"
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
    flex: 1
  },
  header: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 45,
      marginTop: 25,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  remove: {
    backgroundColor: 'black',
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginRight: 15
  }
})
