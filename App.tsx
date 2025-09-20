import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import EncodeScreen from './src/screens/EncodeScreen';

export default function App(){
  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar barStyle="dark-content" />
      <EncodeScreen />
    </SafeAreaView>
  );
}