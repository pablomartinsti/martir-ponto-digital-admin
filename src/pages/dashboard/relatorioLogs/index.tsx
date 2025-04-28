import { useEffect, useState } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface Log {
  _id: string;
  userName: string;
  companyName: string;
  companyId: string;
  route: string;
  method: string;
  action: string;
  status: string;
  message: string;
  createdAt: string;
  device?: string;
}

interface Company {
  _id: string;
  name: string;
  cnpj: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Campos para EXCLUSÃO de logs
  const [deleteMonth, setDeleteMonth] = useState("");
  const [deleteYear, setDeleteYear] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await api.get("/companies");
        setCompanies(res.data);
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

        const res = await api.get("/event-logs", { params });
        setLogs(res.data);
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
      const response = await api.delete("/delete-event", {
        params: {
          month: deleteMonth,
          year: deleteYear,
        },
      });

      toast.success(response.data.message || "Logs excluídos com sucesso.");

      // Atualizar a listagem depois de excluir
      setLogs([]);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;

      console.error(err);

      toast.error(err.response?.data?.error || "Erro ao excluir logs.");
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
