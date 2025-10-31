import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // lee la variable del .env
});

export default api;
