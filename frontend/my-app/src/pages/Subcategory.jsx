import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Topbar from "../components/Topbar";
import SubCategoryTableComponent from "../components/SubCategoryTableComponent";
import { FaRegEdit } from "react-icons/fa";
import styles from "./styles/dashboard.module.css";
import {
  toggleSubCategoryTable,
  fetchSubCategories,
  deleteSubCategory,
  toggleEditSubCategoryPanel,
} from "../redux/action";
import AddSubCategory from "../components/AddSubCategory.jsx";
import EditSubCategory from "../components/EditSubCategory.jsx";
import Spinner from "../components/Spinner";
import { FaList } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
 
function Subcategory() {
  const dispatch = useDispatch();
  const { categoryName, subCategoryName } = useParams();
  const addPanel = useSelector((store) => store.showAddSubCategoryPanel);
  const editPanel = useSelector((store) => store.showEditSubCategoryPanel);
  const selectedSubCategory = useSelector((store) => store.selectedSubCategory);
  const subCategories = useSelector((store) => store.subCategories);
  const loading = useSelector((store) => store.isLoading);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  // Search params setup
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryFromUrl = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  // Updated filtering logic to match Category component's behavior
  const filteredSubCategories = useMemo(() => {
    if (!searchQuery) return subCategories;
    
    return subCategories.filter((subCategory) => {
      const searchTerms = [
        subCategory?.subcategoryName,
        subCategory?.categoryName,
        subCategory?.status,
        subCategory?.sequence?.toString()
      ].map(term => (term || "").toLowerCase());
      
      const query = searchQuery.toLowerCase();
      
      return searchTerms.some(term => term.includes(query));
    });
  }, [subCategories, searchQuery]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Subcategory Name", accessor: "subcategoryName" },
      { Header: "Category Name", accessor: "categoryName" },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={`/images/${value}`}
            alt="SubCategory"
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
              onClick={() => dispatch(toggleEditSubCategoryPanel(row.original))}
              className={styles.editButton}
            >
              <FaRegEdit />
            </button>
            <button
              onClick={() => {
                setSubCategoryToDelete(row.original.id);
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

  const handleAddSubCategory = () => {
    dispatch(toggleSubCategoryTable());
  };

  const handleDeleteSubCategory = () => {
    if (subCategoryToDelete) {
      dispatch(deleteSubCategory(subCategoryToDelete));
      setShowDeleteModal(false);
      setSubCategoryToDelete(null);
    }
  };

  // Updated search handler to match Category component
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams(query ? { search: query } : {});
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
                <AddSubCategory />
              ) : editPanel && selectedSubCategory ? (
                <EditSubCategory subCategoryData={selectedSubCategory} />
              ) : (
                <>
                  {loading ? (
                    <Spinner text="Please wait while data is fetching" />
                  ) : (
                    <>
                      <Topbar
                        className={styles.catTop}
                        logo={<FaList />}
                        title="Sub Category"
                        buttonText="Add Sub Category"
                        handleAddCategory={handleAddSubCategory}
                        handleSearchChange={handleSearchChange}
                        searchQuery={searchQuery}
                      />

                      <SubCategoryTableComponent
                        columns={columns}
                        data={filteredSubCategories}
                        isEmpty={filteredSubCategories.length === 0}
                        onEdit={(data) => dispatch(toggleEditSubCategoryPanel(data))}
                        onDelete={(id) => {
                          setSubCategoryToDelete(id);
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
                  onClick={handleDeleteSubCategory}
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

export default Subcategory;