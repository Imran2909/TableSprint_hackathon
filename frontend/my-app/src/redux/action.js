import axios from "axios";
import {
  TOGGLE_FORM,
  TOGGLE_PAGE,
  REQUEST,
  REQUEST_FAIL,
  REQUEST_SUCCESS,
  TOGGLE_CATEGORY_TABLE,
  TOGGLE_SUBCATEGORY_TABLE,
  TOGGLE_EDIT_SUBCATEGORY_PANEL,
  TOGGLE_PRODUCT_TABLE,
  TOGGLE_EDIT_PRODUCT_PANEL,
  TOGGLE_ADD_PRODUCT_PANEL,
} from "./actionTypes"; 
import Subcategory from "../pages/Subcategory";

// Fetch Categories Actions
export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: REQUEST }); 
  try {
    const response = await axios.get("http://localhost:8080/category");
    dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: response.data }); 
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Failed to fetch categories!");
  }
};

// Toggle between login and signup forms
export const toggleForm = () => ({
  type: TOGGLE_FORM,
});

// Add Category Action
export const addCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_CATEGORY_REQUEST" });

    const response = await axios.post("http://localhost:8080/category", categoryData); 
    dispatch({ type: "ADD_CATEGORY_SUCCESS", payload: response.data });
    // After adding, refresh the categories
    dispatch(fetchCategories());
  } catch (error) {
    dispatch({ type: "ADD_CATEGORY_FAILURE", payload: error.message });
  }
};

// Toggle Category Table Action
export const toggleCategoryTable = () => ({
  type: TOGGLE_CATEGORY_TABLE,
});

export const toggleSubCategoryTable = () => ({
  type: TOGGLE_SUBCATEGORY_TABLE,
});
// Action to toggle the active page
export const togglePage = (page) => ({
  type: TOGGLE_PAGE,
  payload: page,
});

// Login Action
export const loginUser = (email, password) => async (dispatch) => {
  dispatch({ type: REQUEST });
  try {
    const response = await axios.post("http://localhost:8080/user/login", {
      email,
      password,
    });
    const { token } = response.data;
    dispatch({ type: REQUEST_SUCCESS, payload: token });
    alert("Login successful!");
    return "Login success"; 
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Login failed!");
  }
};

// Signup Action
export const signupUser = (email, password, resetPassword) => async (dispatch) => {
  dispatch({ type: REQUEST });
  try {
    const response = await axios.post("http://localhost:8080/user/signup", {
      email,
      password,
      resetPassword,
    });

    dispatch({ type: REQUEST_SUCCESS });
    alert(response.data.msg || "Signup successful!");
    dispatch(toggleForm()); 
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Signup failed!");
  }
};

// Delete Category Action
export const deleteCategory = (id) => async (dispatch) => {
  dispatch({ type: REQUEST });
  try {
    await axios.delete(`http://localhost:8080/category/${id}`);
    dispatch({ type: "DELETE_CATEGORY", payload: id });
    alert("Category deleted successfully!");
    // After deleting, refresh the categories
    dispatch(fetchCategories());
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Failed to delete category!");
  }
};

// Toggle Edit Category Panel Action
export const toggleEditCategoryPanel = (category = null) => ({
  type: "TOGGLE_EDIT_CATEGORY_PANEL",
  payload: category, 
});


// Toggle Edit SubCategory Panel Action
export const toggleEditSubCategoryPanel = (subCategory = null) => ({
  type: TOGGLE_EDIT_SUBCATEGORY_PANEL,
  payload: subCategory
});

// Update Category Action
export const updateCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_CATEGORY_REQUEST" });
    const response = await axios.put(`http://localhost:8080/category/${categoryData.id}`, categoryData); 
    dispatch({ type: "UPDATE_CATEGORY_SUCCESS", payload: response.data });
    // After updating, refresh the categories
    dispatch(fetchCategories());
  } catch (error) {
    dispatch({ type: "UPDATE_CATEGORY_FAILURE", payload: error.message });
  }
};

// Fetch SubCategories Actions
export const fetchSubCategories = () => async (dispatch) => {
  dispatch({ type: REQUEST });  
  try {
    const response = await axios.get("http://localhost:8080/subCategory");
    dispatch({ type: "FETCH_SUBCATEGORIES_SUCCESS", payload: response.data }); 
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Failed to fetch subcategories!");
  }
};

// Delete SubCategory Action
export const deleteSubCategory = (id) => async (dispatch) => {
  dispatch({ type: REQUEST });
  try {
    await axios.delete(`http://localhost:8080/subcategory/${id}`);
    dispatch({ type: "DELETE_SUBCATEGORY", payload: id });
    dispatch(fetchSubCategories());
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Failed to delete subcategory!");
  }
};

// Add SubCategory Action
export const addSubCategory = (subCategoryData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_SUBCATEGORY_REQUEST" });
    const response = await axios.post("http://localhost:8080/subCategory", subCategoryData);
    dispatch({ type: "ADD_SUBCATEGORY_SUCCESS", payload: response.data });
    dispatch(fetchSubCategories()); // Refresh subcategories after adding
  } catch (error) {
    console.error("Error adding subcategory:", error);
    dispatch({ type: "ADD_SUBCATEGORY_FAILURE", payload: error.message });
  }
};

export const updateSubCategory = (subCategoryData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_SUBCATEGORY_REQUEST" });
    const { id, ...updateData } = subCategoryData;
    console.log("Sending Update Data:", updateData); // Debugging
    const response = await axios.put(`http://localhost:8080/subCategory/${id}`, updateData);
    dispatch({ type: "UPDATE_SUBCATEGORY_SUCCESS", payload: response.data });
    dispatch(fetchSubCategories()); // Refresh subcategories after updating
  } catch (error) {
    console.error("Update Error:", error.response?.data || error.message);
    dispatch({ type: "UPDATE_SUBCATEGORY_FAILURE", payload: error.message });
  }
};

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: REQUEST });
  try {
    const response = await axios.get("http://localhost:8080/product");
    dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Failed to fetch products!");
  }
};

export const addProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_PRODUCT_REQUEST" });
    const response = await axios.post("http://localhost:8080/product", productData);
    dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: response.data });
    dispatch(fetchProducts()); // Refresh products after adding
    return Promise.resolve(); // Return a resolved promise after success
  } catch (error) {
    dispatch({ type: "ADD_PRODUCT_FAILURE", payload: error.message });
    return Promise.reject(error.message); // Reject the promise on failure
  }
};

export const updateProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PRODUCT_REQUEST" });
    console.log("Payload being sent:", productData); // Debugging
    const response = await axios.put(
      `http://localhost:8080/product/${productData.id}`,
      {
        ...productData,
        image: productData.image || null,
      }
    );
    dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: response.data });
    dispatch(fetchProducts()); // Refresh products
  } catch (error) {
    dispatch({ type: "UPDATE_PRODUCT_FAILURE", payload: error.message });
  }
};

// Delete Product Action
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: REQUEST });
  try {
    await axios.delete(`http://localhost:8080/product/${id}`);
    dispatch({ type: "DELETE_PRODUCT", payload: id });
    dispatch(fetchProducts()); // Refresh products after deletion
  } catch (error) {
    dispatch({ type: REQUEST_FAIL });
    alert(error.response?.data?.msg || "Failed to delete product!");
  }
};

// Toggle Add Product Panel Action
export const toggleAddProductPanel = () => ({
  type: TOGGLE_ADD_PRODUCT_PANEL,
});

// Toggle Edit Product Panel Action
export const toggleEditProductPanel = (product = null) => ({
  type: TOGGLE_EDIT_PRODUCT_PANEL,
  payload: product,
});

// Toggle Product Table Action
export const toggleProductTable = () => ({
  type: TOGGLE_PRODUCT_TABLE,
});