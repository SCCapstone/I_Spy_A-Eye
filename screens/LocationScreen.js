import React from "react";
import {Alert, Text, View, StyleSheet, TouchableOpacity, Image, Pressable, FlatList, TextInput, SafeAreaView, ScrollView } from "react-native";
import globalStyle from "../globalStyle"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGE_ID } from "../utils/constants.js";
import { token } from "../App.js";

var itemList = [];

var itemIndex = 0;

var name = 0;

async function searchLocations(state) {  
    let callURL = `https://api.kroger.com/v1/locations?filter.zipCode.near=${state.ZipCode}&filter.limit=4&filter.radiusInMiles=25`;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let response = await fetch(callURL, options);
    let responseJSON = await response.json();
    if (!response.ok) {
      let errorHeader =
        "Error " + response.status.toString() + ": " + responseJSON.code;
        console.log("not okay")
      return null;
    }
    for (let i = 0; i < responseJSON.data.length; i++) {
      itemList[itemIndex] = {
        id: responseJSON.data[i].locationId,
        chain: responseJSON.data[i].chain,
        address: responseJSON.data[i].address.addressLine1,
        city: responseJSON.data[i].address.city,
        state: responseJSON.data[i].address.state,
        zip: responseJSON.data[i].address.zipCode, 
      };
      itemIndex++;
    }
    itemIndex = 0;
    return itemList;
  }

  const Item = ({ id, chain, address, city, state, zip }) => {
    return (<View style={styles.item}>
      <Text style={{fontSize: 16}}>{chain}{'\n'}{address}{', '}{'\n'}{city}{' '}{state}{', '}{zip}</Text>
      <Pressable style={styles.remove}onPress={() => {AsyncStorage.setItem("selectedLocation",`${chain}-    ${address}, ${city} ${state}, ${zip}`)
                                                      AsyncStorage.setItem("locationID",id)
                                                      showAlert(
                                                        `${chain} ${address}, ${city} ${state}, ${zip} Selected!`
                                                      );
                                                      }}>
          <Text style={{color: 'white', fontSize: 19, fontWeight:'bold'}}>Select</Text>
      </Pressable>
    </View>
    )
  };

  const renderItem = ({ id, item, chain, address, city, state, zip }) => (
    <>
      <Item
        id={item.id}
        chain={item.chain}
        address={item.address}
        city={item.city}
        state={item.state}
        zip={item.zip}
      />
    </>
  );

    function showAlert(alertTitle, alertMsg) {
      Alert.alert(alertTitle, alertMsg, [{ text: "OK" }], { cancelable: true });
    }

export default class SettingsScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ZipCode: "",
        StoreID: "",
        Results: [],
        currentLocation: ""
      };
    }

    async updateCurrentLocationState() {
      this.setState({
        currentLocation: `${await AsyncStorage.getItem("selectedLocation")}`,
      });
    }

    async updateCurrentLocationID() {
      this.setState({
        StoreID: `${await AsyncStorage.getItem("locationID")}`,
      });
    }

    componentDidMount() {
        this.updateCurrentLocationState();
        this.updateCurrentLocationID();
      }

    render(){
        return(
            <SafeAreaView style={globalStyle.wholeScreen}>
                <View > 
                    <Text style={globalStyle.headerText} testID="Test_SearchTextHeader">Choose a Store</Text>
                    <View style={{ marginHorizontal: 15 }}>
                    <View style={globalStyle.headerButtonRow}>
                    <TextInput
                        style={[
                            globalStyle.inputContainer,
                            {
                            marginRight: 10,
                            fontWeight: "bold",
                            fontSize: 18,
                            minWidth: "70%",
                            maxWidth: "70%"
                            },
                        ]}
                        placeholder="Zipcode"
                        placeholderTextColor={"#000000"}
                        onChangeText={(input) =>
                            this.setState({ ZipCode: input.trim() })
                        }
                        testID="Test_SearchBar"
                        />
                        <Pressable
                            style={styles.searchButtonStyle}
                            onPressIn={async () => {
                                itemList = await searchLocations(this.state);
                                console.log("Item List:")
                                console.log(itemList)
                                if (itemList == null) { 
                                    showAlert(
                                        "No Locations Found",
                                        "There may not be any Locations in your area"
                                    );
                                    itemList = []
                                }
                                this.setState({ Results: itemList})
                            }}
                            testID="Test_SearchButton"
                            >
                            <Text style={styles.searchButtonText}>Search</Text>
                        </Pressable>
                    </View>
                    </View>
                    <Text>{'\n'}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        borderColor: "black",
                        borderBottomWidth: 8,
                      }}
                    />
                  </View>
                  <View>
                    <FlatList
                      data={itemList}
                      renderItem= {renderItem}
                      keyExtractor={(item) => item.id}
                      extraData={this.state}
                      testID="Test_Locations"
                    />
                  </View>     
                </View>
                  <View style={styles.fixedButton}>
                      <Pressable
                        style={globalStyle.wideButtonStyle}
                        onPress={() => this.props.pageChange(PAGE_ID.search)}
                        testID="Test_Continue"
                        disabled={this.state.StoreID=="" ? true: false}
                      >
                        <Text style={globalStyle.wideButtonText}>
                          Continue
                        </Text>
                      </Pressable>
                  </View>    
    </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  Bottombutton: {
        flex:1,
        justifyContent:'flex-end',
        paddingVertical: 17
  },  
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
      item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
        margin: 2,
        borderColor: '#000000',
        borderWidth: 1,
        backgroundColor: '#ffffff'
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
      fixedButton: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 17,
      }
    });