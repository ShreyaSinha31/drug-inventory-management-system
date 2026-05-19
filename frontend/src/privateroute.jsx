import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth") === "true"; // Check if user is logged in
  return isAuth ? children : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
