import axios, { AxiosError, AxiosResponse } from "axios";

const axiosClient = axios.create({
  // baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  // baseURL: "/pdn1",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers = config.headers || {}; // Ensure headers exist
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    try {
      const { response } = error;
      if (response?.status === 401) {
        localStorage.removeItem("ACCESS_TOKEN");
      }
    } catch (error) {
      console.error(error);
    }

    throw error;
  }
);

export default axiosClient;
