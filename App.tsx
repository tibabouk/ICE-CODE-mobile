import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import EncodeScreen from './src/screens/EncodeScreen';
import LoginScreen from './src/screens/LoginScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import { useAuth } from './src/hooks/useAuth';

export default function App(){
  const { token, loading, phase } = useAuth();

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar barStyle="dark-content" />
      {loading ? null : token ? (
        <EncodeScreen />
      ) : phase === 'verify' ? (
        <VerifyCodeScreen />
      ) : (
        <LoginScreen />
      )}
    </SafeAreaView>
  );
}