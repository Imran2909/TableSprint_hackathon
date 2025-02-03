import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/editCategory.module.css";
import { updateCategory, toggleEditCategoryPanel } from "../redux/action";
import imageCompression from "browser-image-compression";
import { LuImageUp } from "react-icons/lu";
import Spinner from "./Spinner";

const EditCategory = () => {
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state) => state);
  const loading = useSelector((store) => store.isLoading);
console.log(selectedCategory)
  const [formData, setFormData] = useState({
    categoryName: selectedCategory?.categoryName || "",
    categorySequence: selectedCategory?.sequence || "",
    status: selectedCategory?.status || "Active",
    image: selectedCategory?.image || null,
    imagePreview: selectedCategory?.image || null,
  });

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

  const handleSubmit = () => {
    if (
      !formData.categoryName ||
      !formData.categorySequence ||
      !formData.image ||
      !formData.status
    ) {
      alert("All fields are required.");
      return;
    }

    const categoryData = {
      id: selectedCategory.id,
      categoryName: formData.categoryName,
      sequence: formData.categorySequence,
      image: formData.image,
      status: formData.status,
    };

    dispatch(updateCategory(categoryData));
  };

  const handleCancel = () => {
    dispatch(toggleEditCategoryPanel());
  };

  return (
    <div>
      {loading ? (
        <Spinner text="Please wait while category is uploading" />
      ) : (
        <div className={styles.editCategoryContainer}>
          <div className={styles.header}>
            <button onClick={handleCancel} className={styles.backButton}>
              ←
            </button>
            <h1>Edit Category</h1>
          </div>
          <div className={styles.form}>
            <div className={styles.inputs}>
              <div className={styles.name}>
                <label>Category Name</label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="Enter category name"
                />
              </div>
              <div className={styles.sequence}>
                <label>Category Sequence</label>
                <input
                  type="number"
                  name="categorySequence"
                  value={formData.categorySequence}
                  onChange={handleChange}
                  placeholder="Enter sequence"
                />
              </div>
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
                    Upload Image <br /> up to 10MB{" "}
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

export default EditCategory;
