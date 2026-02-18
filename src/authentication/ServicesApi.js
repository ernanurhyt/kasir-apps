// services/api.js
const API_URL = 'https://web-production-80a65.up.railway.app/api';

// Helper function untuk API calls dengan auth
export const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // Auto refresh token jika expired
  if (response.status === 401) {
    // Implement token refresh logic here
  }

  return response;
};

// Contoh penggunaan:
export const getUserData = async () => {
  const response = await authFetch('/auth/me/');
  return response.json();
};