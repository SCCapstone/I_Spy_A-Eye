import { useState } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';

export default function OrdersScreen() {

  const [order, setOrders] = useState([
    {
      date: 'October 12, 2022',
      store: 'Kroger - 1240 Blackberry Street, Columbia SC, 29132',
      total: '$0.00',
      status: 'delivered'
    },
  ])

    return(
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
              data={order}
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
    )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '45',
    marginTop: 25,
  },
})