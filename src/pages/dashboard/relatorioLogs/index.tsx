import { useEffect, useState } from "react";
import { listCompanies } from "../../../services/companyService";
import { deleteEventLogs, listEventLogs } from "../../../services/eventLogService";
import { toast } from "react-toastify";

import { Company } from "../../../types/company";
import { EventLog } from "../../../types/eventLog";

export default function LogsPage() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Campos para EXCLUSÃO de logs
  const [deleteMonth, setDeleteMonth] = useState("");
  const [deleteYear, setDeleteYear] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const data = await listCompanies();
        setCompanies(data);
      } catch (err) {
        console.error("Erro ao buscar empresas:", err);
      }
    }

    fetchCompanies();
  }, []);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const params: Record<string, string> = {};

        if (selectedCompanyId) params.companyId = selectedCompanyId;
        if (selectedDate) {
          params.startDate = selectedDate;
          params.endDate = selectedDate;
        }

        const data = await listEventLogs(params);
        setLogs(data);
      } catch (err) {
        console.error("Erro ao buscar logs:", err);
      }
    }

    fetchLogs();
  }, [selectedCompanyId, selectedDate]);

  async function handleDeleteLogs() {
    if (!deleteMonth || !deleteYear) {
      toast.error("Preencha o mês e o ano para excluir.");
      return;
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir os logs do mês ${deleteMonth}/${deleteYear}?`
    );
    if (!confirmed) return;

    try {
      const response = await deleteEventLogs(deleteMonth, deleteYear);

      toast.success(response.message || "Logs excluídos com sucesso.");

      // Atualizar a listagem depois de excluir
      setLogs([]);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Erro ao excluir logs.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Relatório de Erros</h2>

      {/* FILTROS NORMAIS */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <div>
          <label htmlFor="empresa">Filtrar por empresa:</label>
          <select
            id="empresa"
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem", width: "300px" }}
          >
            <option value="">Todas as empresas</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name} - {company.cnpj}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="data">Filtrar por data:</label>
          <input
            id="data"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
          />
        </div>
      </div>

      {/* CAMPOS PARA EXCLUSÃO DE LOGS */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <label>Mês para excluir:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={deleteMonth}
            onChange={(e) => setDeleteMonth(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem", width: "100px" }}
          />
        </div>

        <div>
          <label>Ano para excluir:</label>
          <input
            type="number"
            min="2000"
            max="2100"
            value={deleteYear}
            onChange={(e) => setDeleteYear(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem", width: "100px" }}
          />
        </div>

        <button
          onClick={handleDeleteLogs}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Excluir Logs
        </button>
      </div>

      {/* TABELA DE LOGS */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
              <th style={{ padding: "0.5rem" }}>Usuário</th>
              <th style={{ padding: "0.5rem" }}>Empresa</th>
              <th style={{ padding: "0.5rem" }}>Rota</th>
              <th style={{ padding: "0.5rem" }}>Status</th>
              <th style={{ padding: "0.5rem" }}>Mensagem</th>
              <th style={{ padding: "0.5rem" }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={log._id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                }}
              >
                <td style={{ padding: "0.5rem" }}>{log.userName || "—"}</td>
                <td style={{ padding: "0.5rem" }}>{log.companyName || "—"}</td>
                <td style={{ padding: "0.5rem" }}>{log.route}</td>
                <td style={{ padding: "0.5rem", textTransform: "capitalize" }}>
                  {log.status}
                </td>
                <td
                  style={{
                    padding: "0.5rem",
                    maxWidth: "300px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {log.message}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  {new Date(log.createdAt).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
