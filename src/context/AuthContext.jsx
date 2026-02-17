import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 SAFE LOAD FROM LOCALSTORAGE
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
    } catch (err) {
      console.error("Auth load failed", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = (data) => {
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
  };

  if (loading) return null; // prevent flicker & crash

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
