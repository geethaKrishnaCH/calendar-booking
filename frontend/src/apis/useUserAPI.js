import apiClient from "./config/axiosConfig";
const useUserApi = () => {
  const register = (payload) => apiClient.post("auth/register", payload);

  const login = (payload) => apiClient.post("auth/login", payload);

  const getProfile = () => apiClient.get("user/profile");

  const generateOTP = (payload) => apiClient.post("auth/otp", payload);
  const verifyOTP = (payload) => apiClient.post("auth/otp/verify", payload);

  return { register, login, getProfile, generateOTP, verifyOTP };
};

export default useUserApi;
