import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Login function
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password
  });
  return response.data;
};

// Logout function
export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

export default {
  login,
  logout
};