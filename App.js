import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Page1 from './screens/SearchScreen';
import Page2 from './screens/CartScreen';
import Page3 from './screens/OrdersScreen';
import Page4 from './screens/SettingsScreen';
import Page5 from './screens/CheckoutScreen';
import base64 from 'react-native-base64';
import {CLIENT_ID, CLIENT_SECRET} from "@env";

global.token=0;
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
    console.log('Success:', JSON.stringify(data));
    token=data.access_token;
    console.log(token)
  })
  .catch((error) => {
    console.error('Error:', error);
  }); 

export default class App extends React.Component {
  state = {
    page: 1,
  };

  pickPageToRender = () => {
    switch(this.state.page) {
      case 1:
        return (<Page1 pageChange={(pageNum) => this.setState({page: pageNum})} />);
        break;
      case 2:
        return (<Page2 pageChange={(pageNum) => this.setState({page: pageNum})}/>);
        break;
      case 3:
        return (<Page3 pageChange={(pageNum) => this.setState({page: pageNum})}/>);
        break;
      case 4:
        return (<Page4 pageChange={(pageNum) => this.setState({page: pageNum})}/>);
        break;
      case 5:
        return (<Page5 pageChange={(pageNum) => this.setState({page: pageNum})}/>);
        break;
    } 
  }

  render() {
    return (
      <View style={styles.container}>
        {this.pickPageToRender()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
