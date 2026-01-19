import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../api/authService";
import type { LoginPayload } from "../types/login";


export interface AuthContextType {
  isLoggedIn: boolean;
  userToken: string | null;
  userId: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');
    if (token) {
      setIsLoggedIn(true);
      setUserToken(token);
      setUserId(storedUserId);
    }
  }, []);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response && response.status === 'success') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user_id);
        setUserToken(response.token);
        setUserId(response.user_id);
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
    localStorage.removeItem('user_id');
    setUserToken(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
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

