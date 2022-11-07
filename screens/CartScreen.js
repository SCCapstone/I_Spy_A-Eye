import { useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Pressable, TextInput } from 'react-native';

/*
  TODOS:
    Set up warnings on out-of-stock products before ordering
    Store cart data locally on device
*/

export default function CartScreen() {

  const [value, setValue] = useState(0)

  const incrementValue = () => {
    setValue(value + 1)
  }

  const decrementValue = () => {
    setValue(value - 1)
    if(value == 0) {
      setValue(value)
    }
  }

    return(
        <ScrollView>
            {/*Header*/}
            <Text style={style.header}>Cart</Text>

            {/*The charges will depend on the prices of the products*/}
            <Text style={{fontSize: 23, marginHorizontal: 20, marginBottom: 17}}>Grocery Total: $0.00</Text>

            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 23, marginHorizontal: 20, marginRight: 30}}>Delivery Price:$0.00</Text>
              
              {/*Buy button which will simulate the checkout*/}
              <Pressable style={style.button}>
                <Text style={style.buttonText}>Buy</Text>
              </Pressable>
            </View>
            
            <Text style={{fontSize: 23, marginHorizontal: 20}}>Grand Total:     $0.00</Text>

            {/*Horizontal line*/}
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 10,
                marginTop: 20
              }}
            />
            <View
              style={{
                borderBottomColor: 'lightgrey',
                borderBottomWidth: 5
              }}
            />

            {/*Item title, depends on what the user adds to the cart*/}
            <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Product Item Title</Text>

            {/*Price, quantity, and remove button*/}
            <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{backgroundColor: 'black', color: 'white', fontSize: 25, marginHorizontal: 20}}>$0.00</Text>

              <Pressable onPress={decrementValue}>
                <Text style={{fontWeight: 'bold', fontSize: 30}}>{'<'}</Text>
              </Pressable>

              <TextInput style={{fontSize: 25}} keyboardType='numeric'>{value}</TextInput>

              <Pressable onPress={incrementValue}>
                <Text style={{fontWeight: 'bold', fontSize: 30, marginRight: 70}}>{'>'}</Text>
              </Pressable>

              <Pressable style={style.remove}>
                <Text style={{color: 'white', fontSize: 19, fontWeight:'bold'}}>Remove</Text>
              </Pressable>
            </View>

            {/*Horizontal line*/}
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 10,
                marginTop: 20
              }}
            />
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
    button: {
      backgroundColor: 'black',
      borderRadius: 18,
      paddingVertical: 10,
      paddingHorizontal: 40,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
    remove: {
      backgroundColor: 'black',
      borderRadius: 18,
      paddingVertical: 5,
      paddingHorizontal: 20,
      marginRight: 15
    }
})