import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  ImageBackground
} from "react-native";
import globalStyle from "../globalStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PAGE_ID } from "../utils/constants.js";

export default class Page3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOrLogIn: "",
    };
  }

  async updateNavBarText() {
    this.setState({
      settingsOrLogIn: await AsyncStorage.getItem("SettingsOrLogIn"),
    });
  }

  componentDidMount() {
    this.updateNavBarText();
  }

  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          {/*Header*/}
          <Text style={style.header} accessibilityRole="header">
            Orders
          </Text>

        {/* This is the shadow of the horizontal line. The translate Y value comes from 
        the marginTop value and borderBottomWidth value of the horizontal line added 
        together, plus the shadow height as well. The total of this value has 0.1 subtracted
        from it so the shadow overlaps slightly with the black bar so that there isn't
        a think white line in the middle. */}
        <View style={{ 
          height: 5,
          position: 'relative',
          transform: [{translateY: 19.9}],}}
        >
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("../assets/shadow.png")}
            imageStyle={{ resizeMode: "repeat" }}
          ></ImageBackground>
        </View>

          {/*Horizontal line*/}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 10,
              marginTop: 5,
            }}
          />

          <FlatList
            data={[
              {
                date: "October 12, 2022",
                store: "Kroger - 1240 Blackberry Street, Columbia SC, 29132",
                total: "$0.00",
                status: "delivered",
              },
            ]}
            renderItem={({ item }) => (
              <View>
                {/*List of orders*/}
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginHorizontal: 10,
                  }}
                >
                  {item.date}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      marginHorizontal: 10,
                    }}
                  >
                    Store:{" "}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 20 }}>{item.store}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 20, marginHorizontal: 10 }}>
                    Order Total:
                  </Text>
                  <Text style={{ fontSize: 20 }}>{item.total}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      marginHorizontal: 10,
                    }}
                  >
                    Status:
                  </Text>
                  <Text style={{ fontSize: 20 }}>{item.status}</Text>
                </View>

                {/*Horizontal line*/}
                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: 10,
                    marginTop: 20,
                  }}
                />
              </View>
            )}
          />
        </View>

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
