import React from 'react';
import { StyleSheet, View } from 'react-native';
import TabsNavigator from '../Rede-SSocial/src/screens/TabNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <TabsNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    
  },
});