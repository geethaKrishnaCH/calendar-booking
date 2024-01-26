import { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form, ListGroup } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import AppContext from "../../context/AppContext";
import useCategoryApi from "../../../apis/useCategoryApi";

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const {
    categories,
    showLoader,
    hideLoader,
    handleAPIError,
    handleShowToast,
    setCategories,
  } = useContext(AppContext);
  const { getCategories, saveCategory, updateCategory } = useCategoryApi();

  const fetchCategories = async () => {
    try {
      const { data } = (await getCategories()).data;
      showLoader();
      const temp = data.map((cat) => {
        return {
          id: cat.id,
          name: cat.name,
          isEdited: false,
        };
      });
      setCategories(data);
      setCategoryList(temp);
    } catch (err) {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setShowNewCategory(true);
  };

  const handleHideCategoryForm = () => {
    setShowNewCategory(false);
    setNewCategory("");
  };
  const handleEditCategory = (categoryId) => {
    const tempArr = categoryList;
    const category = tempArr.find((cat) => cat.id === categoryId);
    category.isEdited = true;
    setCategoryList([...tempArr]);
  };
  const handleCategoryChange = (categoryId, newValue) => {
    const tempArr = categoryList;
    const category = tempArr.find((cat) => cat.id === categoryId);
    category.name = newValue;
    setCategoryList([...tempArr]);
  };

  const resetCategory = (categoryId) => {
    const tempArr = categoryList;
    const category = tempArr.find((cat) => cat.id === categoryId);
    const oldCategory = categories.find((cat) => cat.id === categoryId);
    category.name = oldCategory.name;
    category.isEdited = false;
    setCategoryList([...tempArr]);
  };
  const handleSaveCategory = async () => {
    try {
      const payload = { name: newCategory };
      showLoader();
      await saveCategory(payload);
      handleShowToast("Category Added!");
      handleHideCategoryForm();
      fetchCategories();
    } catch (err) {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };
  const handleUpdateCategory = async (categoryId, categoryName) => {
    try {
      const payload = { name: categoryName, id: categoryId };
      showLoader();
      await updateCategory(payload);
      handleShowToast("Category updated!");
      fetchCategories();
    } catch (err) {
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  return (
    <Card as={Container} className="mt-3">
      <Card.Header className="d-flex justify-content-between">
        <h5>Categories</h5>
        <Button
          variant="primary"
          className="d-flex align-items-center"
          onClick={handleAddCategory}
        >
          <FaPlus size={18} />
          <span className="ms-2">Add Category</span>
        </Button>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          {categoryList.map((category) => (
            <ListGroup.Item
              key={category.id}
              className="d-flex align-items-center justify-content-between"
            >
              <Form.Control
                type="text"
                placeholder="New Category"
                value={category.name}
                disabled={!category.isEdited}
                onChange={(e) =>
                  handleCategoryChange(category.id, e.target.value)
                }
              />
              {!category.isEdited && (
                <Button
                  variant="secondary"
                  className="d-flex align-items-center ms-2"
                  size="sm"
                  onClick={() => handleEditCategory(category.id)}
                >
                  <FaEdit size={18} />
                  <span className="ms-2">Edit</span>
                </Button>
              )}
              {category.isEdited && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    className="ms-2"
                    onClick={() =>
                      handleUpdateCategory(category.id, category.name)
                    }
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    size="sm"
                    onClick={() => resetCategory(category.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </ListGroup.Item>
          ))}
          {showNewCategory && (
            <ListGroup.Item className="d-flex align-items-center justify-content-between">
              <Form.Control
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                variant="success"
                size="sm"
                className="ms-2"
                onClick={handleSaveCategory}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                size="sm"
                onClick={handleHideCategoryForm}
              >
                Cancel
              </Button>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
