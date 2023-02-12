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
        backgroundColor: '#fff',
        padding: 2,
      },
      icon: {
        width: 36,
        height: 36,
        alignSelf: 'center'
      },
      headerButtonRow: {
        alignContent: 'space-between',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      headerButtonStyle: {
        flex: 1,
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 4,
      },
      headerButtonText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
      },
      headerDivider: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      headerText: {
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      inputContainer: {
        borderWidth: 7,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 25,
      },
})

export default globalStyle;