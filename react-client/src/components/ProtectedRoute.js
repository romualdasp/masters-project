import React from 'react'
import { Navigate, useLocation } from "react-router-dom"
import useAuth from './useAuth';

export default function ProtectedRoute({ children }) {
  let [auth] = useAuth();
  let location = useLocation();
  
  return (
    auth ?
      children :
      <Navigate to="/login" state={{ from: location }} />
  );
}
