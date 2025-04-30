// Base API service for handling HTTP requests

const API_URL = "https://cs9-backend.vercel.app";

// Helper to handle fetch requests with authentication
const fetchWithAuth = async (url, options = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;

    const headers = {
      ...options.headers,
    };

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle unauthorized responses (expired token, etc.)
    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired. Please login again."));
    }

    return response;
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};

export const get = async (endpoint) => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`);
  return response.json();
};

export const post = async (endpoint, data) => {
  // Prepare the request body based on data type
  const body = data instanceof FormData ? data : JSON.stringify(data);

  try {
    const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
      method: "POST",
      body: body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    // Special handling for connection errors during item creation
    if (
      endpoint.includes("/item/create") &&
      error.message?.includes("Connection")
    ) {
      console.warn(
        "Connection error during item creation. The item might have been created anyway."
      );

      // Return a positive response to prevent error display in UI
      // Actual refresh/check can happen in AddItem component
      return {
        success: true,
        message: "Item may have been created. Please check the items list.",
        payload: { id: "pending" },
      };
    }
    throw error;
  }
};

export const put = async (endpoint, data) => {
  // Prepare the request body based on data type
  const body = data instanceof FormData ? data : JSON.stringify(data);

  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: "PUT",
    body: body,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export const del = async (endpoint) => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};
