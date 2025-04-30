import * as api from "./api";

export const getAllItems = async () => {
  const response = await api.get("/item");
  return response.payload || response;
};

export const getItemById = async (id) => {
  const response = await api.get(`/item/byId/${id}`);
  return response.payload || response;
};

export const createItem = async (itemData) => {
  const response = await api.post("/item/create", itemData);
  return response.payload || response;
};

export const updateItem = async (id, itemData) => {
  const data = { ...itemData, id };
  const response = await api.put("/item", data);
  return response.payload || response;
};

export const deleteItem = async (id) => {
  const response = await api.del(`/item/${id}`);
  return response.payload || response;
};
