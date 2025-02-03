import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Category from "../pages/Category";
import Subcategory from "../pages/Subcategory";
import Products from "../pages/Products";
import ResetPassword from "../pages/ResetPassword";
import { useSelector, useDispatch } from "react-redux";
 
function Allroutes() {
  const token = useSelector((store) => store.token);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Category" element={<Category />} />
      <Route path="/Subcategory" element={<Subcategory />} />
      <Route path="/Products" element={<Products />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="*" element={<h1>No routes</h1>} />
    </Routes>
  );
}

export default Allroutes;



