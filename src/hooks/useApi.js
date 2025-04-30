import { useState, useCallback } from "react";
import * as api from "../services/api";

/**
 * Custom hook for making API requests with loading and error states
 * @returns {Object} API utilities and state
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} Response data
   */
  const get = useCallback(async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[useApi] Making GET request to: ${endpoint}`);
      const response = await api.get(endpoint);
      console.log(`[useApi] GET response:`, response);
      return response;
    } catch (err) {
      console.error(`[useApi] GET error for ${endpoint}:`, err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching data";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Data to send
   * @returns {Promise<any>} Response data
   */
  const post = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[useApi] Making POST request to: ${endpoint}`, data);
      const response = await api.post(endpoint, data);
      console.log(`[useApi] POST response:`, response);
      return response;
    } catch (err) {
      console.error(`[useApi] POST error for ${endpoint}:`, err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while creating data";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Data to send
   * @returns {Promise<any>} Response data
   */
  const put = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[useApi] Making PUT request to: ${endpoint}`, data);
      const response = await api.put(endpoint, data);
      console.log(`[useApi] PUT response:`, response);
      return response;
    } catch (err) {
      console.error(`[useApi] PUT error for ${endpoint}:`, err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while updating data";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} Response data
   */
  const del = useCallback(async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[useApi] Making DELETE request to: ${endpoint}`);
      const response = await api.del(endpoint);
      console.log(`[useApi] DELETE response:`, response);
      return response;
    } catch (err) {
      console.error(`[useApi] DELETE error for ${endpoint}:`, err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while deleting data";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear any current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    get,
    post,
    put,
    del,
    loading,
    error,
    clearError,
  };
};

export default useApi;
