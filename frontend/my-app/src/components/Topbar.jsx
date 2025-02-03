import React from "react";
import styles from "./styles/topbar.module.css";

function Topbar({
  logo,
  title,
  buttonText,
  handleAddCategory,
  handleSearchChange,
  searchQuery, // Accept search query as a prop
}) {
  return (
    <div className={styles.topbarContainer}>
      <div className={styles.logoSection}>
        {/* Render the logo (icon) passed as a prop */}
        <div className={title==="Category"? styles.logo : title=="Sub Category" ? styles.subLogo: title==="Products"?styles.subProd:"" }>{logo}</div>
        <h1 className={
          title==="Category"?
          styles.title : title=="Sub Category" ? styles.subTitle: title=="Products"? styles.prodTitle:""
          }>{title}</h1>
      </div>
      <div className={styles.actionSection}>
        <input
          type="text"
          placeholder="Search"
          className={
            title==="Category"?
            styles.searchInput : title=="Sub Category" ? styles.searchInput2: title=="Products"? styles.prodInput:"" }
          value={searchQuery} // Bind the input value to the search query
          onChange={handleSearchChange} // Add search functionality
        />
        <button className={
          title==="Category"?
          styles.actionButton : title=="Sub Category" ? styles.actionButton2: title=="Products"? styles.actionButton3:""} onClick={handleAddCategory}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Topbar;
