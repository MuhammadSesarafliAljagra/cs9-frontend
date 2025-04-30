import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // In the login function
  const login = async (email, password) => {
    try {
      // Use URLSearchParams for query parameters
      const response = await fetch(
        `https://cs9-backend.vercel.app/user/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Remove body since backend uses query parameters
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      setUser(userData.payload); // Use userData.payload as backend returns { success, message, payload }
      localStorage.setItem("user", JSON.stringify(userData.payload));
      return userData.payload;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Similar changes for register
  const register = async (userData) => {
    try {
      // Use URLSearchParams for query parameters
      const queryString = new URLSearchParams({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }).toString();

      const response = await fetch(
        `https://cs9-backend.vercel.app/user/register?${queryString}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      // Rest of the function remains the same

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};