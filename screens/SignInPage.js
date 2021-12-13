import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';


export default function SignInPage() {
  console.log(12);
  return (
    // <View>
    //   <Text>회원가입</Text>
    // </View>
    <View style={styles.screen}>
      <Text style={styles.text}>SignInPage</Text>
      <View style={styles.button}>
        <Button title="Signout" onPress={() => auth().signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
  },
  button: {
    marginTop: 30,
  },
});