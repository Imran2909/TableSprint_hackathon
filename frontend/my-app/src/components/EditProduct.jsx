import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
  toggleEditProductPanel,
  fetchCategories,
  fetchSubCategories,
} from "../redux/action";
import styles from "./styles/addProduct.module.css";
import imageCompression from "browser-image-compression";
import { LuImageUp } from "react-icons/lu";
import Spinner from "./Spinner";

const EditProduct = ({ productData }) => {
  const dispatch = useDispatch();
  const loading = useSelector((store) => store.isLoading);
  const categories = useSelector((store) => store.categories); // Fetch categories from Redux
  const subcategories = useSelector((store) => store.subCategories); // Fetch subcategories from Redux
  console.log("prods", productData);

  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    id: productData.id,
    productName: productData.name,
    categoryName: productData.category,
    subcategoryName: productData.subCategory,
    status: productData.status || "Active",
    image: productData.image || null,
    imagePreview: productData.image || null, // Directly use the Base64 string
  });

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  // Update unique categories when categories are fetched
  useEffect(() => {
    if (categories && categories.length > 0) {
      const uniqueCategories = Array.from(
        new Set(categories.map((category) => category.categoryName))
      );
      setUniqueCategories(uniqueCategories);
    }
  }, [categories]);

  // Update unique subcategories when subcategories are fetched
  useEffect(() => {
    if (subcategories && subcategories.length > 0) {
      const uniqueSubcategories = Array.from(
        new Set(subcategories.map((subcategory) => subcategory.subcategoryName))
      );
      setUniqueSubcategories(uniqueSubcategories);
    }
  }, [subcategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > 5 * 1024 * 1024) {
        alert("Image too large. Max 5MB allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      id: formData.id,
      productName: formData.productName, // Match backend field name
      categoryName: formData.categoryName, // Match backend field name
      subcategoryName: formData.subcategoryName, // Match backend field name
      status: formData.status,
      image: formData.image,
    };
    console.log("Payload being sent:", productData); // Debugging
    dispatch(updateProduct(productData));
    dispatch(toggleEditProductPanel());
  };

  return (
    <div className={styles.addCategoryContainer}>
      {loading ? (
        <Spinner text="Please wait while product is updating" />
      ) : (
        <>
          <div className={styles.header}>
            <button
              onClick={() => dispatch(toggleEditProductPanel())}
              className={styles.backButton}
            >
              ←
            </button>
            <h1>Edit Product</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.name}>
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.category}>
              <label>Category Name</label>
              <select
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.subcategory}>
              <label>Subcategory Name</label>
              <select
                name="subcategoryName"
                value={formData.subcategoryName}
                onChange={handleChange}
                required
              >
                <option value="">Select Subcategory</option>
                {uniqueSubcategories.map((subcategory, index) => (
                  <option key={index} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.status}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className={styles.imageUploadSection}>
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview} // Directly use the Base64 string
                  alt="Product Preview"
                  className={styles.imagePreview}
                />
              )}
              <div className={styles.uploadBut}>
                <label htmlFor="imageUpload" className={styles.iconLabel}>
                  <LuImageUp size={24} className={styles.icon} />
                  <p>
                    Upload Image <br /> up to 5MB
                  </p>
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={() => dispatch(toggleEditProductPanel())}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className={styles.saveButton}
              >
                Save
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EditProduct;
