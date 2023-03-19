import { token } from "../App.js";
import * as React from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import globalStyle from "../globalStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Holds data of all items
var itemList = [];
// Json file that holds respose query for produce. Is shown automatically without the user searching. 
const produce = require("./produce.json");
// Used for indexing itemList array when items are added to it.
var itemIndex = 0;
// Add items to itemList from produce.json.
for (let i = 0; i < produce.data.length; i++) {
  // If price cannot be parsed from json item, it will not be added to itemList.
  if (produce.data[i].items[0].price.promo == 0) {
    continue;
  }
  // Add to array by index
  itemList[itemIndex] = {
    id: produce.data[i].productId,
    title: produce.data[i].description,
    // TODO: figure out how to better parse JSON array so that price is not 0
    price: produce.data[i].items[0].price.promo,
    // TODO: remove placeholder
    unitPrice: 0,
    // TODO: remove placeholder
    stock: "Low",
    quantity: 1,
    inCart: false,
  };
  itemIndex++;
}
// Reset to 0 so this var can be used again in adding different items to itemList when user searches.
itemIndex = 0;

// Template view for each item in flatlist.
const Item = ({ id, title, price, unitPrice, stock, quantity }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    {/* TODO: make price and stock align to edges of Item view */}
    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
      <Text style={styles.price}>${price}</Text>
      <Text style={{ fontSize: 25 }}>{unitPrice}</Text>
      <Text style={{ fontSize: 25 }}>Stock: {stock}</Text>
    </View>
    {/*Price, quantity, and remove button*/}
    <View
      style={{
        flexDirection: "row",
        marginTop: 20,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Decrement quantity button*/}
      {/* <Pressable onPress={() => decrementQuantity(id)}>
        <Text style={{ fontWeight: "bold", fontSize: 30 }}>{"<"}</Text>
      </Pressable> */}

      {/*No longer pulling quantity off of the state*/}
      {/* <TextInput style={{ fontSize: 25 }} keyboardType="numeric">
        {quantity}
      </TextInput> */}
      
      {/* Increment quantity button*/}
      {/* <Pressable>
        <Text
          onPress={() => incrementQuantity(id)}
          style={{ fontWeight: "bold", fontSize: 30, marginRight: 70 }}
        >
          {">"}
        </Text>
      </Pressable> */}

      <Pressable style={styles.remove} >
            <Text style={{color: 'white', fontSize: 19, fontWeight:'bold'}}>Add to Cart</Text>
          </Pressable>
    </View>
  </View>
);

const renderItem = ({ id, item, price, unitPrice, stock, quantity }) => (
  <>
    <Item
      id={item.id}
      title={item.title}
      price={item.price}
      unitPrice={item.unitPrice}
      stock={item.stock}
      quantity={item.quantity}
      inCart={item.inCart}
    />
  </>
);

// For future functionality of decrementing the quantity of an item to add to cart.
function decrementQuantity(itemID) {
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i].id == itemID && itemList[i].quantity > 1) {
      itemList[i].quantity--;
    }
  }
}

// For future functionality of incrementing the quantity of an item to add to cart.
function incrementQuantity(itemID) {
  for (let i = 0; i < itemList.length; i++) {
    if (itemList[i].id == itemID && itemList[i].quantity < 10) {
      itemList[i].quantity++;
    }
  }
}

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    // Set up default state for search bar input
    this.state = {
      settingsOrLogIn: "Settings",
      input: "",
      location: "01400376",
      filters: {
        selectedCountries: [],
        inStock: false,
        onSale: false,
        favorited: false,
      },
      allAvailableCountries: [],   // The countries of origin of all products currently in results
      sort: null,
      isSortMenuOpen: false,
      isFilterMenuOpen: false,
      isFilterCountryMenuOpen: false,
      latestResults: [],
      unfilteredResults: [],      // A copy of the latest results in case filters are cleared (saves)
    };
  }

  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn")
    });
  }

  componentDidMount() {
    this.updateNavBarText();
  }

  /* Filtering Functions */
  // Given a list of product objects, returns an alphabetically sorted list of obtained countries of origin with no duplicates.
  countriesFromProducts = (productList) => {
    if(productList.length == 0) return [];      // If there are no products, then there's no need to look through them

    let countries = []
    productList.forEach((product) => {     
      let currentCountry = product.countryOrigin
      if(countries.indexOf(currentCountry) == -1) countries.push(currentCountry)  // Add country to list if not present already
    })
    countries.sort((c1,c2) => c1.localeCompare(c2))   // Sort the list of countries

    let countryObjects = []
    countries.forEach((country) => {    // MultipleSelectList requires this particular structure of object
      countryObjects.push({key: country, value: country})
    }) 
    return countryObjects
  }

  // Updates the list of selectedCountries in the filters property of the class state when the selected countries change.
  onSelectedItemsChange = (countries) => {
    this.setState((prevState) => {
      let filters = {...prevState.filters}    // Copy current filters applied
      filters.selectedCountries = countries  // Update with current selected countries
      return {filters};
    })
  }

  // Filters the current results by the selected countries, returning the filtered results.
  filterResultsByCountry = () => {
    let filteredResults = []
    this.state.latestResults.forEach((product) => {
      // If the product originates from one of the countries in the selected countries list, keep it
      if(this.state.filters.selectedCountries.indexOf(product.countryOrigin) > -1) filteredResults.push(product)
    })
    return filteredResults
  }

  // Filters the current results by whether they're in stock, returning the filtered results.
  filterResultsByStock = () => {
    let filteredResults = []
    this.state.latestResults.forEach((product) => {
      // If the product has a stock that's not out of stock or unavailable, keep it
      if(product.stock != "N/A" && product.stock != "Temp. Out") filteredResults.push(product)
    })
    return filteredResults
  }


  /* Sorting Functions */
  // Input: Two product objects. Returns an integer based on lowest price comparison (price ascending).
  sortPriceAsc(p1, p2) {
    return p1.price - p2.price;   // Negative value means p1 is cheaper. Positive means p2 is cheaper. 0 means equal price.
  }

  // Input: Two product objects. Returns an integer based on highest price comparison (price descending).
  sortPriceDesc(p1, p2) {
    return p2.price - p1.price;   // Negative value means p2 is cheaper. Positive means p1 is cheaper. 0 means equal price.
  }

  // Input: Two product objects. Returns an integer based on an alphabetical comparison by product name.
  sortAlpha(p1, p2) {
    const p1Name = p1.title.toUpperCase();
    const p2Name = p2.title.toUpperCase();
    return p1Name.localeCompare(p2Name);   // LocalCompare handles accented characters among other non-ASCII ones
  }

  // Input: Two product objects. Returns an integer based on a reverse alphabetical comparison by product name.
  sortAlphaReverse(p1, p2) {
    const p1Name = p1.title.toUpperCase();
    const p2Name = p2.title.toUpperCase();
    return p2Name.localeCompare(p1Name);   // LocalCompare handles accented characters among other non-ASCII ones
  }

  // Input: Two product objects. Returns an integer based on unit price ascending (whichever has the lowest unit price).
  sortUnitPrice(p1, p2) {
    return p1.unitPrice - p2.unitPrice;   // Negative value means p1 is cheaper. Positive means p2 is cheaper. 0 means equal price.
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        {/* Search Header */}
        <View style={{ marginHorizontal: 15 }}>
          <Text style={globalStyle.headerText} testID="Test_SearchTextHeader">Search</Text>

          {/* Row 1: Text Input and Search Button */}
          <View style={globalStyle.headerButtonRow}>
            {/* Search Bar Input */}
            <TextInput
              style={[
                globalStyle.inputContainer,
                {
                  flex: 3.2,
                  marginRight: 10,
                  fontWeight: "bold",
                  fontSize: 18,
                },
              ]}
              placeholder="I'm looking for..."
              placeholderTextColor={"#000000"}
              onChangeText={(newInput) =>
                this.setState({ input: newInput.trim() })
              }
              testID="Test_SearchBar"
            />
            {/* Search Button */}
            <Pressable
              style={styles.searchButtonStyle}
              onPressIn={() => {
                searchProducts(this.state);
                if (itemList == null) {
                  showAlert(
                    "No Products Found",
                    "Try using different keywords and/or a different set of filters."
                  );
                }
                this.setState({ latestResults: itemList, unfilteredResults: itemList })
                console.log(itemList)
                console.log(this.state.latestResults)
              }}
              // Set new results and update the list of countries those results are
              onPressOut={() => {
                this.setState({             // Reset filters upon new search
                  filters : {
                    selectedCountries: [],
                    inStock: false,
                    onSale: false,
                    favorited: false,
                  }
                })
                this.setState({ 
                  latestResults: itemList, 
                  allAvailableCountries: 
                    [{key: 'Countries', 
                      value: 'Countries', 
                      children: this.countriesFromProducts(itemList)
                    }],
                })
              }}
              testID="Test_SearchButton"
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>

          {/* Row 2: Filter, Sort, and Scan Buttons (TODO: Add functionality and relevant popup menus) */}
          <View
            style={[
              globalStyle.headerButtonRow,
              { marginVertical: 10, marginHorizontal: -5 },
            ]}
          >
            {/* Filter Button */}
            <Pressable
              style={globalStyle.headerButtonStyle}
              testID="Test_FilterButton"
              onPress={() => {this.setState({ isFilterMenuOpen : !this.state.isSortMenuOpen }); {/* Toggle sort submenu on press */} }}
            >
              <Text style={globalStyle.headerButtonText}>Filter</Text>
            </Pressable>
            <Modal
              visible={this.state.isFilterMenuOpen}
              animationType="fade"
              transparent={true}
              testID="Test_FilterSubmenuModal"
              style={{flex: 0}}
            >
              {/* Handles closing menu when interacting outside of the submenu; also houses subbuttons */}
              <TouchableOpacity
                  style={{flex:1, alignItems: "center", justifyContent: "center"}}
                  onPress={() => { this.setState({ isFilterMenuOpen : false})}}
                  testID="Test_FilterSubmenuOpacity"
              >
                <View style={styles.sortSubmenuDesign} testID="Test_FilterSubmenu">
                  {/* Filtering Option Buttons */}
                  <View style={[globalStyle.headerButtonText,{flex: 0, flexWrap: "wrap", flexDirection: "row"}]}>
                    {/* Filter by Country of Origin */}
                    <Pressable 
                      style={styles.sortSubmenuButton}
                      testID="Test_FilterCountryButton"
                      onPress={() => {this.setState({ isFilterCountryMenuOpen : !this.state.isFilterCountryMenuOpen }); {/* Toggle sort submenu on press */} }}
                    >
                      <Text style={styles.buttonText}>Country</Text>
                      <Modal
                        visible={this.state.isFilterCountryMenuOpen}
                        animationType="fade"
                        transparent={true}
                        testID="Test_FilterCountrySubmenuModal"
                        style={{flex: 0}}
                      >
                        <TouchableOpacity
                          style={{flex:1, alignItems: "center", justifyContent: "center"}}
                          onPress={() => { this.setState({ isFilterCountryMenuOpen : false})}}
                          testID="Test_FilterCountrySubmenuOpacity"
                        >
                          <View style={[styles.sortSubmenuDesign, {height: "50%"}]} testID="Test_FilterCountrySubmenu">
                            <SectionedMultiSelect 
                              items={this.state.allAvailableCountries}
                              IconRenderer={Icon}
                              uniqueKey="key"
                              subKey="children"
                              displayKey="value"
                              selectText="Pick countries by tapping..."
                              showDropDowns={true}
                              expandDropDowns={true}
                              showCancelButton={true}
                              showChips={false}
                              alwaysShowSelectText={true}
                              readOnlyHeadings={true}
                              onSelectedItemsChange={this.onSelectedItemsChange}
                              selectedItems={this.state.filters.selectedCountries}
                              onConfirm={() => {
                                itemList = this.filterResultsByCountry()      // Filter results on confirmation by selected countries
                                this.setState({ latestResults : itemList })
                              }}
                              onCancel={() => {this.setState({latestResults : this.state.unfilteredResults})}}   // Reset results to last unfiltered copy
                              searchPlaceholderText="Search countries of origin..."
                              modalWithTouchable={true}
                              styles={{
                                modalWrapper: {
                                  backgroundColor: 'none',
                                  animationType: 'fade',
                                  flex: 1,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                },
                                backdrop: {
                                  justifyContent: 'center',
                                },
                                container: {
                                  borderColor: "#000000",
                                  borderWidth: 10,
                                  height: "50%",
                                  width: "90%",
                                  flex: 0,
                                  alignSelf: 'center'
                                }
                              }}
                              testID="Test_CountrySelectMenu"
                            />
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </Pressable>

                    {/* Filter by Whether it's in Stock */}
                    <Pressable
                      style={styles.sortSubmenuButton}
                      testID="Test_FilterInStockButton"
                      onPress={
                        () => { 
                          itemList = this.filterResultsByStock()
                          this.setState({ latestResults: itemList }) 
                          this.setState((prevState) => {
                            let filters = {...prevState.filters}    // Copy current filters applied
                            filters.inStock = true  // Update with current filter
                            return {filters};
                          })
                        }
                      }
                    >
                      <Text style={styles.buttonText}>In Stock</Text>
                    </Pressable>

                    {/* Filter by Whether it's on sale */}
                    <Pressable
                      style={styles.sortSubmenuButton}
                      testID="Test_FilterOnSaleButton"
                      onPress={
                        () => { 
                         // Placeholder
                        }
                      }
                    >
                      <Text style={styles.buttonText}>On Sale</Text>
                    </Pressable>

                    {/* Filter by Favorited */}
                    <Pressable
                      style={styles.sortSubmenuButton}
                      testID="Test_FilterByFavoritedButton"
                      onPress={
                        () => { 
                         // Placeholder
                        }
                      }
                    >
                      <Text style={styles.buttonText}>Favorited</Text>
                    </Pressable>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Sort Button and Sort Submenu */}
            <Pressable 
              style={globalStyle.headerButtonStyle}
              testID="Test_SortButton"
              onPress={() => {this.setState({ isSortMenuOpen : !this.state.isSortMenuOpen }); {/* Toggle sort submenu on press */} }} 
            >
              <Text style={globalStyle.headerButtonText}>Sort</Text>
            </Pressable>
            <Modal
              visible={this.state.isSortMenuOpen}
              animationType="fade"
              transparent={true}
              testID="Test_SortSubmenu"
              style={{flex: 0}}
            >
              {/* Handles closing menu when interacting outside of the submenu; also houses subbuttons */}
              <TouchableOpacity
                  style={{flex:1, alignItems: "center", justifyContent: "center"}}
                  onPress={() => { this.setState({ isSortMenuOpen : false})}}
                  testID="Test_SortSubmenuOpacity"
              >
                <View style={styles.sortSubmenuDesign} testID="Test_SortSubmenu">
                  {/* Sorting Option Buttons */}
                  <View style={[globalStyle.headerButtonText,{flex: 0, flexWrap: "wrap", flexDirection: "row"}]}>
                    {/* Sort Lowest Price */}
                    <Pressable 
                      style={styles.sortSubmenuButton}
                      testID="Test_SortLowestPriceButton"
                      onPress={
                        () => { 
                          this.setState({ 
                            sort: "Lowest Price", 
                            latestResults: itemList.sort(this.sortPriceAsc),
                            unfilteredResults: itemList.sort(this.sortPriceAsc)
                          }) 
                        }
                      }
                    >
                      <Text style={styles.buttonText}>Lowest Price</Text>
                    </Pressable>

                    {/* Sort Highest Price */}
                    <Pressable
                      style={styles.sortSubmenuButton}
                      testID="Test_SortHighestPriceButton"
                      onPress={
                        () => { 
                          this.setState({ 
                            sort: "Highest Price",
                            latestResults: itemList.sort(this.sortPriceDesc),
                            unfilteredResults: itemList.sort(this.sortPriceDesc),
                          }) 
                        }
                      }
                    >
                      <Text style={styles.buttonText}>Highest Price</Text>
                    </Pressable>

                    {/* Sort A-Z (Alphabetically) */}
                    <Pressable
                      style={styles.sortSubmenuButton}
                      testID="Test_SortA-ZButton"
                      onPress={
                        () => { 
                          this.setState({ 
                            sort: "A-Z", 
                            latestResults: itemList.sort(this.sortAlpha),
                            unfilteredResults: itemList.sort(this.sortAlpha)
                          }) 
                        }
                      }
                    >
                      <Text style={styles.buttonText}>A-Z</Text>
                    </Pressable>

                    {/* Sort Z-A (Reverse Alphabetically) */}
                    <Pressable
                      style={styles.sortSubmenuButton}
                      testID="Test_SortZ-AButton"
                      onPress={
                        () => { 
                          this.setState({ 
                            sort: "Z-A", 
                            latestResults: itemList.sort(this.sortAlphaReverse),
                            unfilteredResults: itemList.sort(this.sortAlphaReverse)
                          }) 
                        }
                      }
                    >
                      <Text style={styles.buttonText}>Z-A</Text>
                    </Pressable>

                     {/* Sort Unit Price */}
                     <Pressable
                      style={[styles.sortSubmenuButton]}
                      testID="Test_SortUnitPriceButton"
                      onPress={
                        () => { 
                          this.setState({ 
                            sort: "UnitPrice", 
                            latestResults: itemList.sort(this.sortUnitPrice),
                            unfilteredResults: itemList.sort(this.sortUnitPrice)
                          }) 
                        }
                      }
                    >
                      <Text style={styles.buttonText}>Unit Price</Text>
                    </Pressable>

                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
            {/* Scan Button */}
            <Pressable style={globalStyle.headerButtonStyle} testID="Test_ScanButton">
              <Text style={globalStyle.headerButtonText}>Scan</Text>
            </Pressable>
          </View>
        </View>

        {/* Horizontal line separator */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              height: 1,
              borderColor: "black",
              borderBottomWidth: 10,
            }}
          />
        </View>

        {/* Horizontal line separator's drop shadow */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              height: 1,
              borderColor: "#cccccc",
              borderBottomWidth: 3,
            }}
          />
        </View>

        {/* Holds all results of searched items. TODO: make flatlist view shorter. */}
        <FlatList
          data={itemList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={this.state}
          testID="Test_SearchResults"
        />

        <View style={globalStyle.container}>
          <View style={globalStyle.buttons} testID="Test_NavigationBar">
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
              <Text>{this.state.settingsOrLogIn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
{/* Search Functions */}
// Returns true if the input string meets the API's filter.term paramater requirements.
function validInput(inputText) {
  // Search terms limited to max of 8 words (separated by spaces). Must also be >= 3 characters
  if (inputText.length < 3) return false;

  const terms = inputText.split(/\s+/); // Split inputText into separate terms using regex
  if (terms.length > 8) return false;

  return true;
}

// Input: class state. Returns JSON response if the API call is successful, null otherwise. TO-DO: Filter/sort results after fetch
async function searchProducts(state) {
  // Confirm input is valid before querying
  if (!validInput(state.input)) {
    showAlert(
      "Invalid Input",
      "Input must be 3 characters or more, and have at most 8 words."
    );
    return null;
  }

  // Build query
  let callURL = `https://api.kroger.com/v1/products?filter.term=${state.input}&filter.locationId=${state.location}&filter.fulfillment=dth`;

  // Fetch results
  let options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  let response = await fetch(callURL, options);
  // Variable to hold the response from the Kroger API in a string
  let responseJSON = await response.json();

  // If failed request, Alert the user and return null
  if (!response.ok) {
    let errorHeader =
      "Error " + response.status.toString() + ": " + responseJSON.code;
    showAlert(errorHeader, responseJSON.errors.reason);
    return null;
  }

  // Iterates through responseJSON and stores items into itemList
  for (let i = 0; i < responseJSON.data.length; i++) {
    // Skip adding item if price accont be parsed.
    if (responseJSON.data[i].items[0].price.promo === 0) {
      continue;
    }
    // Add to array by index
    itemList[itemIndex] = {
      id: responseJSON.data[i].productId,
      title: responseJSON.data[i].description,
      // TODO: figure out how to better parse JSON array so that price is not 0
      price: responseJSON.data[i].items[0].price.promo,
      // TODO: remove placeholder
      unitPrice: 0,
      // TODO: remove placeholder
      stock: null,
      quantity: 1,
      inCart: false,
      countryOrigin: responseJSON.data[i].countryOrigin,
    };

    // The stockLevel property is omitted when an item is out of stock, so catch for that case
    try {
      const stockLevel = responseJSON.data[i].items[0].inventory.stockLevel
      if(stockLevel == "TEMPORARILY_OUT_OF_STOCK") {
        itemList[itemIndex].stock = "Temp. Out"
      }
      else {
        itemList[itemIndex].stock = stockLevel[0] + stockLevel.slice(1).toLocaleLowerCase()   // Proper capitalization, not ALL CAPS
      }
    } catch(missingPropError) {         // If stockLevel is unavailable, say so
      itemList[itemIndex].stock = "N/A"
    }
    
    itemIndex++;
  }
  itemIndex = 0;

  return itemList;
}

// Input: Strings for the alert's title and alert's message. Displays a simple, cancellable alert with the given title and message
function showAlert(alertTitle, alertMsg) {
  Alert.alert(alertTitle, alertMsg, [{ text: "OK" }], { cancelable: true });
}


const styles = StyleSheet.create({
  searchButtonStyle: {
    flex: 1,
    backgroundColor: "black",
    borderRadius: 20,
    paddingVertical: 17,
    paddingHorizontal: 10,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  price: {
    backgroundColor: "black",
    color: "white",
    fontSize: 25,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "45",
    marginTop: 25,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  },
  remove: {
    backgroundColor: "black",
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginRight: 15,
  },
  sortSubmenuDesign: {
    alignContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 10,
    justifyContent: "center",
    height: "25%",
    width: "90%",
    flexWrap: "wrap",
  },
  sortSubmenuButton: {
    backgroundColor: "black",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 8,
    flex: 1,
    flexBasis: "33%",
  }
});
