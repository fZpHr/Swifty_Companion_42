import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.intra.42.fr';
const CLIENT_ID = process.env.EXPO_PUBLIC_42_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_42_CLIENT_SECRET;

const get_token = async (): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });
    // console.log('Token obtenu');
    return response.data;
  } catch (error: any) {
    // console.error('Erreur get_token:', error);
    throw error;
  }
};

const get_data = async (login: string, token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/v2/users/${login}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // console.log('Données reçues');
    return response.data;
  } catch (error: any) {
    // console.error('Erreur get_data:', error);
    throw error;
  }
};

export const getUser = async (login: string): Promise<any> => {
  try {
    let token: any;
    const storedToken = await AsyncStorage.getItem('token');
    
    if (!storedToken) {
      // console.log('Pas de token stocké, obtention d\'un nouveau token');
      const tokenResponse: any = await get_token();
      token = tokenResponse.access_token;
      await AsyncStorage.setItem('token', token);
    } else {
      // console.log('Token trouvé dans le storage');
      token = storedToken;
    }

    try {
      return await get_data(login, token);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // console.log('Token expiré, obtention d\'un nouveau token');
        await AsyncStorage.removeItem('token');
        const tokenResponse: any = await get_token();
        token = tokenResponse.access_token;
        await AsyncStorage.setItem('token', token);
        return await get_data(login, token);
      }
      throw error;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error(`Erreur réseau: ${error.message}`);
    }
    throw new Error('Une erreur est survenue');
  }
};