
export interface AuthContextType {
  isLoggedIn: boolean;
  userToken: string | null;
  userId: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
