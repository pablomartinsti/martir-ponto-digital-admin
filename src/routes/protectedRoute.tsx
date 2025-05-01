import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>Carregando...</p>
    );
  }

  if (!token || !user || (user.role !== "admin" && user.role !== "sub_admin")) {
    console.warn("Redirecionando por falta de token ou user admin");
    return <Navigate to="/" replace />;
  }

  return children;
}
