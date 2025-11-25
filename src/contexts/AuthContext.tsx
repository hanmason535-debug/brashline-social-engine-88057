/**
 * Authentication Context - Frontend-only mock authentication
 * Stores user session in localStorage until backend integration
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export interface BillingInfo {
  cardLast4?: string;
  cardBrand?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
}

interface AuthContextType {
  user: User | null;
  billingInfo: BillingInfo | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  updateBilling: (data: BillingInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("brashline_user");
    const storedBilling = localStorage.getItem("brashline_billing");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedBilling) {
      setBillingInfo(JSON.parse(storedBilling));
    }
  }, []);

  const login = (email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("brashline_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("brashline_user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("brashline_user", JSON.stringify(updatedUser));
  };

  const updateBilling = (data: BillingInfo) => {
    setBillingInfo(data);
    localStorage.setItem("brashline_billing", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        billingInfo,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        updateBilling,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
