import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View,Text} from 'react-native';
import globalStyle from '../globalStyle';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

function OpenURLButton({url, children}) {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
  <Pressable color='black' onPress={handlePress}>
    <Text style={globalStyle.wideButtonText}>{children}</Text>
  </Pressable>
  );
};

export {OpenURLButton};