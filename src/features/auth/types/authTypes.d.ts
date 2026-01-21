
export interface User {
  username: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  userToken: string | null;
  userId: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
