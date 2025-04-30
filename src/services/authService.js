import * as api from "./api";

export const login = async (email, password) => {
  return api.post("/user/login", { email, password });
};

export const register = async (userData) => {
  return api.post("/user/register", userData);
};

export const getCurrentUser = async () => {
  return api.get("/user/me");
};

export const updateProfile = async (userData) => {
  return api.put("/user/profile", userData);
};
