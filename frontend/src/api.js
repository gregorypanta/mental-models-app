// Από αυτό:
// const BASE_URL = "http://127.0.0.1:8000/api";

// Σε αυτό:
const BASE_URL = "https://mental-models-backend.onrender.com/api";

export const fetchData = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};