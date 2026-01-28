import { createContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { authService } from "../api/authService";
import type { LoginPayload } from "../types/login";
import type { AuthContextType, User } from "../types/authTypes";

const TOKEN_EXPIRY_TIME = 30 * 60 * 1000;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const tokenExpiryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check token validity and handle expiration
  const checkTokenValidity = () => {
    const tokenTimestamp = localStorage.getItem('token_timestamp');
    if (tokenTimestamp) {
      const now = Date.now();
      const tokenAge = now - parseInt(tokenTimestamp);
      if (tokenAge > TOKEN_EXPIRY_TIME) {
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUserToken(token);
      setUserId(storedUserId);
      setUser({ username: storedUsername });
    }
    setIsLoading(false);
  }, []);

  // Set up interval to check token validity every minute
  useEffect(() => {
    if (isLoggedIn) {
      checkTokenValidity(); // Check immediately
      tokenExpiryIntervalRef.current = setInterval(() => {
        checkTokenValidity();
      }, 60000); // Check every 60 seconds
    }

    return () => {
      if (tokenExpiryIntervalRef.current) {
        clearInterval(tokenExpiryIntervalRef.current);
      }
    };
  }, [isLoggedIn]);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      // Add artificial delay to ensure loader is visible
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const response = await authService.login(credentials);
      if (response && response.status === 'success') {
        const timestamp = Date.now();
        localStorage.setItem('token', response.token);
        localStorage.setItem('token_timestamp', timestamp.toString());
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('username', response.username);
        setUserToken(response.token);
        setUserId(response.user_id);
        setUser({ username: response.username });
        setIsLoggedIn(true);
      } else {
        setError(response?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setUserToken(null);
    setUserId(null);
    setUser(null);
    setIsLoggedIn(false);
    if (tokenExpiryIntervalRef.current) {
      clearInterval(tokenExpiryIntervalRef.current);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        userToken,
        userId,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
