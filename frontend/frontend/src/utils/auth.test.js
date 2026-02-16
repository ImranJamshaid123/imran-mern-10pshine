import {
  saveToken,
  saveUser,
  getUser,
  getToken,
  logout,
  isAuthenticated,
  getUserFromToken,
} from './auth';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Auth Utility Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveToken', () => {
    test('saves token to localStorage', () => {
      saveToken('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });

  describe('saveUser', () => {
    test('saves user object to localStorage as JSON', () => {
      const user = { name: 'Test User', email: 'test@example.com' };
      saveUser(user);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    });
  });

  describe('getUser', () => {
    test('retrieves and parses user from localStorage', () => {
      const user = { name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(user));
      expect(getUser()).toEqual(user);
    });

    test('returns null when no user is stored', () => {
      expect(getUser()).toBeNull();
    });

    test('returns null when stored data is not valid JSON', () => {
      localStorage.setItem('user', 'invalid-json');
      expect(() => getUser()).toThrow();
    });
  });

  describe('getToken', () => {
    test('retrieves token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(getToken()).toBe('test-token');
    });

    test('returns null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });
  });

  describe('logout', () => {
    test('removes token and user from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test' }));

      logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    test('returns false when no token is stored', () => {
      expect(isAuthenticated()).toBe(false);
    });

    test('returns true when valid non-expired token exists', () => {
      // Create a token that expires in the future
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: futureTime, sub: '123' }));
      const signature = 'fake-signature';
      const token = `${header}.${payload}.${signature}`;

      localStorage.setItem('token', token);
      expect(isAuthenticated()).toBe(true);
    });

    test('returns false and logs out when token is expired', () => {
      // Create a token that is already expired
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: pastTime, sub: '123' }));
      const signature = 'fake-signature';
      const token = `${header}.${payload}.${signature}`;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name: 'Test' }));

      expect(isAuthenticated()).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    test('returns true when token has no expiration', () => {
      // Create a token without exp field
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: '123' }));
      const signature = 'fake-signature';
      const token = `${header}.${payload}.${signature}`;

      localStorage.setItem('token', token);
      expect(isAuthenticated()).toBe(true);
    });

    test('returns true for non-JWT token format', () => {
      localStorage.setItem('token', 'simple-token');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getUserFromToken', () => {
    test('extracts user data from valid JWT token', () => {
      const userData = { sub: '123', name: 'Test User', email: 'test@example.com' };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(userData));
      const signature = 'fake-signature';
      const token = `${header}.${payload}.${signature}`;

      expect(getUserFromToken(token)).toEqual(userData);
    });

    test('returns null for non-JWT token format', () => {
      expect(getUserFromToken('simple-token')).toBeNull();
    });

    test('returns null for invalid JWT token', () => {
      expect(getUserFromToken('invalid.jwt.token')).toBeNull();
    });

    test('returns null for malformed JWT payload', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const invalidPayload = 'not-base64-encoded';
      const signature = 'fake-signature';
      const token = `${header}.${invalidPayload}.${signature}`;

      expect(getUserFromToken(token)).toBeNull();
    });

    test('handles JWT with special characters in payload', () => {
      const userData = { sub: '123', name: 'Test+User', email: 'test@example.com' };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(userData))
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
      const signature = 'fake-signature';
      const token = `${header}.${payload}.${signature}`;

      const result = getUserFromToken(token);
      expect(result).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    test('complete auth flow: save, retrieve, and logout', () => {
      const token = 'test-token';
      const user = { name: 'Test User', email: 'test@example.com' };

      // Save token and user
      saveToken(token);
      saveUser(user);

      // Retrieve them
      expect(getToken()).toBe(token);
      expect(getUser()).toEqual(user);

      // Logout
      logout();

      // Verify they're gone
      expect(getToken()).toBeNull();
      expect(getUser()).toBeNull();
    });

    test('authentication check after logout returns false', () => {
      localStorage.setItem('token', 'test-token');
      expect(isAuthenticated()).toBe(true);

      logout();
      expect(isAuthenticated()).toBe(false);
    });
  });
});
