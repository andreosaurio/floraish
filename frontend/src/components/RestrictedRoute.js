import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const RestrictedRoute = () => {
  const { userInfo } = useSelector((state) => state.authorization);
  const location = useLocation();

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default RestrictedRoute;