import axios from "axios";

const useAxios = () => {
  let failedQueue = [];
  let isRefreshing = false;

  const processQueue = (error) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    failedQueue = [];
  };

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
  // apiClient.interceptors.response.use(
  //   (res) => {
  //     return res;
  //   },
  //   async (error) => {
  //     const originalRequest = error.config;
  //     const statusCode = error.response?.status;
  //     const refreshTokenURL = "user/refreshToken";

  //     const handleError = (error) => {
  //       processQueue(error);
  //       // handleLogout();
  //       return Promise.reject(error);
  //     };

  //     if (
  //       statusCode === 401 &&
  //       originalRequest?.url !== refreshTokenURL &&
  //       !originalRequest?._retry
  //     ) {
  //       if (isRefreshing) {
  //         try {
  //           await new Promise((resolve, reject) => {
  //             failedQueue.push({ resolve, reject });
  //           });
  //           return api(originalRequest);
  //         } catch (err) {
  //           return Promise.reject(err);
  //         }
  //       }
  //       isRefreshing = true;
  //       originalRequest._retry = true;
  //       try {
  //         const response = (await apiClient.get(refreshTokenURL)).data;
  //         processQueue(null);
  //         return api(originalRequest);
  //       } catch (err) {
  //         handleError();
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     }

  //     if (
  //       statusCode &&
  //       (statusCode === 401 || statusCode === 400) &&
  //       originalRequest?.url === refreshTokenURL
  //     ) {
  //       // handleLogout();
  //       return Promise.reject(error);
  //     }

  //     apiClient.request({
  //       url: "/user/refreshToken",
  //       method: "GET",
  //     });

  //     // logging only errors
  //     if (statusCode && statusCode > 299) {
  //       console.error(error);
  //     }

  //     return Promise.reject(error);
  //   }
  // );

  return apiClient;
};

export default useAxios;
