import axios from "axios";

const API = axios.create({
  baseURL: "https://wallet.b.goit.study/api",
});

export const setAuthToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete API.defaults.headers.common["Authorization"];
};

export default API;
