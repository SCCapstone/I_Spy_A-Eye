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

// Used for indexing itemList array when items are added to it.
var itemIndex = 0;

// Used for tracking the user specified (or default) number of products per page
var itemsPerPage = 10          // Default value of number of items per page
var pageNumIndex = 0           // Used for tracking the current page of items in the query
var totalQueryResults = 0;     // Used for tracking to total number of results from a query

var buttonOn=false;

// Template view for each item in flatlist.
const Item = ({ id, title, price, unitPrice, stock, quantity, image }) => (
  <Pressable onPress={() => {AsyncStorage.setItem("productID",id)
                            AsyncStorage.setItem("productName",title)
                            AsyncStorage.setItem("productPrice",`${price}`)
                            AsyncStorage.setItem("productUnitPrice",`${unitPrice}`)
                            AsyncStorage.setItem("productStock",stock)
                            AsyncStorage.setItem("productImage",image)
                            AsyncStorage.setItem("isSelectedItem",'true')
                            buttonOn=true;
                            console.log(buttonOn)
                            showAlert(`${title} selected press details to see more info`);
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
      <View style={{height: 27.5}}></View>
    </View>
  </Pressable>
);

const renderItem = ({ id, item, price, unitPrice, stock, quantity }) => (
  <>
    <Item
      id={item.id}
      title={item.title}
      // Display promo price (item.price) if available, otherwise display regular price (item.standardPrice)
      price={item.standardPrice}
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
  // loop through item list array
  for (let i = 0; i < itemList.length; i++) {
    // if array is not empty and has item(s) already in there
    if (itemList[i].id == itemID) {
      let itemArray = await AsyncStorage.getItem("product")
      itemArray = JSON.parse(itemArray)
      if (itemArray) {
        let array = itemArray
        // checks to make sure you can't add the same item twice (checks by id)
        // if id is not in array, then push
        if (!(array.filter(item => item.id === itemList[i].id).length > 0)) {
          // adds item to array
          array.push(itemList[i])
          // provides feedback to user when button is pressed
          ToastAndroid.show("Added to Cart!", 400);
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
          // adds item to array
          array.push(itemList[i])
          // provides feedback to user when button is pressed
          ToastAndroid.show("Added to Cart!", 400);

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
      input: "",                  // Input to the search bar
      priorInput: "",             // Last saved input to the search bar
      location: " ",
      filters: {
        selectedCountries: [],
        inStock: false,
        onSale: false,
        selectedCategories: [],
      },
      hasSearched:false,
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
      isNewSearch: true,          // Tracks whether the called search is a fresh search (true) or page navigation of the current search
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
    itemList=[];
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

  // Input: None. Removes currently selected countries/categories that aren't in the available choices for either.
  validateCountryCategoryChoices() {
    let validatedCountries = []
    let validatedCategories = []

    // If a selected country is still available, keep it.
    this.state.filters.selectedCountries.forEach((country) => {
      if(this.state.allAvailableCountries.indexOf(country) >= 0) validatedCountries.push(country) 
    })

    // If a selected category is still available, keep it.
    this.state.filters.selectedCategories.forEach((category) => {
      if(this.state.allAvailableCategories.indexOf(category) >= 0) validatedCategories.push(category) 
    })

    // Update state with the validated selections
    this.setState((prevState) => {
      let filters = {...prevState.filters}    // Copy current filters applied
      filters.selectedCountries = validatedCountries   // Update with validated countries
      filters.selectedCategories = validatedCategories  // Update with validated categories
      return {filters};
    })
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

  /*** Search Products ***/
  // Returns the locally stored number of items per page (integer), defaulting to 10 if an error occurs 
  // during storage or retrieval.
  async getItemsPerPage() {
    let localItemsPerPage
    try {
      localItemsPerPage = parseInt(await AsyncStorage.getItem('itemsPerPage'))
      if(isNaN(localItemsPerPage)) localItemsPerPage = 10
    } catch (err) {
      ToastAndroid.show("Couldn't Retrieve Items Per Page, Using Default", 400);
      localItemsPerPage = 10
    }
    return localItemsPerPage
  }
  
  // Input: class state. Returns array of items if the API call is successful, or an empty array otherwise.
  async searchProducts(searchState) {
    // Confirm input is valid before querying. Note that there's no need to validate priorInput
    // explicitly as all input must pass this check.
    if (!validInput(searchState.input) && searchState.isNewSearch) {
      showAlert(
        "Invalid Input",
        "Input must be 3 characters or more, and have at most 8 words."
      );
      return [];
    }
    this.hasSearched=true
    AsyncStorage.setItem("productID","")
    AsyncStorage.setItem("productName","")
    AsyncStorage.setItem("productPrice","")
    AsyncStorage.setItem("productUnitPrice","")
    AsyncStorage.setItem("productStock","")
    AsyncStorage.setItem("productImage","")

    // Get the number of items to display per page, based on user (default to 10 if error/not signed in)
    itemsPerPage = await this.getItemsPerPage()
    console.log("Items Per Page: " + itemsPerPage)

    // Determine query input based on whether it's a new search
    let queryInput = searchState.isNewSearch ? searchState.input : searchState.priorInput

    // Build query
    let callURL = `https://api.kroger.com/v1/products?filter.term=${queryInput}&filter.limit=${itemsPerPage}&filter.start=${(itemsPerPage*pageNumIndex)+1}
                    &filter.locationId=${searchState.location}&filter.fulfillment=dth`;

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

    // If failed request, Alert the user and return no results
    if (!response.ok) {
      let errorHeader =
        "Error " + response.status.toString() + ": " + responseJSON.code;
      showAlert(errorHeader, responseJSON.errors.reason);
      return [];
    }

    // Grab and update the total number of results; if failure, return early (Alert will be sent out outside of the method)
    try {
      totalQueryResults = responseJSON.meta.pagination.total
    }
    catch (err) {
      return [];
    }

    // Reset itemIndex and itemList for a fresh set of results (whether it's a new search or a page navigation)
    itemIndex = 0
    itemList = []

    // Iterates through responseJSON and stores items into itemList
    for (let i = 0; i < responseJSON.data.length; i++) {
      // Add to array by index
      itemList[itemIndex] = {
        id: responseJSON.data[i].productId,
        title: responseJSON.data[i].description,
        image: responseJSON.data[i].images[0].sizes[0].url,
        price: responseJSON.data[i].items[0].price.promo,
        standardPrice: responseJSON.data[i].items[0].price.regular,
        unitPrice: responseJSON.data[i].items[0].price.regularPerUnitEstimate,
        stock: null,  // Stock field is populated with the logic below
        quantity: 1,
        inCart: false,
        countryOrigin: responseJSON.data[i].countryOrigin,
        category: responseJSON.data[i].categories
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

      if(itemList[itemIndex].price==0||itemList[itemIndex].price==null)
        itemList[itemIndex].price=responseJSON.data[i].items[0].price.regular
      
      itemIndex++;
    }
    itemIndex = 0;

    return itemList;
  }

  /*** Result Page Navigation ***/

  // Input: Boolean. Output: If isForward is true, navigate forward one page in the results. Otherwise, navigate backwards one page.
  async navigateSearchResults(isForward) {
    let nextStartIndex;
    try {
      // Calculate new start index with the incremented page index. Account for bidirectional movement. +1 since products are indexed starting at 1 in the API.
      nextStartIndex = isForward ? ((pageNumIndex+1)*itemsPerPage)+1 : ((pageNumIndex-1)*itemsPerPage)+1
    } catch(e) {  // If isForward is null or some other unexpected value, stop early
      return;
    }

    // If the next start index exceeds the total number of results (or the API limit), alert the user and return early
    if(nextStartIndex > totalQueryResults || nextStartIndex > 1000) {
      showAlert(
        "Last Page Reached",
        "Sorry that you couldn't find your product. Try using a different set of keywords."
      );
      return;
    }

    // Else if the next start index goes 0 or below, alert the user and return early (items are indexed starting at 1 in the API)
    if(nextStartIndex <= 0) {
      showAlert(
        "No Prior Page",
        "It looks like you're already on the first page of results."
      );
      return;
    }
    

    // If valid, increment/decremet the pageNumIndex and then perform the next search query, adding the results to the next page
    pageNumIndex = isForward ? pageNumIndex + 1 : pageNumIndex - 1
    console.log("Total Items: " + totalQueryResults)
    itemList = this.updateFilteredResults(await this.searchProducts(this.state))  // Apply current filters/sort to new results

    // Update state with next page of results. Note that the sorting and filters do not need to be reset, unlike a new search.
    this.setState({ 
      latestResults: itemList, 
      unfilteredResults: itemList,
      allAvailableCountries:      // Populate list with all available countries to select
        [{key: 'Countries', 
          value: 'Countries', 
          children: this.countriesFromProducts(itemList)
        }],
      allAvailableCategories:     // Populate list with all available categories to select
      [{key: 'Categories', 
        value: 'Categories', 
        children: this.categoriesFromProducts(itemList)
      }],
    })

    // The previously selected Countries/Categories may not be available in the next page of results, so remove them
    this.validateCountryCategoryChoices()
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
              onPressIn={ () => {
                  // Update state before calling search (to signal that it's a new search)
                  this.setState({
                    isNewSearch: true,
                  },
                  async () => {
                    // Reset page number index to first page before searching
                    pageNumIndex = 0

                    itemList = await this.searchProducts(this.state)

                    //console.log("Item List:")
                    //console.log(itemList)
                    
                    // If itemList is empty, alert the user
                    if(itemList == []) {   
                      showAlert(
                        "No Products Found",
                        "Try using different keywords and/or a different set of filters."
                      );
                    }
                    // Else if itemList is null, then the input was invalid. Set itemList to an empty array and move on
                    if(itemList == null) itemList = []

                    // Update state with results, empty or otherwise
                    this.setState({
                      priorInput: this.state.input,
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
                  })
                }
              }
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
              onPress={() => { 
                // If there are no search results, Alert the user and prevent the sort menu from opening
                if(this.state.latestResults == null || this.state.latestResults.length == 0) {
                  showAlert(
                    "Empty Search Results",
                    "There are no current search results. Try finding some products first before filtering them."
                  );
                  return;
                }
                this.setState({ isFilterMenuOpen: !this.state.isSortMenuOpen }); {/* Toggle sort submenu on press */ } }}
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
                      onPress={() => { 
                        // Check if there are countries to filter through. If not, Alert the user and end early
                        if(this.state.allAvailableCountries[0].children.length == 0) {
                          showAlert(
                            "No Country Data",
                            "The current page of search results is either empty or has no country data to filter by. "
                          );
                          return;
                        }

                        // Toggle sort submenu on press
                        this.setState({ isFilterCountryMenuOpen: !this.state.isFilterCountryMenuOpen });  
                        }
                      }
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
                          // If there are no search results, Alert the user and stop early
                          if(itemList == null || itemList.length == 0) {
                            showAlert(
                              "Empty Search Results",
                              "There are no current search results. Try finding some products first before applying this filter."
                            );
                            return;
                          }

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
                          // If there are no search results, Alert the user and stop early
                          if(itemList == null || itemList.length == 0) {
                            showAlert(
                              "Empty Search Results",
                              "There are no current search results. Try finding some products first before applying this filter."
                            );
                            return;
                          }

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
                      onPress={() => { 
                         // Check if there are categories to filter through. If not, Alert the user and end early
                         if(this.state.allAvailableCategories[0].children.length == 0) {
                          showAlert(
                            "No Category Data",
                            "The current page of search results is either empty or has no category data to filter by. "
                          );
                          return;
                        }

                        // Toggle submenu on press
                        this.setState({ isFilterCategoryMenuOpen: !this.state.isFilterCategoryMenuOpen }); 
                        }
                      }
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
              onPress={() => { 
                // If there are no search results, Alert the user and prevent the sort menu from opening
                if(this.state.latestResults == null || this.state.latestResults.length == 0) {
                  showAlert(
                    "Empty Search Results",
                    "There are no current search results. Try finding some products first before sorting them."
                  );
                  return;
                }
                this.setState({ isSortMenuOpen: !this.state.isSortMenuOpen }); {/* Toggle sort submenu on press */ } 
              }}
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
                  <View style={[globalStyle.headerButtonText, { flex: 0, flexWrap: "wrap", flexDirection: "row", justifyContent: "center"}]}>
                    {/* Sort Lowest Price */}
                    <Pressable
                      style={[styles.sortSubmenuButton, this.state.sort == 'Lowest Price' ? styles.sortSubmenuButtonActive : styles.sortSubmenuButtonDefault]}
                      testID="Test_SortLowestPriceButton"
                      onPress={
                        () => {
                          this.setState({
                            sort: "Lowest Price",
                            latestResults: itemList.sort(this.sortPriceAsc),
                            unfilteredResults: itemList.sort(this.sortPriceAsc),
                            isSortMenuOpen: false
                          })
                        }
                      }
                    >
                      <Text style={[styles.buttonText, this.state.sort == 'Lowest Price' ? styles.sortButtonTextActive : styles.sortButtonTextDefault, { fontSize: 18 }]}>Lowest Price</Text>
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
                            isSortMenuOpen: false
                          })
                        }
                      }
                    >
                      <Text style={[styles.buttonText, this.state.sort == 'Highest Price' ? styles.sortButtonTextActive : styles.sortButtonTextDefault, { fontSize: 18 }]}>Highest Price</Text>
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
                            unfilteredResults: itemList.sort(this.sortAlpha),
                            isSortMenuOpen: false
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
                            unfilteredResults: itemList.sort(this.sortAlphaReverse),
                            isSortMenuOpen: false
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
                            latestResults: itemList.sort(this.sortUnitPrice),
                            isSortMenuOpen: false
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
            <Pressable style={globalStyle.headerButtonStyle} disabled={!this.hasSearched} onPress={() => this.props.pageChange(PAGE_ID.product)}testID="Test_ScanButton">
              <Text style={globalStyle.headerButtonText}>Details</Text>
            </Pressable>
          </View>
        </View>

        {/* shadow */}
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

        {/* Search Results and Page Arrows*/}
        <View>
          {/* Holds all results of searched items. TODO: make flatlist view shorter. */}
          <View style={{ height: "75%" }}>
            <FlatList
              data={itemList}
              flex={6}
              flexGrow={1}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={this.state}
              accessible={true}
              testID="Test_SearchResults"
            />
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
        </View>

        {/* Page navigation buttons */}
        <View style={{flexDirection: 'row', marginTop: 10, position: 'absolute', bottom: 80, backgroundColor: '#FFF', padding: 5}}>
          <Pressable 
            style={[globalStyle.headerButtonStyle, {paddingVertical: 5, flex: 2}]}
            onPress={() => {
                // Update state before calling navigation (to signal that it's not a new search)
                this.setState({isNewSearch: false}, () => this.navigateSearchResults(false))
              }
            }
            disabled={itemList == null || itemList.length == 0}
            testID="Test_PageBackButton"
          >
            <Text style={[globalStyle.headerButtonText, {fontSize: 30}]}>{'<'}</Text>
          </Pressable>
          <Pressable 
            style={[globalStyle.headerButtonStyle, {paddingVertical: 5, flex: 1}]}
            testID="Test_PageNumberButton"
          > 
            <Text style={[globalStyle.headerButtonText, {fontSize: 30}]}>{
                          // If itemList was reset, simply display a single page for the empty results
                          (itemList == null || itemList.length == 0) ? 1 : (pageNumIndex+1)   
                        }
            </Text> 
          </Pressable>
          <Pressable 
            style={[globalStyle.headerButtonStyle, {paddingVertical: 5, flex: 2}]}
            onPress={() => {
              // Update state before calling navigation (to signal that it's not a new search)
                this.setState({isNewSearch: false}, () => this.navigateSearchResults(true))
              }
            }
            disabled={itemList == null || itemList.length == 0}
            testID="Test_PageForwardButton"
          >
            <Text style={[globalStyle.headerButtonText, {fontSize: 30}]}>{'>'}</Text>
          </Pressable>
        </View>
        <View style={[globalStyle.navBarContainer, {flex: 1}]}>
          <SafeAreaView style={globalStyle.buttons} testID="Test_NavigationBar">
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
          </SafeAreaView>  
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
    height: "30%",
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
