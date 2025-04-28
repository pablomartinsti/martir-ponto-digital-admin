import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import { ProtectedRoute } from "./protectedRoute";

import ListarFuncionarios from "../pages/dashboard/listar";
import CriarFuncionario from "../pages/dashboard/criar/funcionario";
import CriarSubAdmin from "../pages/dashboard/criar/empresa";
import GereciarEscala from "../pages/dashboard/escala";
import RelatorioHoras from "../pages/dashboard/registro";
import RelatorioLogs from "../pages/dashboard/logs";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="criar-funcionario" element={<CriarFuncionario />} />
        <Route path="criar-empresa" element={<CriarSubAdmin />} />
        <Route path="listar-funcionarios" element={<ListarFuncionarios />} />
        <Route path="Relatorio-Logs" element={<RelatorioLogs />} />
        <Route path="gerenciar-escalas" element={<GereciarEscala />} />
        <Route path="relatorio-de-horas" element={<RelatorioHoras />} />
      </Route>
    </Routes>
  );
}
