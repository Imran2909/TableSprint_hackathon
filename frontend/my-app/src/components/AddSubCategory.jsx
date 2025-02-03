import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/addCategory.module.css";
import {
  addSubCategory,
  fetchCategories,
  toggleSubCategoryTable,
} from "../redux/action";
import { LuImageUp } from "react-icons/lu";
import imageCompression from "browser-image-compression";
import Spinner from "./Spinner";

function AddSubCategory() {
  const dispatch = useDispatch();
  const categories = useSelector((store) => store.categories); // Fetch categories from Redux
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategorySequence, setSubCategorySequence] = useState("");
  const [categoryName, setCategoryName] = useState(""); // Selected category name
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const loading = useSelector((store) => store.isLoading);

  const [uniqueCategories, setUniqueCategories] = useState([]);

  useEffect(() => {
    console.log("Dispatching fetch categories...");
    dispatch(fetchCategories()); // This is just an example, replace it with your actual action
  }, [dispatch]);

  useEffect(() => {
    // Debugging: Log categories to check if they are correctly fetched
    console.log("Categories from Redux:", categories);

    if (categories && categories.length > 0) {
      // Filter out unique categories based on the categoryName
      const uniqueCategories = Array.from(
        new Set(categories.map((category) => category.categoryName))
      );
      console.log("Unique Categories:", uniqueCategories); // Debugging
      setUniqueCategories(uniqueCategories);
    }
  }, [categories]); // This will trigger when categories change

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
    dispatch(toggleSubCategoryTable());
  };

  const handleBacks = () => {
    console.log("Back button clicked"); // Debugging
    dispatch(toggleSubCategoryTable());
  };

  const handleSave = async () => {
    if (!subCategoryName || !subCategorySequence || !categoryName || !image) {
      alert("All fields are required.");
      return;
    }

    const subCategoryData = {
      subcategoryName: subCategoryName.trim(),
      sequence: subCategorySequence.trim(),
      categoryName: categoryName.trim(),
      image,
    };
    try {
      await dispatch(addSubCategory(subCategoryData));
      alert("Subcategory added successfully");
      window.location.href = "/Subcategory";
      dispatch(toggleSubCategoryTable());
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert("Failed to add subcategory. Check console for details.");
    }
  };

  const handleIconClick = () => {
    document.getElementById("imageUpload").click();
  };

  return (
    <div>
      {loading ? (
        <Spinner text="Please wait for some moment" />
      ) : (
        <div className={styles.addSubCategoryContainer}>
          <div className={styles.cheader}>
            <button onClick={handleBacks} className={styles.cbackButton}  >
              ←
            </button>
            <h1>Add Subcategory</h1>
          </div>

          <div className={styles.form}>
            <div className={styles.cform}>
              <div className={styles.ccategory}>
                <label>Category Name</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className={styles.selectSubCategory}
                >
                  <option value="">Select Category</option>
                  {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.name}>
                <label>Subcategory Name</label>
                <input
                  type="text"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  placeholder="Enter subcategory name"
                />
              </div>
              <div className={styles.sequence}>
                <label>Subcategory Sequence</label>
                <input
                  type="number"
                  value={subCategorySequence}
                  onChange={(e) => setSubCategorySequence(e.target.value)}
                  placeholder="Enter sequence"
                />
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
                      Upload Image <br /> upto 10MB
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
        </div>
      )}
    </div>
  );
}

export default AddSubCategory;
