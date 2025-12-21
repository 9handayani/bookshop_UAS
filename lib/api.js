// lib/api.js
const API_URL = "http://127.0.0.1:8000/api";

export const fetcher = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  return response.json();
};