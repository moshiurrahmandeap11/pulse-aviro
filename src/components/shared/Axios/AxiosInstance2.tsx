import axios from "axios";

const apiClient2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_2 || "https://pulse-api.aviro24.shop/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient2;
