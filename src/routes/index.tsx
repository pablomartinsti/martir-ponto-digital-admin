import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dasboard";
import { ProtectedRoute } from "./protectedRoute";

import ListarFuncionarios from "../pages/dasboard/listar";
import CriarFuncionario from "../pages/dasboard/criar";
import GereciarEscala from "../pages/dasboard/escala";
import RelatorioHoras from "../pages/dasboard/registro";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="criar-funcionario" element={<CriarFuncionario />} />
        <Route path="listar-funcionarios" element={<ListarFuncionarios />} />
        <Route path="gerenciar-escalas" element={<GereciarEscala />} />
        <Route path="relatorio-de-horas" element={<RelatorioHoras />} />
      </Route>
    </Routes>
  );
}
