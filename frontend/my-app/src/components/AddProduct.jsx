import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/addProduct.module.css"; // You can reuse or adjust styles
import {
  addProduct,
  fetchCategories,
  fetchSubCategories, 
  toggleProductTable,
} from "../redux/action";
import { LuImageUp } from "react-icons/lu";
import imageCompression from "browser-image-compression";
import Spinner from "./Spinner";

function AddProduct() {
  const dispatch = useDispatch();
  const categories = useSelector((store) => store.categories); // Fetch categories from Redux
  const subcategories = useSelector((store) => store.subCategories); // Fetch subcategories from Redux
  const loading = useSelector((store) => store.isLoading);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(""); // Category selection
  const [subcategory, setSubcategory] = useState(""); // Subcategory selection
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);

  useEffect(() => {
    console.log("Dispatching fetch categories...");
    dispatch(fetchCategories()); // Fetch categories
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const uniqueCategories = Array.from(
        new Set(categories.map((category) => category.categoryName))
      );
      setUniqueCategories(uniqueCategories);
    }
  }, [categories]);

  useEffect(() => {
    if (subcategories && subcategories.length > 0) {
      const uniqueSubcategories = Array.from(
        new Set(subcategories.map((subcategory) => subcategory.subcategoryName))
      );
      setUniqueSubcategories(uniqueSubcategories);
    }
  }, [subcategories]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      if (compressedFile.size > 10 * 1024 * 1024) {
        alert(
          "Compressed file size exceeds 10MB. Please upload a smaller image."
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing the image:", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  const handleCancel = () => {
    dispatch(toggleProductTable()); 
  };

  const handleSave = async () => {
    if (!productName || !category || !subcategory || !image) {
      alert("All fields are required.");
      return;
    }
  
    const productData = {
      productName: productName.trim(),
      categoryName: category.trim(),
      subcategoryName: subcategory.trim(),
      imageBase64: image, // Make sure it's base64
      status: status,     // Add status
      id: Math.floor(Math.random() * 9000) + 1000 // Generate random ID
    };
  
    try {
      await dispatch(addProduct(productData));
      alert("Product added successfully");
      window.location.href = "/Products";
      dispatch(toggleProductTable());
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check console for details.");
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner text="Please wait for some moment" />
      ) : (
        <div className={styles.addCategoryContainer}>
          <div className={styles.header}>
            <button onClick={handleCancel} className={styles.backButton}>
              ←
            </button>
            <h1>Add Product</h1>
          </div>
          <div className={styles.form}>
            <div className={styles.name}>
              <label>Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className={styles.category}>
              <label>Category Name</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.selectCategory}
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
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className={styles.selectSubCategory}
              >
                <option value="">Select Subcategory</option>
                {uniqueSubcategories.map((subcategory, index) => {
                  return (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.status}>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.selectStatus}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className={styles.img}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              )}
              <div className={styles.uploadButton}>
                <label htmlFor="imageUpload" className={styles.iconLabel}>
                  <LuImageUp
                    size={24}
                    onClick={handleImageUpload}
                    className={styles.icon}
                  />
                  <p>
                    Upload Image <br /> up to 10MB
                  </p>
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;
