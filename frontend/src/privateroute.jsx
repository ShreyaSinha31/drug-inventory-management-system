import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");
  const isAuthenticated = Boolean(token || userInfo);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

