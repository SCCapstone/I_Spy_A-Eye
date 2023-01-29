import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList } from "react-native";
import globalStyle from "../globalStyle";

export default class Page3 extends React.Component {
  render() {
    return (
      <SafeAreaView style={globalStyle.wholeScreen}>
        <View style={style.container}>
          {/*Header*/}
          <Text style={style.header}>Orders</Text>

          {/*Horizontal line*/}
          <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 10,
                marginTop: 5
              }}
            />
          <View
            style={{
              borderBottomColor: 'lightgrey',
              borderBottomWidth: 5
            }}
          />

          <FlatList
            data={[
              {
                date: 'October 12, 2022',
                store: 'Kroger - 1240 Blackberry Street, Columbia SC, 29132',
                total: '$0.00',
                status: 'delivered'
              }
            ]}
            renderItem={({ item }) => (
              <View>
                {/*List of orders*/}
                <Text style={{fontWeight: 'bold', fontSize: 20, marginHorizontal: 10}}>{item.date}</Text>

                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', fontSize:20, marginHorizontal: 10}}>Store: </Text>
                  <Text style={{flex: 1, fontSize: 20}}>{item.store}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize:20, marginHorizontal: 10}}>Order Total:</Text>
                  <Text style={{fontSize: 20}}>{item.total}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', fontSize:20, marginHorizontal: 10}}>Status:</Text>
                  <Text style={{fontSize: 20}}>{item.status}</Text>
                </View>

                {/*Horizontal line*/}
                <View
                    style={{
                      borderBottomColor: 'black',
                      borderBottomWidth: 10,
                      marginTop: 20
                    }}
                  />
              </View>
            )}
          />
        </View>

        <View style={globalStyle.container}>
          <View style={globalStyle.buttons}>
            <TouchableOpacity onPress={() => this.props.pageChange(1)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(2)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
              />
              <Text>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.pageChange(3)}>
              <Image
                style={globalStyle.icon}
                source={require("../assets/gear.png")}
                accessible={true}
                accessibilityLabel={"Gear Icon"}
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
              <Text>Settings</Text>
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
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 45,
    marginTop: 25,
  },
})
