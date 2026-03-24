import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5006/api", // ton backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;