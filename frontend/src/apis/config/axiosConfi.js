import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

// request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// global error handling
apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const statusCode = error.response?.status;

    // logging only errors
    if (statusCode && statusCode > 299) {
      console.error(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
