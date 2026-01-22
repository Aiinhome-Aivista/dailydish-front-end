import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../api/authService";
import type { LoginPayload } from "../types/login";
import type { AuthContextType, User } from "../types/authTypes";




export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      // Add artificial delay to ensure loader is visible
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await authService.login(credentials);
      if (response && response.status === 'success') {
        localStorage.setItem('token', response.token);
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
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setUserToken(null);
    setUserId(null);
    setUser(null);
    setIsLoggedIn(false);
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
