import axios from 'axios';

const API_URL = 'https://api.intra.42.fr';
const CLIENT_ID = process.env.EXPO_PUBLIC_42_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_42_CLIENT_SECRET;

const get_token = async () => {
  const response = await axios.post(`${API_URL}/oauth/token`, {
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  return response.data;
};

const get_data = async (login: string, token: string) => {
  const response = await axios.get(`${API_URL}/v2/users/${login}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // console.log(response.data);
  return response.data;
};

export const getUser = async (login: string) => {
  if (login === '') {
    throw new Error('Veuillez entrer un login');
  }
  try {
    let token: string;
    
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      // console.log('Token does not exist');
      const tokenResponse = await get_token();
      token = tokenResponse.access_token;
      localStorage.setItem('token', token);
    } else {
      // console.log('Token exists');
      token = storedToken;
    }

    try {
      return await get_data(login, token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // console.log('Token expired');
        localStorage.removeItem('token');
        const tokenResponse = await get_token();
        token = tokenResponse.access_token;
        localStorage.setItem('token', token);
        return await get_data(login, token);
      }
      throw error;
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error(`Erreur réseau: ${error.message}`);
    }
    throw new Error('Une erreur est survenue');
  }
};