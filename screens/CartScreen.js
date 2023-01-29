import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, FlatList, TextInput, SafeAreaView } from "react-native";
import globalStyle from "../globalStyle"

/*
  TODOS:
    Store cart data locally on device
    Grab each product by id and add
*/

class ListItem extends React.Component {

  render() {
    const {item} = this.props
    
    return(
      <View>
        {/*Item title, depends on what the user adds to the cart, allows user to go to the details screen*/}
        <Pressable>
          <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{item.name}</Text>
        </Pressable>

        {/*Price, quantity, and remove button*/}
        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{backgroundColor: 'black', color: 'white', fontSize: 25, marginHorizontal: 20}}>${item.price}</Text>

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
  state = {
    products: [
      {
        id: 1,
        name: 'Deluxe Mint Chocolate Chip Ice Cream',
        price: '5.00',
        quantity: 1
      },
      {
        id: 2,
        name: '1% Lowfat Milk',
        price: '2.00',
        quantity: 1
      },
      {
        id: 3,
        name: 'Barbecue Flavored Potato Chips',
        price: '10.00',
        quantity: 1
      },
      {
        id: 4,
        name: "Bakery Fresh Goodness Peanut Butter Cookies",
        price: "3.00",
        quantity: 1
      },
      {
        id: 5,
        name: "Kellogg's Club Original Crackers Snack Stacks",
        price: "2.50",
        quantity: 1
      }
    ]
  }

  decrementValue = (item, index) => {
    const products = [...this.state.products]
    products[index].quantity = products[index].quantity - 1
    if(products[index].quantity <= 1) { // if less than or equal to 1
      products[index].quantity = 1 // set to 1
    }
    this.setState({products})
  }

  incrementValue = (item, index) => {
    const products = [...this.state.products] // empty array and copy everything over
    products[index].quantity = products[index].quantity + 1 // modify specific index quantity
    this.setState({products}) // update products
  }

  removeProduct = (productID) => {
    let remove = this.state.products.filter((value, i) => {
      if(value.id !== productID) {
        return value
      }
    })
    this.setState({products: remove})
  }

  addProduct = (x) => {
    return x * 10
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

  render() {
    let deliveryPrice = 5
    let grandTotal = this.addPrices() + deliveryPrice

    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          {/*Header*/}
          <Text style={style.header}>Cart</Text>

          <Text style={{fontSize: 23, marginHorizontal: 20, marginBottom: 17}}>Grocery Total: ${this.addPrices()}</Text>

          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 23, marginHorizontal: 20, marginRight: 30}}>Delivery Price:${deliveryPrice}.00</Text>

            {/*Takes user to the checkout screen*/}
            <Pressable testID="buyButton" style={style.button} onPress={() => this.props.pageChange(5)}>
              <Text style={style.buttonText}>Buy</Text>
            </Pressable>
          </View>

          <Text style={{fontSize: 23, marginHorizontal: 20}}>Grand Total:     ${grandTotal}</Text>

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
            data={this.state.products}
            renderItem={({item, index}) => 
              <ListItem 
                item={item}
                decrementValue={() => this.decrementValue(item, index)}
                incrementValue={() => this.incrementValue(item, index)}
                removeProduct={() => this.removeProduct(item.id)}
              />
            }
            keyExtractor={item => item.id}
          />
        </View>

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
