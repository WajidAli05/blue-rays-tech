import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Spin } from "antd";

const PrivateRoutes = () => {
  const { admin, authLoading } = useContext(AuthContext);

  if (authLoading) return <div className="loading-div">Loading...</div>; // Optional loading state

  return admin ? <Outlet /> : <Navigate to="/ad-lg" />;
};

export default PrivateRoutes;