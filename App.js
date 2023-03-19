import * as React from "react";
import { PAGE_ID } from "./utils/constants";
import Login from "./screens/LogInScreen";
import SignUp from "./screens/SignUpScreen";
import SearchScreen from "./screens/SearchScreen";
import CartScreen from "./screens/CartScreen";
import Page3 from "./screens/OrdersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotSignedInSettings from "./screens/NotSignedInSettingsScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import DeliveryAddress from "./screens/DeliveryAddressScreen";
import BillingInfoScreen from "./screens/BillingInfoScreen";
import base64 from "react-native-base64";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import firebase from "firebase";
require("firebase/auth");
import AsyncStorage from "@react-native-async-storage/async-storage";

// I Spy Shopper v0.5

let token = 0;
var settings = {
  async: true,
  crossDomain: true,
  url: "https://api.kroger.com/v1/connect/oauth2/token",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${base64.encode(CLIENT_ID + ":" + CLIENT_SECRET)}`,
  },
  data: {
    grant_type: "client_credentials",
    scope: "product.compact",
  },
};
var formBody = [];
for (var property in settings.data) {
  var encodedKey = encodeURIComponent(property);
  var encodedValue = encodeURIComponent(settings.data[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");

//POST TOKEN

fetch(settings.url, {
  method: settings.method,
  headers: settings.headers,
  body: formBody,
})
  .then((response) => response.json())
  .then((data) => {
    token = data.access_token;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
export { token };

export default class App extends React.Component {
  // This state determines which page to render. Users not logged in will see different pages.
  state = {
    page: PAGE_ID.login,
    userLoggedIn: false,
  };

  // Updates the state of which screen the user is currently on.
  pickPageToRender = () => {
    /**
     * Determines if user is logged in or not and updates the state. If a user is logged in,
     * The current user's ID is stored in Async storage which gives easy access to Firestore.
     * Also the navbar will change based on this function.
     */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userID = user.uid;
        this.state.userLoggedIn = true;
        AsyncStorage.setItem("userID", userID);
        AsyncStorage.setItem("userEmail", user.email);
        // Determines what text to render for the navbar
        AsyncStorage.setItem("SettingsOrLogIn", "Settings");
        console.log(`Current user ID: ${userID}`);
      } else {
        console.log("No user is logged in.");
        this.state.userLoggedIn = false;
        AsyncStorage.setItem("userID", "none");
        // Determines what text to render for the navbar
        AsyncStorage.setItem("SettingsOrLogIn", "Log In");
      }
    });

    switch (this.state.page) {
      case PAGE_ID.sign_up:
        return (
          <SignUp pageChange={(pageNum) => this.setState({ page: pageNum })} />
        );
      case PAGE_ID.login:
        return (
          <Login pageChange={(pageNum) => this.setState({ page: pageNum })} />
        );
      case PAGE_ID.search:
        return (
          <SearchScreen
            pageChange={(pageNum) => this.setState({ page: pageNum })}
          />
        );
      case PAGE_ID.cart:
        return (
          <CartScreen
            pageChange={(pageNum) => this.setState({ page: pageNum })}
          />
        );
      case PAGE_ID.orders:
        return (
          <Page3 pageChange={(pageNum) => this.setState({ page: pageNum })} />
        );
      case PAGE_ID.settings:
        if (this.state.userLoggedIn) {
          // Users logged in will be returned this page when clicking the settings button.
          return (
            <SettingsScreen
              pageChange={(pageNum) => this.setState({ page: pageNum })}
            />
          );
        } else {
          // Users not logged in will be returned this page when clicking the settings button.
          return (
            <NotSignedInSettings
              pageChange={(pageNum) => this.setState({ page: pageNum })}
            />
          );
        }
      case PAGE_ID.checkout:
        if (this.state.userLoggedIn) {
          return (
            <CheckoutScreen
              pageChange={(pageNum) => this.setState({ page: pageNum })}
            />
          );
        } else {
          // Users can't checkout if they aren't signed in.
          return (
            <NotSignedInSettings
              pageChange={(pageNum) => this.setState({ page: pageNum })}
            />
          );
        }
      case PAGE_ID.delivery_address:
        return (
          <DeliveryAddress
            pageChange={(pageNum) => this.setState({ page: pageNum })}
          />
        );
      case PAGE_ID.billing_info:
        return (
          <BillingInfoScreen
            pageChange={(pageNum) => this.setState({ page: pageNum })}
          />
        );
    }
  };

  render() {
    return <>{this.pickPageToRender()}</>;
  }
}
