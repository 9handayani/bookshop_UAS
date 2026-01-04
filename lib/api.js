// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = async (endpoint, options = {}) => {
  // Menghilangkan potensi double slash (//)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;
  
  console.log("Fetching from:", url); // Tambahkan ini untuk debugging di console browser

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  return response.json();
};
