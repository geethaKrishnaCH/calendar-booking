import apiClient from "./config/axiosConfig";
const useCategoryApi = () => {
  const getCategories = () => apiClient.get("category");
  const saveCategory = (payload) => apiClient.post("category/add", payload);
  const updateCategory = (payload) =>
    apiClient.post(`category/update`, payload);
  return { getCategories, saveCategory, updateCategory };
};

export default useCategoryApi;
