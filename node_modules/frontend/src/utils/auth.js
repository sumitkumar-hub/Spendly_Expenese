const TOKEN_KEY = 'token';

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('setToken error:', err);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error('getToken error:', err);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error('removeToken error:', err);
  }
};

export const isAuthenticated = () => Boolean(getToken());

export default { setToken, getToken, removeToken, isAuthenticated };
