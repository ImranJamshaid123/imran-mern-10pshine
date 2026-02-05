export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const isJwt = (token) => {
  return typeof token === 'string' && token.split('.').length === 3;
};

const isTokenExpired = (token) => {
  if (!isJwt(token)) return false;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch (e) {
    return false;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    logout();
    return false;
  }
  return true;
};

export const getUserFromToken = (token) => {
  if (!isJwt(token)) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
