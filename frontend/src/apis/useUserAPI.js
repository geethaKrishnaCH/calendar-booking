import useAxios from "./axios-hook/useAxios";

const useUserApi = () => {
  const apiClient = useAxios();

  const register = (payload) => apiClient.post("user/register", payload);

  const login = (payload) =>
    apiClient.request({ method: "POST", url: "user/login" }, payload);

  const refreshToken = () => apiClient.get("user/refreshToken");

  const logout = () => apiClient.get("user/logout");

  return { register, login, refreshToken, logout };
};

export default useUserApi;
