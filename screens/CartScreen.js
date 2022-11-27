import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, FlatList, TextInput, SafeAreaView } from "react-native";
import globalStyle from "../globalStyle";

/*
  TODOS:
    Set up warnings on out-of-stock products before ordering
    Store cart data locally on device
    Grab each product by id and add
    Simulate a checkout
    Add the total prices of each product
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
          <Text style={{backgroundColor: 'black', color: 'white', fontSize: 25, marginHorizontal: 20}}>{item.price}</Text>

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
        name: 'Product Item Title 1',
        price: '$0.00',
        quantity: 1
      },
      {
        id: 2,
        name: 'Product Item Title 2',
        price: '$20.00',
        quantity: 1
      },
      {
        id: 3,
        name: 'Product Item Title 3',
        price: '$50.00',
        quantity: 1
      },
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

  buyButton = () => {

  }

  removeProduct(productID) {
    let remove = this.state.products.filter((value, i) => {
      if(value.id !== productID) {
        return value
      }
    })
    this.setState({products: remove})
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          {/*Header*/}
          <Text style={style.header}>Cart</Text>

          {/*TODO: Total the prices*/}
          <Text style={{fontSize: 23, marginHorizontal: 20, marginBottom: 17}}>Grocery Total: $0.00</Text>

          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 23, marginHorizontal: 20, marginRight: 30}}>Delivery Price:$0.00</Text>

            {/*Takes user to the checkout screen*/}
            <Pressable style={style.button} onPress={this.buyButton}>
              <Text style={style.buttonText}>Buy</Text>
            </Pressable>
          </View>

          <Text style={{fontSize: 23, marginHorizontal: 20}}>Grand Total:     $0.00</Text>

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

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '45',
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
