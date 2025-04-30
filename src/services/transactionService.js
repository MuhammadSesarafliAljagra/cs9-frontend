import * as api from "./api";

export const getAllTransactions = async () => {
  const response = await api.get("/transaction");
  return response.payload || response;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transaction/${id}`);
  return response.payload || response;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post("/transaction/create", transactionData);
  return response.payload || response;
};
