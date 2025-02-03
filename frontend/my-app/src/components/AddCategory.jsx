import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/addCategory.module.css";
import { addCategory, toggleCategoryTable } from "../redux/action";
import { LuImageUp } from "react-icons/lu";
import imageCompression from "browser-image-compression";
import Spinner from "./Spinner";

function AddCategory() { 
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [categorySequence, setCategorySequence] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const loading = useSelector((store) => store.isLoading);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }


    try {
      // Define compression options
      const options = {
        maxSizeMB: 1, // Compress to a maximum of 1 MB
        maxWidthOrHeight: 1024, // Resize to a maximum dimension of 1024px
        useWebWorker: true, // Use a web worker for faster compression
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Check if the compressed file exceeds the backend limit
      if (compressedFile.size > 10 * 1024 * 1024) {
        alert(
          "Compressed file size exceeds 10MB. Please upload a smaller image."
        );
        return;
      }

      // Convert the compressed image to a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64-encoded string
        setImagePreview(reader.result); // For preview purposes
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing the image:", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  const handleCancel = () => {
    dispatch(toggleCategoryTable());
  };

  const handleSave = () => {
    if (!categoryName || !categorySequence || !image) {
      alert("All fields are required.");
      return;
    }

    const categoryData = {
      categoryName,
      sequence: categorySequence,
      image,
    };

    dispatch(addCategory(categoryData)).then(()=>{
      alert("Category added successfully")
    })
    dispatch(toggleCategoryTable());
  };

  // Trigger the file input click when the icon is clicked
  const handleIconClick = () => {
    document.getElementById("imageUpload").click();
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
            <h1>Add Category</h1>
          </div>
          <div className={styles.form}>
            <div className={styles.name}>
              <label>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className={styles.sequence}>
              <label>Category Sequence</label>
              <input
                type="number"
                value={categorySequence}
                onChange={(e) => setCategorySequence(e.target.value)}
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
                    Upload Image <br /> upto 10MB{" "}
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

export default AddCategory;



