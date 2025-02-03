import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Topbar from "../components/Topbar";
import { MdProductionQuantityLimits } from "react-icons/md";
import styles from "./styles/dashboard.module.css";
import {
  toggleAddProductPanel,
  fetchProducts,
  deleteProduct,
  toggleEditProductPanel,
} from "../redux/action";
import AddProduct from "../components/AddProduct";
import EditProduct from "../components/EditProduct";
import Spinner from "../components/Spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuBox } from "react-icons/lu";
import ProductTableComponent from "../components/ProductTableComponent";

function Product() {
  const dispatch = useDispatch();
  const addPanel = useSelector((store) => store.showAddProductPanel);
  const editPanel = useSelector((store) => store.showEditProductPanel);
  const selectedProduct = useSelector((store) => store.selectedProduct);
  const products = useSelector((store) => store.products);
  const loading = useSelector((store) => store.isLoading);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryFromUrl = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Product Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      { Header: "Subcategory", accessor: "subCategory" },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={`/images/${value}`}
            alt="Product"
            className="w-16 h-16 object-cover"
          />
        ),
      },
      { Header: "Status", accessor: "status" },
      { Header: "Price", accessor: "price" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className={styles.actions}>
            <button
              onClick={() => dispatch(toggleEditProductPanel(row.original))}
              className={styles.editButton}
            >
              <FaRegEdit />
            </button>
            <button
              onClick={() => {
                setProductToDelete(row.original.id);
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

  const handleAddProduct = () => {
    dispatch(toggleAddProductPanel());
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams({ search: query });
  };

  // In Product.jsx
  const handleEdit = (product) => {
    dispatch(toggleEditProductPanel(product));
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
                <AddProduct />
              ) : editPanel && selectedProduct ? (
                <EditProduct productData={selectedProduct} />
              ) : (
                <>
                  {loading ? (
                    <Spinner text="Please wait while data is fetching" />
                  ) : (
                    <>
                      <Topbar
                        className={styles.prodTop}
                        logo={<LuBox />}
                        title="Products"
                        buttonText="Add Product"
                        handleAddCategory={handleAddProduct}
                        handleSearchChange={handleSearchChange}
                        searchQuery={searchQuery}
                      />
                      <ProductTableComponent
                        columns={columns}
                        data={filteredProducts}
                        onEdit={handleEdit} // Add this
                        onDelete={(id) => {
                          setProductToDelete(id);
                          setShowDeleteModal(true);
                        }}
                        isEmpty={filteredProducts.length === 0}
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
                  onClick={handleDeleteProduct}
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

export default Product;
