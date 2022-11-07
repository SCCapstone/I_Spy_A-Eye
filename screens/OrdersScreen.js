import { Text, StyleSheet, ScrollView, View } from 'react-native';

export default function OrdersScreen() {

    return(
        <ScrollView>
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

            {/*List of orders*/}
        </ScrollView>
    )
}

const style = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '45',
    marginTop: 25,
  },
})
