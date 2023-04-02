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
  Modal,
  ToastAndroid,
  ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import globalStyle from "../globalStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PAGE_ID } from "../utils/constants.js";

// Holds data of all items
var itemList = [];
// Json file that holds respose query for produce. Is shown automatically without the user searching. 
const produce = require("./produce.json");
// Used for indexing itemList array when items are added to it.
var itemIndex = 0;
// Used for trimming the itemList to the exact number of elements needed to display the results
var priorItemListLength = 0;
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
    countryOrigin: produce.data[i].countryOrigin,
    category: produce.data[i].categories
  };
  itemIndex++;
}
// Reset to 0 so this var can be used again in adding different items to itemList when user searches.
itemIndex = 0;

// Template view for each item in flatlist.
const Item = ({ id, title, price, unitPrice, stock, quantity, image }) => (
  <Pressable onPress={() => {AsyncStorage.setItem("productID",id)
                            AsyncStorage.setItem("productName",title)
                            AsyncStorage.setItem("productPrice",`${price}`)
                            AsyncStorage.setItem("productUnitPrice",`${unitPrice}`)
                            AsyncStorage.setItem("productStock",stock)
                            AsyncStorage.setItem("productImage",image)
                            AsyncStorage.setItem("isSelectedItem",'true')
                            ToastAndroid.show(`${title} selected press details to see more info`, 1000);
  }}>
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
          <Text style={{ color: 'white', fontSize: 19, fontWeight: 'bold' }} onPress={() => addToCart(id)}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  </Pressable>
);

const renderItem = ({ id, item, price, unitPrice, stock, quantity }) => (
  <>
    <Item
      id={item.id}
      title={item.title}
      price={item.price}
      // Display unitPrice only if it's not arbitrary or null or undefined
      unitPrice={item.unitPrice == Number.MAX_SAFE_INTEGER || item.unitPrice == null ? " " : `$${item.unitPrice} per Oz`}
      stock={item.stock}
      quantity={item.quantity}
      inCart={item.inCart}
      image={item.image}
    />
  </>
);

addToCart = async (itemID) => {
  for (let i = 0; i < itemList.length; i++) { // loop through item list array
    // if array is not empty and has item(s) already in there
    if (itemList[i].id == itemID) {
      let itemArray = await AsyncStorage.getItem("product")
      itemArray = JSON.parse(itemArray)
      if (itemArray) {
        let array = itemArray
        // checks to make sure you can't add the same item twice (checks by id)
        if (!(array.filter(item => item.id === itemList[i].id).length > 0)) { // if id is not in array, then push
          array.push(itemList[i])
        }

        try {
          await AsyncStorage.setItem("product", JSON.stringify(array))
        } catch (err) {
          console.log(err)
        }
        console.log(array)
      } else { // if array is empty, adds the first item to array
        let array = []
        if (itemList[i].id == itemID) {
          array.push(itemList[i])

          try {
            await AsyncStorage.setItem("product", JSON.stringify(array))
          } catch {
            console.log(err)
          }
        }
        console.log(array)
      }
    }
  }
}

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

/*** SearchScreen class; handles all but the direct API querying and low-level item representation/management. ***/
export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    // Set up default state for search bar input
    this.state = {
      settingsOrLogIn: "",
      input: "",
      location: " ",
      filters: {
        selectedCountries: [],
        inStock: false,
        onSale: false,
        selectedCategories: [],
      },
      allAvailableCountries: [],   // The countries of origin of all products currently in results
      allAvailableCategories: [],  // The product categories of all products currently in results
      sort: null,                  // The current sort applied to the results (null if no sort is applied)
      isSortMenuOpen: false,
      isFilterMenuOpen: false,
      isFilterCountryMenuOpen: false,
      isFilterCategoryMenuOpen: false,
      changePage:"false",
      latestResults: [],
      unfilteredResults: [],      // A copy of the latest results in case filters are cleared (saves)
    };
  }

  /**
   * Function to change the text on the button with a gear on the navbar.
   * Text can either be "Settings" or "Log In".
   */
  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn")
    });
  }

  async productScreen() {
    this.setState({
      changePage: await AsyncStorage.getItem("isSelectedItem")
    });
  }

  async updateCurrentLocationState() {
    this.setState({
      location: `${await AsyncStorage.getItem("locationID")}`,
    });
  }

  async changingPage() {
    if(this.changePage=="true")
      this.props.pageChange(PAGE_ID.product);
  }

  componentDidMount() {
    this.updateNavBarText();
    this.updateCurrentLocationState();
    this.productScreen();
    this.changingPage();
  }


  moving = () => {
    this.props.pageChange(PAGE_ID.product);
  }

  /*** Filtering Functions ***/
  /* Country Functions */
  // Given a list of product objects, returns an alphabetically sorted list of obtained countries of origin with no duplicates.
  countriesFromProducts = (productList) => {
    if (productList == null) return [];          // If the list of products is null, then there's no need to look through them
    if (productList.length == 0) return [];      // If there are no products, then there's no need to look through them

    let countries = []
    productList.forEach((product) => {
      let currentCountry = product.countryOrigin
      if (countries.indexOf(currentCountry) == -1) countries.push(currentCountry)  // Add country to list if not present already
    })
    countries.sort((c1, c2) => c1.localeCompare(c2))   // Sort the list of countries

    let countryObjects = []
    countries.forEach((country) => {    // MultipleSelectList requires this particular structure of object
      countryObjects.push({ key: country, value: country })
    })
    return countryObjects
  }

  // Updates the list of selectedCountries in the filters property of the class state when the selected countries change.
  onSelectedItemsChangeCountries = (countries) => {
    this.setState((prevState) => {
      let filters = { ...prevState.filters }    // Copy current filters applied
      filters.selectedCountries = countries  // Update with current selected countries
      return { filters };
    })
  }

  // Filters the current results by the selected countries, returning the filtered results.
  filterResultsByCountry = () => {
    let filteredResults = []
    this.state.unfilteredResults.forEach((product) => {
      // If the product originates from one of the countries in the selected countries list, keep it
      if (this.state.filters.selectedCountries.indexOf(product.countryOrigin) > -1) filteredResults.push(product)
    })
    return filteredResults
  }

  /* In Stock Functions */
  // Filters the current results by whether they're in stock, returning the filtered results.
  filterResultsByStock = () => {
    let filteredResults = []
    this.state.unfilteredResults.forEach((product) => {
      // If the product has a stock that's not out of stock or unavailable, keep it
      if (product.stock != "N/A" && product.stock != "Temp. Out") filteredResults.push(product)
    })
    return filteredResults
  }

  /* On Sale Functions */
  // Filters the current results by whether they're on sale, returning the filtered results.
  filterResultsBySale = () => {
    let filteredResults = []
    this.state.unfilteredResults.forEach((product) => {
      // If the product's promo price is less than it's standard price, keep it
      if (product.price < product.standardPrice) filteredResults.push(product)
    })
    return filteredResults
  }

  /* Category Functions */
  // Given a list of product objects, returns an alphabetically sorted list of obtained categories of origin with no duplicates.
  categoriesFromProducts = (productList) => {
    if (productList == null) return [];          // If the list of products is null, then there's no need to look through them
    if (productList.length == 0) return [];      // If there are no products, then there's no need to look through them

    let categories = []
    productList.forEach((product) => {
      let currentCategoryList = product.category    // Note that every product can have multiple categories, so the data type is an array
      if (typeof currentCategoryList == 'undefined') return   // Skip any products with invalid categories (typically if they don't have an array)
      currentCategoryList.forEach((category) => {
        if (categories.indexOf(category) == -1) categories.push(category)  // Add category to list if not present already
      })
    })
    categories.sort((c1, c2) => c1.localeCompare(c2))   // Sort the list of categories

    let categoryObjects = []
    categories.forEach((category) => {    // MultipleSelectList requires this particular structure of object
      categoryObjects.push({ key: category, value: category })
    })
    return categoryObjects
  }

  // Updates the list of selectedCategories in the filters property of the class state when the selected categories change.
  onSelectedItemsChangeCategories = (categories) => {
    this.setState((prevState) => {
      let filters = { ...prevState.filters }    // Copy current filters applied
      filters.selectedCategories = categories  // Update with current selected categories
      return { filters };
    })
  }

  // Filters the current results by the selected product categories, returning the filtered results.
  filterResultsByCategory = () => {
    let filteredResults = []
    this.state.unfilteredResults.forEach((product) => {
      // If the product is of one of the categories in the selected categories list, keep it
      let productCategories = this.removeDuplicates(product.category)
      productCategories.forEach((category) => {
        if (this.state.filters.selectedCategories.indexOf(category) > -1) filteredResults.push(product)
      })
    })
    return filteredResults
  }

  /* General Filter Functions */
  // Updates the results with the appropriate filters applied according to the current state
  updateFilteredResults = (productList) => {
    let filteredResults = productList

    // If the countries filter is applied
    if (this.state.filters.selectedCountries.length != 0) {
      filteredResults.forEach((product) => {
        if (this.state.filters.selectedCountries.indexOf(product.countryOrigin) > -1 && filteredResults.indexOf(product) < 0) filteredResults.push(product)
      })
    }

    // If the in stock filter is applied
    if (this.state.filters.inStock) {
      filteredResults.forEach((product) => {
        // If the product has a stock that's not out of stock or unavailable, keep it
        if (product.stock != "N/A" && product.stock != "Temp. Out" && filteredResults.indexOf(product) < 0) filteredResults.push(product)
      })
    }

    // If the on sale filter is applied
    if (this.state.filters.onSale) {
      filteredResults.forEach((product) => {
        // If the product's promo price is less than it's standard price, keep it
        if (product.price < product.standardPrice && filteredResults.indexOf(product) < 0) filteredResults.push(product)
      })
    }

    // If the product category filter is applied
    if (this.state.filters.selectedCategories.length != 0) {
      filteredResults.forEach((product) => {
        if (this.state.filters.selectedCategories.indexOf(product.category) > -1 && filteredResults.indexOf(product) < 0) filteredResults.push(product)
      })
    }

    // Apply the sort (if any) to the results before returning
    let sortType = this.state.sort
    if (sortType == 'Lowest Price') filteredResults = filteredResults.sort(this.sortPriceAsc)
    else if (sortType == 'Highest Price') filteredResults = filteredResults.sort(this.sortPriceDesc)
    else if (sortType == 'A-Z') filteredResults = filteredResults.sort(this.sortAlpha)
    else if (sortType == 'Z-A') filteredResults = filteredResults.sort(this.sortAlphaReverse)
    else if (sortType == 'Unit Price') filteredResults = filteredResults.sort(this.sortUnitPrice)

    return filteredResults      // Remove duplicate products if they arise
  }

  // Removes duplicate values in an array, returning the trimmed array.
  removeDuplicates(arr) {
    arr = arr.filter((item, index, inputArr) => {
      return inputArr.indexOf(item) == index
    })
    return arr
  }

  /*** Sorting Functions ***/
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

  // Input: List of products. Returns the same list of products except all null or undefined unit prices are set to an arbitrarily high value.
  updateUndefinedUPrice(productList) {
    productList.forEach((product) => {
      if (product.unitPrice == null) product.unitPrice = Number.MAX_SAFE_INTEGER
    })
    return productList
  }

  /*** Display Function ***/
  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        {/* Search Header */}
        <View style={{ marginHorizontal: 15 }}>
          <Text style={globalStyle.headerText} 
          testID="Test_SearchTextHeader" 
          accessibilityRole="header"
          >
            Search
          </Text>

          {/* Row 1: Text Input and Search Button */}
          <View style={globalStyle.headerButtonRow}>
            {/* Search Bar Input */}
            <TextInput
              style={[
                globalStyle.inputContainer,
                {
                  // flex: 3.2,
                  marginRight: 10,
                  fontWeight: "bold",
                  fontSize: 18,
                  maxWidth: "70%",
                  minWidth: "70%"
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
              onPressIn={async () => {
                itemList = await searchProducts(this.state);
                console.log("Item List:")
                console.log(itemList)
                if (itemList == null) {   // If itemList is null, alert the user and set it to an empty array before continuing
                  showAlert(
                    "No Products Found",
                    "Try using different keywords and/or a different set of filters."
                  );
                  itemList = []
                }
                this.setState({
                  latestResults: itemList,
                  unfilteredResults: itemList,
                  sort: null,                 // Reset applied sort 
                  allAvailableCountries:      // Populate list with all available countries to select
                    [{
                      key: 'Countries',
                      value: 'Countries',
                      children: this.countriesFromProducts(itemList)
                    }],
                  allAvailableCategories:     // Populate list with all available categories to select
                    [{
                      key: 'Categories',
                      value: 'Categories',
                      children: this.categoriesFromProducts(itemList)
                    }],
                })
              }}
              // Set new results and update the list of countries those results are
              onPressOut={() => {
                this.setState({             // Reset filters upon new search
                  filters: {
                    selectedCountries: [],
                    inStock: false,
                    onSale: false,
                    selectedCategories: [],
                  }
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
              onPress={() => { this.setState({ isFilterMenuOpen: !this.state.isSortMenuOpen }); {/* Toggle sort submenu on press */ } }}
            >
              <Text style={globalStyle.headerButtonText}>Filter</Text>
            </Pressable>
            <Modal
              visible={this.state.isFilterMenuOpen}
              animationType="fade"
              transparent={true}
              testID="Test_FilterSubmenuModal"
              style={{ flex: 0 }}
            >
              {/* Handles closing menu when interacting outside of the submenu; also houses subbuttons */}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                onPress={() => { this.setState({ isFilterMenuOpen: false }) }}
                testID="Test_FilterSubmenuOpacity"
              >
                <View style={styles.sortSubmenuDesign} testID="Test_FilterSubmenu">
                  {/* Filtering Option Buttons */}
                  <View style={[globalStyle.headerButtonText, { flex: 0, flexWrap: "wrap", flexDirection: "row" }]}>
                    {/* Filter by Country of Origin */}
                    <Pressable
                      // Change style depending on if the filter is applied
                      style={[styles.sortSubmenuButton, this.state.filters.selectedCountries.length > 0 ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
                      testID="Test_FilterCountryButton"
                      onPress={() => { this.setState({ isFilterCountryMenuOpen: !this.state.isFilterCountryMenuOpen }); {/* Toggle sort submenu on press */ } }}
                    >
                      <Text style={[styles.sortButtonText, this.state.filters.selectedCountries.length > 0 ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>Country</Text>
                      <Modal
                        visible={this.state.isFilterCountryMenuOpen}
                        animationType="fade"
                        transparent={true}
                        testID="Test_FilterCountrySubmenuModal"
                        style={{ flex: 0 }}
                      >
                        <TouchableOpacity
                          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                          onPress={() => { this.setState({ isFilterCountryMenuOpen: false }) }}
                          testID="Test_FilterCountrySubmenuOpacity"
                        >
                          <View style={[styles.sortSubmenuDesign, { height: "50%" }]} testID="Test_FilterCountrySubmenu">
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
                              onSelectedItemsChange={this.onSelectedItemsChangeCountries}
                              selectedItems={this.state.filters.selectedCountries}
                              onConfirm={() => {
                                // If no countries were selected but the filter was confirmed, just reset the filter and results
                                if (this.state.filters.selectedCountries.length == 0) {
                                  // Update results with the country filter not applied
                                  itemList = this.updateFilteredResults(this.state.unfilteredResults)
                                  this.setState({ latestResults: itemList })
                                }
                                // Otherwise apply the country filter as expected
                                else {
                                  itemList = this.filterResultsByCountry()      // Filter results on confirmation by selected countries
                                  this.setState({ latestResults: itemList })
                                }
                              }}
                              onCancel={() => {
                                // On cancel, ensure country filter is reset first before updating results
                                this.setState((prevState) => {
                                  let filters = { ...prevState.filters }    // Copy current filters applied
                                  filters.selectedCountries = []  // Reset selected countries
                                  return { filters };
                                })
                                // Update results without the country filter
                                itemList = this.updateFilteredResults(this.state.unfilteredResults)
                                this.setState({ latestResults: itemList })
                              }}
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
                      // Change style depending on if the filter is applied
                      style={[styles.sortSubmenuButton, this.state.filters.inStock ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
                      testID="Test_FilterInStockButton"
                      onPress={
                        () => {
                          // If filter is already applied, deactivate it and update the results to account for it
                          if (this.state.filters.inStock) {
                            this.setState((prevState) => {
                              let filters = { ...prevState.filters }    // Copy current filters applied
                              filters.inStock = false  // Reset the in stock filter
                              return { filters };
                            })

                            // Update results with the in stock filter not applied
                            itemList = this.updateFilteredResults(this.state.unfilteredResults)
                            this.setState({ latestResults: itemList })
                          }
                          // Else if the filter is being applied
                          else {
                            // Update the results with the filter applied
                            itemList = this.filterResultsByStock()
                            this.setState({ latestResults: itemList })

                            // Update state to reflect that the in stock filter is active
                            this.setState((prevState) => {
                              let filters = { ...prevState.filters }    // Copy current filters applied
                              filters.inStock = true  // Update with current filter
                              return { filters };
                            })
                          }
                        }
                      }
                    >
                      <Text style={[styles.sortButtonText, this.state.filters.inStock ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>In Stock</Text>
                    </Pressable>

                    {/* Filter by Whether it's on sale */}
                    <Pressable
                      // Change style depending on if the filter is applied
                      style={[styles.sortSubmenuButton, this.state.filters.onSale ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}

                      testID="Test_FilterOnSaleButton"
                      onPress={
                        () => {
                          // If filter is already applied, deactivate it and update the results to account for it
                          if (this.state.filters.onSale) {
                            this.setState((prevState) => {
                              let filters = { ...prevState.filters }    // Copy current filters applied
                              filters.onSale = false  // Reset the on sale filter
                              return { filters };
                            })

                            // Update results with the on sale filter not applied
                            itemList = this.updateFilteredResults(this.state.unfilteredResults)
                            this.setState({ latestResults: itemList })
                          }
                          // Else if the filter is being applied
                          else {
                            itemList = this.filterResultsBySale()
                            this.setState({ latestResults: itemList })
                            this.setState((prevState) => {
                              let filters = { ...prevState.filters }    // Copy current filters applied
                              filters.onSale = true  // Update with current filter
                              return { filters };
                            })
                          }
                        }
                      }
                    >
                      <Text style={[styles.sortButtonText, this.state.filters.onSale ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>On Sale</Text>
                    </Pressable>

                    {/* Filter by Product Category */}
                    <Pressable
                      // Change style depending on if the filter is applied
                      style={[styles.sortSubmenuButton, this.state.filters.selectedCategories.length > 0 ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
                      testID="Test_FilterCategoryButton"
                      onPress={() => { this.setState({ isFilterCategoryMenuOpen: !this.state.isFilterCategoryMenuOpen }); {/* Toggle submenu on press */ } }}
                    >
                      <Text style={[styles.sortButtonText, this.state.filters.selectedCategories.length > 0 ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>Category</Text>
                      <Modal
                        visible={this.state.isFilterCategoryMenuOpen}
                        animationType="fade"
                        transparent={true}
                        testID="Test_FilterCategorySubmenuModal"
                        style={{ flex: 0 }}
                      >
                        <TouchableOpacity
                          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                          onPress={() => { this.setState({ isFilterCategoryMenuOpen: false }) }}
                          testID="Test_FilterCategorySubmenuOpacity"
                        >
                          <View style={[styles.sortSubmenuDesign, { height: "50%" }]} testID="Test_FilterCategorySubmenu">
                            <SectionedMultiSelect
                              items={this.state.allAvailableCategories}
                              IconRenderer={Icon}
                              uniqueKey="key"
                              subKey="children"
                              displayKey="value"
                              selectText="Pick categories by tapping..."
                              showDropDowns={true}
                              expandDropDowns={true}
                              showCancelButton={true}
                              showChips={false}
                              alwaysShowSelectText={true}
                              readOnlyHeadings={true}
                              onSelectedItemsChange={this.onSelectedItemsChangeCategories}
                              selectedItems={this.state.filters.selectedCategories}
                              onConfirm={() => {
                                // If no categories were selected but the filter was confirmed, just reset the filter and results
                                if (this.state.filters.selectedCategories.length == 0) {
                                  // Update results with the country filter not applied
                                  itemList = this.updateFilteredResults(this.state.unfilteredResults)
                                  this.setState({ latestResults: itemList })
                                }
                                // Otherwise apply the country filter as expected
                                else {
                                  itemList = this.filterResultsByCategory()      // Filter results on confirmation by selected categories
                                  this.setState({ latestResults: itemList })
                                }
                              }}
                              onCancel={() => {
                                // On cancel, ensure category filter is reset first before updating results
                                this.setState((prevState) => {
                                  let filters = { ...prevState.filters }    // Copy current filters applied
                                  filters.selectedCategories = []  // Reset selected categories
                                  return { filters };
                                })
                                // Update results without the country filter
                                itemList = this.updateFilteredResults(this.state.unfilteredResults)
                                this.setState({ latestResults: itemList })
                              }}
                              searchPlaceholderText="Search product categories..."
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
                              testID="Test_CategorySelectMenu"
                            />
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </Pressable>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Sort Button and Sort Submenu */}
            <Pressable
              style={globalStyle.headerButtonStyle}
              testID="Test_SortButton"
              onPress={() => { this.setState({ isSortMenuOpen: !this.state.isSortMenuOpen }); {/* Toggle sort submenu on press */ } }}
            >
              <Text style={globalStyle.headerButtonText}>Sort</Text>
            </Pressable>
            <Modal
              visible={this.state.isSortMenuOpen}
              animationType="fade"
              transparent={true}
              testID="Test_SortSubmenu"
              style={{ flex: 0 }}
            >
              {/* Handles closing menu when interacting outside of the submenu; also houses subbuttons */}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                onPress={() => { this.setState({ isSortMenuOpen: false }) }}
                testID="Test_SortSubmenuOpacity"
              >
                <View style={styles.sortSubmenuDesign} testID="Test_SortSubmenu">
                  {/* Sorting Option Buttons */}
                  <View style={[globalStyle.headerButtonText, { flex: 1, flexWrap: "wrap", flexDirection: "row" }]}>
                    {/* Sort Lowest Price */}
                    <Pressable
                      style={[styles.sortSubmenuButton, this.state.sort == 'Lowest Price' ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
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
                      <Text style={[styles.buttonText, this.state.sort == 'Lowest Price' ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>Lowest Price</Text>
                    </Pressable>

                    {/* Sort Highest Price */}
                    <Pressable
                      style={[styles.sortSubmenuButton, this.state.sort == 'Highest Price' ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
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
                      <Text style={[styles.buttonText, this.state.sort == 'Highest Price' ? styles.sortButtonTextActive : styles.sortButtonTextDefault, { fontSize: 19 }]}>Highest Price</Text>
                    </Pressable>

                    {/* Sort A-Z (Alphabetically) */}
                    <Pressable
                      style={[styles.sortSubmenuButton, this.state.sort == 'A-Z' ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
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
                      <Text style={[styles.buttonText, this.state.sort == 'A-Z' ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>A-Z</Text>
                    </Pressable>

                    {/* Sort Z-A (Reverse Alphabetically) */}
                    <Pressable
                      style={[styles.sortSubmenuButton, this.state.sort == 'Z-A' ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
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
                      <Text style={[styles.buttonText, this.state.sort == 'Z-A' ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>Z-A</Text>
                    </Pressable>

                    {/* Sort Unit Price */}
                    <Pressable
                      style={[styles.sortSubmenuButton, this.state.sort == 'Unit Price' ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
                      testID="Test_SortUnitPriceButton"
                      onPress={
                        () => {
                          // Update null and undefined unit prices to an arbitrary max value before sorting to put those products at the end of the sorting.
                          itemList = this.updateUndefinedUPrice(itemList)
                          this.setState({
                            sort: "Unit Price",
                            unfilteredResults: itemList.sort(this.sortUnitPrice),
                            latestResults: itemList.sort(this.sortUnitPrice)
                          })
                        }
                      }
                    >
                      <Text style={[styles.buttonText, this.state.sort == 'Unit Price' ? styles.sortButtonTextActive : styles.sortButtonTextDefault]}>Unit Price</Text>
                    </Pressable>

                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
            {/* Scan Button */}
            <Pressable style={globalStyle.headerButtonStyle} disabled={this.state.StoreID=="" ? true: false} onPress={() => this.props.pageChange(PAGE_ID.product)}testID="Test_ScanButton">
              <Text style={globalStyle.headerButtonText}>Details</Text>
            </Pressable>
          </View>
        </View>

        {/* This is the shadow of the horizontal line. The translate Y value comes from 
        the marginTop value and borderBottomWidth value of the horizontal line added 
        together, plus the shadow height as well. The total of this value has 0.1 subtracted
        from it so the shadow overlaps slightly with the black bar so that there isn't
        a thin white line in the middle. */}
        <View style={{ 
          height: 5,
          position: 'relative',
          transform: [{translateY: 14.9}],
          zIndex: 999
          }}
        >
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../assets/shadow.png")}
            imageStyle={{ resizeMode: "repeat" }}
          ></ImageBackground>
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

        {/* Holds all results of searched items. TODO: make flatlist view shorter. */}
        <FlatList
          data={itemList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={this.state}
          testID="Test_SearchResults"
        />

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
              <Text style={{ textAlign: "center" }}>
                {this.state.settingsOrLogIn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

{/*** Search Functions ***/ }
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
  itemList=[]
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
  console.log(responseJSON)
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
      price: responseJSON.data[i].items[0].price.promo,
      standardPrice: responseJSON.data[i].items[0].price.regular,
      unitPrice: responseJSON.data[i].items[0].price.regularPerUnitEstimate,
      image: responseJSON.data[i].images[0].sizes[0].url,
      images: null,
      stock: null,  // Stock field is populated with the logic below
      quantity: 1,
      inCart: false,
      countryOrigin: responseJSON.data[i].countryOrigin,
      category: responseJSON.data[i].categories
    };

    // The stockLevel property is omitted when an item is out of stock, so catch for that case
    try {
      const stockLevel = responseJSON.data[i].items[0].inventory.stockLevel
      if (stockLevel == "TEMPORARILY_OUT_OF_STOCK") {
        itemList[itemIndex].stock = "Temp. Out"
      }
      else {
        itemList[itemIndex].stock = stockLevel[0] + stockLevel.slice(1).toLocaleLowerCase()   // Proper capitalization, not ALL CAPS
      }
    } catch (missingPropError) {         // If stockLevel is unavailable, say so
      itemList[itemIndex].stock = "N/A"
    }

    itemIndex++;
  }
  itemIndex = 0;

  // Trim excess results in cases where the prior search returned more items than the current search
  let numExcessItems = priorItemListLength - responseJSON.data.length
  if (numExcessItems > 0) itemList.splice(responseJSON.data.length - 1, numExcessItems)
  priorItemListLength = responseJSON.data.length

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
    maxWidth: 105,
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
    borderWidth: 10,
    justifyContent: "center",
    height: "25%",
    width: "90%",
    flexWrap: "wrap",
  },
  sortSubmenuButton: {
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 15,
    margin: 8,
    flex: 1,
    flexBasis: "33%",
    borderWidth: 5,
  },
  sortSubmenuButtonActive: {
    backgroundColor: "white",
    borderColor: "black",
  },
  sortSubmenuButtonDefault: {
    backgroundColor: "black",
  },
  sortButtonText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  sortButtonTextActive: {
    color: "black",
    padding: 1,
  },
  sortButtonTextDefault: {
    color: "white",
  },
});
