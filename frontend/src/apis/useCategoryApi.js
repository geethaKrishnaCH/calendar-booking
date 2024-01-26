import apiClient from "./config/axiosConfi";
const useCategoryApi = () => {
  const getCategories = () => apiClient.get("category");

  return { getCategories };
};

export default useCategoryApi;
