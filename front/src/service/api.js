import axios from "axios";
import { ST__TOKEN_KEY } from "../constants/ls_keys.js";

const url = import.meta.env.API_URL || "http://localhost:8080"; // Fallback URL

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use(
  (req) => {
    if (localStorage.getItem(ST__TOKEN_KEY)) {
      req.headers.Authorization = `Bearer ${localStorage.getItem(
        ST__TOKEN_KEY
      )}`;
    }

    return req;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error :>> ", error);
    if (
      error.response.status === 401 &&
      error.response.data.message === "Token não informado"
    ) {
      localStorage.removeItem(ST__TOKEN_KEY);
      document.location = "/login";
    }
    if (
      error.response.status === 403 &&
      error.response.data.message === "Token inválido"
    ) {
      document.location = "/login";
      localStorage.clear();
    }

    console.log("error interceptor :>> ", error);
    return Promise.reject(error);
  }
);

export default api;
