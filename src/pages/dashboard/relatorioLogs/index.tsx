import { useEffect, useState } from "react";
import api from "../../../services/api";

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

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Relatório de Erros</h2>

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
