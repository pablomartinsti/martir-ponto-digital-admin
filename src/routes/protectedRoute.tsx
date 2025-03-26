// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
