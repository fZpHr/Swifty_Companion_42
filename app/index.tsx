import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { getUser } from '../api/api42';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchScreen() {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!login || login.length < 2) {
      alert('Veuillez entrer un login valide');
      return;
    }
    setLoading(true);
    try {
      const userData = await getUser(login);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      router.push('/profile');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        label="Login 42"
        value={login}
        onChangeText={setLogin}
        mode="outlined"
        disabled={loading}
        style={{ marginBottom: 20 }}
      />
      <Button 
        mode="contained"
        onPress={handleSearch}
        loading={loading}
        disabled={loading || !login}
      >
        Rechercher
      </Button>
    </View>
  );
}