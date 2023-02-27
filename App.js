import * as React from 'react';
import Login from './screens/LogInScreen';
import SignUp from './screens/SignUpScreen';
import Page1 from './screens/SearchScreen';
import Page2 from './screens/CartScreen';
import Page3 from './screens/OrdersScreen';
import Page4 from './screens/SettingsScreen';
import NotSignedInSettings from './screens/NotSignedInSettingsScreen';
import Page5 from './screens/CheckoutScreen';
import DeliveryAddress from './screens/DeliveryAddressScreen';
import base64 from 'react-native-base64';
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import firebase from 'firebase';
require('firebase/auth');

// I Spy Shopper v0.5

let token = 0;
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.kroger.com/v1/connect/oauth2/token",
  "method": "POST",
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${base64.encode(CLIENT_ID + ":" + CLIENT_SECRET)}`
  },
  "data": {
    "grant_type": "client_credentials",
    "scope": "product.compact"
  }
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
  body: formBody
})
  .then((response) => response.json())
  .then((data) => {
    token = data.access_token;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
export { token }


export default class App extends React.Component {
  // This state determines which page to render. Users not logged in will see different pages.
  state = {
    page: 0,
    userLoggedIn: false,
  };

  // Updates the state of which screen the user is currently on.
  pickPageToRender = () => {
    // Determines if user is logged in or not.
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in.");
        this.state.userLoggedIn = true;
      } else {
        console.log("No user is logged in.");
        this.state.userLoggedIn = false;
      }
    });


    switch (this.state.page) {
      case 6:
        return (<SignUp pageChange={(pageNum) => this.setState({ page: pageNum })} />);
      case 0:
        return (<Login pageChange={(pageNum) => this.setState({ page: pageNum })} />);
      case 1:
        return (<Page1 pageChange={(pageNum) => this.setState({ page: pageNum })} />);
      case 2:
        return (<Page2 pageChange={(pageNum) => this.setState({ page: pageNum })} />);
      case 3:
        return (<Page3 pageChange={(pageNum) => this.setState({ page: pageNum })} />);
      case 4:
        if (this.state.userLoggedIn) {
          // Users logged in will be returned this page when clicking the settings button.
          return (<Page4 pageChange={(pageNum) => this.setState({ page: pageNum })} />);
        } else {
          // Users not logged in will be returned this page when clicking the settings button.
          return (<NotSignedInSettings pageChange={(pageNum) => this.setState({ page: pageNum })} />);
        }
      case 5:
        return (<Page5 pageChange={(pageNum) => this.setState({ page: pageNum })} />);
      case 7:
        return (<DeliveryAddress pageChange={(pageNum) => this.setState({ page: pageNum })} />);
    }
  }


  render() {
    return (
      <>
        {this.pickPageToRender()}
      </>
    );
  }
}

