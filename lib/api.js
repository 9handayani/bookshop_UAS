// lib/api.js
// Next.js akan mengambil nilai dari dashboard Vercel secara otomatis
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const fetcher = async (endpoint, options = {}) => {
  // Pastikan tidak ada double slash jika endpoint diawali dengan /
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};
