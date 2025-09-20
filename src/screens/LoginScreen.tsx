import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { requestMagicLink, loading, error } = useAuth();
  const [email, setEmail] = useState('');

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Connexion</Text>
      <Text>Entrez votre email pour recevoir un code (magic link).</Text>
      <TextInput
        placeholder="email@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }}
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Envoyer code"
        onPress={() => requestMagicLink(email)}
        disabled={!email || loading}
      />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
}