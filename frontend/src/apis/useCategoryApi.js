import apiClient from "./config/axiosConfig";
const useCategoryApi = () => {
  const getCategories = () => apiClient.get("category");

  return { getCategories };
};

export default useCategoryApi;
