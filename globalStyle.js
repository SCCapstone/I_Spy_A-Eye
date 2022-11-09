import {StyleSheet} from 'react-native'


const globalStyle=StyleSheet.create({
    wholeScreen: {
        backgroundColor: '#fff',
        height: '100%',
      },
      buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        justifyContent: 'space-evenly',
      },
      container: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
        borderWidth: 5,
        borderRadius: 999,
        padding: 2,
      },
      icon: {
        width: 36,
        height: 36,
        alignSelf: 'center'
      }
})

export default globalStyle;