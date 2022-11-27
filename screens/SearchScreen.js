import * as React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import base64 from 'react-native-base64'
import { SafeAreaView } from "react-native";
import globalStyle from "../globalStyle";


// Holds data of all items
var itemList = []

const Item = ({ title, price, unitPrice, stock }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    {/* TODO: make price and stock align to edges of Item view */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly',}} >
      <Text style={styles.price}>${price}</Text>
      <Text style={{fontSize: 25}}>{unitPrice}</Text>
      <Text style={{fontSize: 25}}>Stock: {stock}</Text>
    </View>
  </View>
);

const renderItem = ({ item, price }) => (
  <><Item title={item.title} price={item.price} unitPrice={item.unitPrice} stock={item.stock}/></>
);

export default class Page1 extends React.Component {
  constructor(props) {
    super(props);
    // Set up default state for search bar input
    this.state = {
      input: "",
      location: "01400376",
      filters: {country: null, inStock: true, onSale: false, favorited: false},
      sort: null,
      latestResults: null,
    };
  }

  render() {
    
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        {/* Search Header */}
        <View style={{marginHorizontal:15}}>
          <Text style={globalStyle.headerText}>Search</Text>

          {/* Row 1: Text Input and Search Button */}
          <View style={globalStyle.headerButtonRow}>
            {/* Search Bar Input */}
            <TextInput 
              style={[globalStyle.inputContainer, {flex: 3.2, marginRight: 10, fontWeight: 'bold', fontSize: 18}]}
              placeholder="I'm looking for..."
              placeholderTextColor={'#000000'}
              onChangeText={newInput => this.setState({input: newInput.trim()})}
              />
            {/* Search Button */}
            <Pressable style={styles.searchButtonStyle}
              onPress={() => {
                  let searchResults = searchProducts(this.state);
                  if(searchResults != null) this.setState({latestResults: searchResults});
                }
                }
              >
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>

          {/* Row 2: Filter, Sort, and Scan Buttons (TODO: Add functionality and relevant popup menus) */}
          <View style={[globalStyle.headerButtonRow, {marginVertical: 10, marginHorizontal:-5}]}>
            {/* Filter Button */}
            <Pressable style={globalStyle.headerButtonStyle}>
              <Text style={globalStyle.headerButtonText}>Filter</Text>
            </Pressable>
            {/* Sort Button */}
            <Pressable style={globalStyle.headerButtonStyle}>
              <Text style={globalStyle.headerButtonText}>Sort</Text>
            </Pressable>
            {/* Scan Button */}
            <Pressable style={globalStyle.headerButtonStyle}>
              <Text style={globalStyle.headerButtonText}>Scan</Text>
            </Pressable>
          </View>
        </View>

        {/* Horizontal line separator */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, borderColor: 'black', borderBottomWidth: 10}} />
        </View>

        {/* Horizontal line separator's drop shadow */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, borderColor: '#cccccc', borderBottomWidth: 3}} />
        </View>
        
        {/* Holds all results of searched items. TODO: make flatlist view shorter. */}
        <FlatList
        data={itemList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

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

// Returns true if the input string meets the API's filter.term paramater requirements.
function validInput(inputText) {
  // Search terms limited to max of 8 words (separated by spaces). Must also be >= 3 characters
  if(inputText.length<3) return false;

  const terms = inputText.split(/\s+/); // Split inputText into separate terms using regex
  if(terms.length>8) return false;

  return true;
}

// Input: class state. Returns JSON response if the API call is successful, null otherwise. TO-DO: Filter/sort results after fetch
async function searchProducts(state) {
  // Confirm input is valid before querying
  if(!validInput(state.input)) {
    showAlert("Invalid Input", "Input must be 3 characters or more, and have at most 8 words.");
    return null;
  }

  // Build query
  let callURL = `https://api.kroger.com/v1/products?filter.term=${state.input}&filter.locationId=${state.location}&filter.fulfillment=dth`;

  // Fetch results
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    }
  }

  let response = await fetch(callURL, options);
  let responseJSON = await response.json();

  // If failed request, Alert the user and return null
  if(!response.ok) {
    let errorHeader = 'Error ' + response.status.toString() + ': ' + responseJSON.code
    showAlert(errorHeader, responseJSON.errors.reason);
    return null;
  }
  console.log(responseJSON)

  // Iterates through JSON file and stores items into itemList
  for (let i = 0; i < responseJSON.data.length; i++) {
    // Add to array by index
    itemList[i] = {
      id: responseJSON.data[i].productId,
      title: responseJSON.data[i].description,
      // TODO: figure out how to better parse JSON array so that price is not 0
      price: responseJSON.data[i].items[0].price.promo,
      // TODO: remove placeholder
      unitPrice: 0,
      // TODO: remove placeholder
      stock: "Low",
    }
  }

  return responseJSON;


  // Input: Strings for the alert's title and alert's message. Displays a simple, cancellable alert with the given title and message
  function showAlert(alertTitle, alertMsg) {
    Alert.alert(
      alertTitle,
      alertMsg,
      [{text: "OK"}],
      {cancelable: true}
    )
  }
}

const styles = StyleSheet.create({
    searchButtonStyle: {
      flex: 1,
      backgroundColor: 'black',
      borderRadius: 20,
      paddingVertical: 17,
      paddingHorizontal: 10,
    },
    searchButtonText:{
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#fff',
      marginVertical: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderBottomColor: '#000',
      borderBottomWidth: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    price: {
      backgroundColor: 'black',
      color: 'white',
      fontSize: 25,
    },
})
