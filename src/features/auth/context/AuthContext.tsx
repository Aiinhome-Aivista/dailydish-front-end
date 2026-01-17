import { createContext } from "react";
import type { ReactNode } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
 
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: false,
     
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

