const BASE_URL = import.meta.env.VITE_API_URL || "https://mental-models-backend.onrender.com/api";

export const fetchData = async (endpoint) => {
  // Αφαιρούμε το / από την αρχή του endpoint αν υπάρχει, 
  // και το προσθέτουμε εμείς χειροκίνητα μετά το BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const response = await fetch(`${BASE_URL}/${cleanEndpoint}`);
  
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};