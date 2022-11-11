import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Page1 from './screens/SearchScreen';
import Page2 from './screens/Page2';
import Page3 from './screens/Page3';
import Page4 from './screens/SettingsScreen';


//My snacks are at: https://expo.io/snacks/@uni


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
