import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/editSubCategory.module.css";
import { 
  updateSubCategory,
  toggleEditSubCategoryPanel,
  fetchCategories,
} from "../redux/action";
import imageCompression from "browser-image-compression";
import { LuImageUp } from "react-icons/lu";
import Spinner from "./Spinner";

const EditSubCategory = () => {
  const dispatch = useDispatch();
  const { selectedSubCategory } = useSelector((state) => state);
  const loading = useSelector((store) => store.isLoading);
  const categories = useSelector((store) => store.categories);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const [formData, setFormData] = useState({
    subCategoryName: "",
    categoryName: "",
    sequence: "",
    status: "Active",
    image: null,
    imagePreview: null,
  });

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Process unique categories
  useEffect(() => {
    if (categories && categories.length > 0) {
      const unique = Array.from(
        new Set(categories.map((category) => category.categoryName))
      );
      setUniqueCategories(unique);
    }
  }, [categories]);

  // Update formData when selectedSubCategory changes
  useEffect(() => {
    if (selectedSubCategory) {
      setFormData({
        subCategoryName: selectedSubCategory?.subcategoryName || "",
        categoryName: selectedSubCategory?.categoryName || "",
        sequence: selectedSubCategory?.sequence || "",
        status: selectedSubCategory?.status || "Active",
        image: selectedSubCategory?.image || null,
        imagePreview: selectedSubCategory?.image || null,
      });
    }
  }, [selectedSubCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        setFormData({
          ...formData,
          image: reader.result,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed.");
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.subCategoryName ||
      !formData.categoryName ||
      !formData.sequence ||
      !formData.image ||
      !formData.status
    ) {
      alert("All fields are required.");
      return;
    }

    const subCategoryData = {
      id: selectedSubCategory?.id,
      subcategoryName: formData.subCategoryName,
      categoryName: formData.categoryName,
      sequence: formData.sequence,
      status: formData.status,
      image: formData.image,
    };

    try {
      await dispatch(updateSubCategory(subCategoryData));
      alert("Sub Category updated successfully");
      window.location.href = "/Subcategory";
      dispatch(toggleEditSubCategoryPanel());
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert("Failed to add subcategory. Check console for details.");
    }
  };

  const handleCancel = () => {
    dispatch(toggleEditSubCategoryPanel());
  };

  return (
    <div>
      {loading ? (
        <Spinner text="Please wait while subcategory is updating" />
      ) : (
        <div className={styles.editSubCategoryContainer}>
          <div className={styles.header}>
            <button onClick={handleCancel} className={styles.backButton}>
              ←
            </button>
            <h1>Edit Subcategory</h1>
          </div>
          <div className={styles.form}>
            <div className={styles.inputs}>
              <div className={styles.name}>
                <label>Subcategory Name</label>
                <input
                  type="text"
                  name="subCategoryName"
                  value={formData.subCategoryName}
                  onChange={handleChange}
                  placeholder="Enter subcategory name"
                />
              </div>
              <div className={styles.category}>
                <label>Category Name</label>
                <select
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className={styles.selstatus}
                >
                  <option value="">Select Category</option>
                  {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.ssequence}>
                <label>Sequence</label>
                <input
                  type="number"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                  placeholder="Enter sequence"
                />
              </div> <br />
              <div className={styles.status}>
                <label>Status</label>
                <select
                  className={styles.selstatus}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className={styles.imageUploadSection}>
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              )}

              <div className={styles.uploadButton}>
                <label htmlFor="imageUpload" className={styles.iconLabel}>
                  <LuImageUp size={24} className={styles.icon} />
                  <p>
                    Upload Image <br /> up to 10MB
                  </p>
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={styles.saveButton}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubCategory;
