import {
  TOGGLE_FORM,
  REQUEST,
  REQUEST_FAIL,
  REQUEST_SUCCESS,
  TOGGLE_PAGE,
  TOGGLE_CATEGORY_TABLE,
  TOGGLE_SUBCATEGORY_TABLE,
  TOGGLE_EDIT_SUBCATEGORY_PANEL,
  TOGGLE_PRODUCT_TABLE,
  TOGGLE_EDIT_PRODUCT_PANEL,
  TOGGLE_ADD_PRODUCT_PANEL,
  LOGOUT,
} from "./actionTypes";

const initialState = {
  showLogin: true,
  isLoading: false,
  isError: false,
  token: null,
  activePage: "Dashboard",
  showAddCategoryPanel: false,
  showEditCategoryPanel: false,
  categories: [], // Store categories
  subCategories: [], // Store subcategories
  showAddSubCategoryPanel: false,
  showEditSubCategoryPanel: false,
  selectedSubCategory: null,
  products: [], // Store products
  showAddProductPanel: false, // Panel state for Add Product
  showEditProductPanel: false, // Panel state for Edit Product
  selectedProduct: null, // Selected product for editing
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, token: null };
    case TOGGLE_FORM:
      return { ...state, showLogin: !state.showLogin };
    case REQUEST:
      return { ...state, isLoading: true, isError: false };
    case REQUEST_SUCCESS:
      return { ...state, isLoading: false, token: action.payload || null };
    case REQUEST_FAIL:
      return { ...state, isLoading: false, isError: true };
    case TOGGLE_PAGE:
      return { ...state, activePage: action.payload };
    case TOGGLE_CATEGORY_TABLE:
      return { ...state, showAddCategoryPanel: !state.showAddCategoryPanel };

    case TOGGLE_EDIT_SUBCATEGORY_PANEL:
      return {
        ...state,
        showEditSubCategoryPanel: !state.showEditSubCategoryPanel,
        selectedSubCategory: action.payload,
      };

    // Category actions (same as previous)
    case "FETCH_CATEGORIES_SUCCESS":
      return { ...state, isLoading: false, categories: action.payload };
    case "ADD_CATEGORY_REQUEST":
      return { ...state, isLoading: true };
    case "ADD_CATEGORY_SUCCESS":
      return { ...state, isLoading: false, showAddCategoryPanel: false };
    case "ADD_CATEGORY_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "DELETE_CATEGORY":
      return {
        ...state,
        isLoading: false,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
      };
    case "TOGGLE_EDIT_CATEGORY_PANEL":
      return {
        ...state,
        showEditCategoryPanel: !state.showEditCategoryPanel,
        selectedCategory: action.payload,
      };
    case "UPDATE_CATEGORY_REQUEST":
      return { ...state, isLoading: true };
    case "UPDATE_CATEGORY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        showEditCategoryPanel: false,
      };
    case "UPDATE_CATEGORY_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    // Subcategory actions (same as previous)
    case "FETCH_SUBCATEGORIES_SUCCESS":
      return { ...state, isLoading: false, subCategories: action.payload };
    case "DELETE_SUBCATEGORY":
      return {
        ...state,
        isLoading: false,
        subCategories: state.subCategories.filter(
          (subCategory) => subCategory.id !== action.payload
        ),
      };
    case "ADD_SUBCATEGORY_REQUEST":
      return { ...state, isLoading: true };
    case "ADD_SUBCATEGORY_SUCCESS":
      return { ...state, isLoading: false, showAddSubCategoryPanel: false };
    case "ADD_SUBCATEGORY_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "UPDATE_SUBCATEGORY_REQUEST":
      return { ...state, isLoading: true };
    case "UPDATE_SUBCATEGORY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        subCategories: state.subCategories.map((subCategory) =>
          subCategory.id === action.payload.id
            ? { ...subCategory, ...action.payload }
            : subCategory
        ),
        showEditSubCategoryPanel: false,
      };
    case "UPDATE_SUBCATEGORY_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    // Product actions
    case "FETCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        products: action.payload.map((product) => ({
          ...product,
          name: product.productName,
          subCategory: product.subcategoryName,
          category: product.categoryName,
        })),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        isLoading: false,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };
    case "ADD_PRODUCT_REQUEST":
      return { ...state, isLoading: true };
    case "ADD_PRODUCT_SUCCESS":
      return { ...state, isLoading: false, showAddProductPanel: false };
    case "ADD_PRODUCT_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    case "UPDATE_PRODUCT_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_PRODUCT_SUCCESS":
      console.log("Updated product in state:", action.payload); // Debugging
      return { ...state, loading: false, products: action.payload };
    case "UPDATE_PRODUCT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // Toggle Product Panel actions
    case TOGGLE_ADD_PRODUCT_PANEL:
      return { ...state, showAddProductPanel: !state.showAddProductPanel };
    case TOGGLE_EDIT_PRODUCT_PANEL:
      return {
        ...state,
        showEditProductPanel: !state.showEditProductPanel,
        selectedProduct: action.payload,
      };
    case TOGGLE_PRODUCT_TABLE:
      return { ...state, showAddProductPanel: !state.showAddProductPanel };

    case TOGGLE_SUBCATEGORY_TABLE:
      return {
        ...state,
        showAddSubCategoryPanel: !state.showAddSubCategoryPanel,
      };

    default:
      return state;
  }
};
