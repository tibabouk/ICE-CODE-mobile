import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function VerifyCodeScreen() {
  const { verifyCode, loading, error } = useAuth();
  const [code, setCode] = useState('');

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Vérification</Text>
      <Text>Saisissez le code reçu par email.</Text>
      <TextInput
        placeholder="123456"
        keyboardType="number-pad"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }}
        value={code}
        onChangeText={setCode}
      />
      <Button
        title="Valider"
        onPress={() => verifyCode(code)}
        disabled={!code || loading}
      />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
}