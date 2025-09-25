import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ agora exportamos o AuthContext também
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook oficial
export function useAuthContext() {
  return useContext(AuthContext);
}

// ✅ alias para manter compatibilidade
export const useAuth = useAuthContext;