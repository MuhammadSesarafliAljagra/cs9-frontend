import * as api from "./api";

export const getAllStores = async () => {
  const response = await api.get("/store/getAll");
  return response.payload || response; // Extract payload or fall back to entire response
};

export const getStoreById = async (id) => {
  const response = await api.get(`/store/${id}`);
  return response.payload || response; // Extract payload or fall back to entire response
};

// Other functions remain the same with payload extraction
export const createStore = async (storeData) => {
  const response = await api.post("/store/create", storeData);
  return response.payload || response;
};

export const updateStore = async (id, storeData) => {
  const data = { ...storeData, id };
  const response = await api.put(`/store`, data);
  return response.payload || response;
};

export const deleteStore = async (id) => {
  const response = await api.del(`/store/${id}`);
  return response.payload || response;
};