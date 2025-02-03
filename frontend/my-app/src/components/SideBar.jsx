import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { BiSolidRightArrow } from "react-icons/bi";
import { TbCategory2 } from "react-icons/tb";
import { FaList } from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { togglePage } from "../redux/action"; // Import the action
import styles from "./styles/sidebar.module.css";

function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const activePage = useSelector((state) => state.activePage); // Get the active page from Redux

  const arr = [
    { fsimg: <IoHomeOutline />, p: "Dashboard", lstimg: <BiSolidRightArrow /> },
    { fsimg: <TbCategory2 />, p: "Category", lstimg: <BiSolidRightArrow /> },
    { fsimg: <FaList />, p: "Subcategory", lstimg: <BiSolidRightArrow /> },
    { fsimg: <LuBox />, p: "Products", lstimg: <BiSolidRightArrow /> },
  ];

  const handleNavClick = (page) => {
    dispatch(togglePage(page)); // Update the active page in Redux
    navigate(`/${page}`); // Navigate using React Router
  };

  // Sync activePage with the current location (route)
  useEffect(() => {
    const path = location.pathname.split("/")[1]; // Extract the page from the URL (e.g., "category" from "/category")
    if (path) {
      dispatch(togglePage(path)); // Update active page in Redux based on the URL path
    }
  }, [location.pathname, dispatch]);

  return (
    <div>
      <div className={styles.box}>
        <div className={styles.blocks}>
          {arr.map((el, index) => (
            <div
              key={index}
              onClick={() => handleNavClick(el.p)} // Call handleNavClick on click
              className={`${styles.block} ${
                activePage === el.p ? styles.active : ""
              }`}
            >
              {el.fsimg}
              <p>{el.p}</p>
              {el.lstimg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
