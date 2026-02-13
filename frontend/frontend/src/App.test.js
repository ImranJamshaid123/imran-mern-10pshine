import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the auth utility
jest.mock('./utils/auth', () => ({
  isAuthenticated: jest.fn(),
  getUser: jest.fn(),
  saveToken: jest.fn(),
  saveUser: jest.fn(),
  logout: jest.fn(),
}));

// Mock the API modules
jest.mock('./api/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('./api/notes', () => ({
  getNotes: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
  togglePin: jest.fn(),
  toggleFavorite: jest.fn(),
  toggleArchive: jest.fn(),
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('redirects to login from root path', () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  test('renders login route', () => {
    window.history.pushState({}, 'Test page', '/login');
    render(<App />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  test('renders register route', () => {
    window.history.pushState({}, 'Test page', '/register');
    render(<App />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('renders forgot password route', () => {
    window.history.pushState({}, 'Test page', '/forgot-password');
    render(<App />);
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });
});
