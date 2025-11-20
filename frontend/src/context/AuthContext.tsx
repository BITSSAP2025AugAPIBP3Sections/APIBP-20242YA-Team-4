import { authAPI } from "@/lib/api-service";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "ATTENDEE" | "ORGANIZER";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, username: string, email: string, password: string, role: "ATTENDEE" | "ORGANIZER") => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Refresh user data from backend
  const refreshUser = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    try {
      const updated = await authAPI.getUserById(parsed.id);

      // Map backend → frontend shape
      const safeUser = {
        id: updated.id,
        username: updated.username,
        fullName: updated.fullName,
        email: updated.email,
        role: updated.role,
      };

      localStorage.setItem("user", JSON.stringify(safeUser));
      setUser(safeUser);
    } catch (e) {
      console.error("Failed to refresh user", e);
    }
  };

  // 🔹 Fetch user from backend by ID
  const fetchUserProfile = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);

    try {
      const freshUser = await authAPI.getUserById(parsed.id);
      setUser(freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
    } catch (err) {
      console.error("❌ Failed to refresh user:", err);
    }
  };

  // 🔹 On first load: check localStorage and fetch fresh data
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      refreshUser();
    }
    setIsLoading(false);
  }, []);

  // 🔹 LOGIN
  const login = async (username: string, password: string) => {
    const response = await authAPI.login({ username, password });

    const { user, token } = response;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    // Fetch updated user data if needed
    await fetchUserProfile();
  };

  // 🔹 REGISTER
  const register = async (
  fullName: string,
  username: string,
  email: string,
  password: string,
  role: "ATTENDEE" | "ORGANIZER"
) => {
  await authAPI.register({ username, email, password, fullName, role });
};


  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
