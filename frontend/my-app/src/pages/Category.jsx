import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Topbar from "../components/Topbar";
import TableComponent from "../components/TableComponent";
import { TbCategory2 } from "react-icons/tb";
import styles from "./styles/dashboard.module.css";
import {
  toggleCategoryTable,
  fetchCategories,
  deleteCategory,
  toggleEditCategoryPanel,
} from "../redux/action";
import AddCategory from "../components/AddCategory";
import EditCategory from "../components/EditCategory";
import Spinner from "../components/Spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

function Category() {
  const dispatch = useDispatch();
  const addPanel = useSelector((store) => store.showAddCategoryPanel);
  const editPanel = useSelector((store) => store.showEditCategoryPanel);
  const selectedCategory = useSelector((store) => store.selectedCategory);
  const categories = useSelector((store) => store.categories);
  const loading = useSelector((store) => store.isLoading);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams(); // Hook to get and set search query
  const searchQueryFromUrl = searchParams.get("search") || ""; // Get search query from URL

  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl); // Set initial state based on URL search

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories; // No filter if search query is empty
    return categories.filter(
      (category) =>
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
    );
  }, [categories, searchQuery]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Category Name", accessor: "categoryName" },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={`/images/${value}`}
            alt="Category"
            className="w-16 h-16 object-cover"
          />
        ),
      },
      { Header: "Status", accessor: "status" },
      { Header: "Sequence", accessor: "sequence" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className={styles.actions}>
            <button
              onClick={() => dispatch(toggleEditCategoryPanel(row.original))}
              className={styles.editButton}
            >
              <FaRegEdit />
            </button>
            <button
              onClick={() => {
                setCategoryToDelete(row.original.id);
                setShowDeleteModal(true);
              }}
              className={styles.deleteButton}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ),
      },
    ],
    [dispatch]
  );

  const handleAddCategory = () => {
    dispatch(toggleCategoryTable());
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams({ search: query }); // Update the search query in the URL
  };

  return (
    <>
      <div className={styles.outr}>
        <Navbar />
        <div className={styles.cont}>
          <SideBar />
          <div className={styles.box}>
            <div className={styles.main}>
              {addPanel ? (
                <AddCategory />
              ) : editPanel && selectedCategory ? (
                <EditCategory categoryData={selectedCategory} />
              ) : (
                <>
                  {loading ? (
                    <Spinner text="Please wait while data is fetching" />
                  ) : (
                    <>
                      <Topbar
                        className={styles.catTop}
                        logo={<TbCategory2 />}
                        title="Category"
                        buttonText="Add Category"
                        handleAddCategory={handleAddCategory}
                        handleSearchChange={handleSearchChange} // Pass search change handler to Topbar
                        searchQuery={searchQuery} // Pass the search query to Topbar
                      />
                      <TableComponent
                        columns={columns}
                        data={filteredCategories} // Use filtered categories for display
                        isEmpty={filteredCategories.length === 0 ? true : false}
                        onDelete={(id) => {
                          setCategoryToDelete(id);
                          setShowDeleteModal(true);
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Do you really want to delete this item?</h3>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Category;
