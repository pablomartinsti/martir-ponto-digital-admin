import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { formatarHorario, formatarDataCompleta } from "../../../utils/date";

import {
  Container,
  SelectFuncionario,
  CardResumo,
  Saldo,
  Assinatura,
  TableDesktop,
  TableMobile,
} from "./styles";
import Button from "../../../Components/Button";

// Nomes dos meses para exibição
const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
interface Funcionario {
  _id: string;
  name: string;
  role: string;
}

interface Registro {
  _id: string;
  clockIn: string;
  lunchStart?: string;
  lunchEnd?: string;
  clockOut?: string;
  workedHours: string;
  balance: string;
}

function RegistroHoras() {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [resumo, setResumo] = useState({
    totalPositiveHours: "00:00:00",
    totalNegativeHours: "00:00:00",
    finalBalance: "00:00:00",
  });
  const [mesSelecionado, setMesSelecionado] = useState<Date | null>(null);

  useEffect(() => {
    async function carregarFuncionarios() {
      try {
        const { data } = await api.get("/employees?filter=active");
        setFuncionarios(
          (data as Funcionario[]).filter((f) => f.role !== "admin")
        );
      } catch {
        toast.error("Erro ao carregar funcionários");
      }
    }
    carregarFuncionarios();
  }, []);

  const buscarRegistros = useCallback(async () => {
    // Mostra o toast de loading imediatamente
    const toastId = toast.loading("Buscando registros de ponto...");

    setLoading(true); // Estado local (caso esteja usando para exibir spinner)
    setRegistros([]);
    setResumo({
      totalPositiveHours: "00:00:00",
      totalNegativeHours: "00:00:00",
      finalBalance: "00:00:00",
    });

    if (!employeeId || !mesSelecionado) {
      toast.dismiss(toastId);
      return;
    }

    if (!mesSelecionado) {
      toast.dismiss(toastId);
      return;
    }

    const ano = mesSelecionado.getFullYear();
    const mes = mesSelecionado.getMonth() + 1;

    const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

    try {
      const { data } = await api.get(
        `/time-records?period=month&startDate=${inicio}&endDate=${fim}&employeeId=${employeeId}`
      );

      setRegistros(data.results?.[0]?.records || []);
      setResumo({
        totalPositiveHours: data.totalPositiveHours || "00:00:00",
        totalNegativeHours: data.totalNegativeHours || "00:00:00",
        finalBalance: data.finalBalance || "00:00:00",
      });

      toast.update(toastId, {
        render: "Registros carregados com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.update(toastId, {
        render: "Funcionário sem registros para este período.",
        type: "warning",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, mesSelecionado]);

  useEffect(() => {
    buscarRegistros();
  }, [buscarRegistros]);

  const formatarData = (dataIso: string) => formatarDataCompleta(dataIso);

  return (
    <Container>
      {/* Campos de filtro (na tela) */}
      <SelectFuncionario
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      >
        <option value="">Selecione um funcionário</option>
        {funcionarios.map((f) => (
          <option key={f._id} value={f._id}>
            {f.name}
          </option>
        ))}
      </SelectFuncionario>

      <DatePicker
        selected={mesSelecionado}
        onChange={(date) => setMesSelecionado(date)}
        dateFormat="MMMM 'de' yyyy"
        showMonthYearPicker
        locale={ptBR}
        placeholderText="Selecione o mês"
        className="input-mes"
        maxDate={new Date()} // 🔒 bloqueia meses após o atual
      />

      {/* Mensagem de ausência de registros */}
      {!loading && registros.length === 0 && employeeId && (
        <p
          style={{ marginTop: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          Nenhum registro encontrado para o período selecionado.
        </p>
      )}

      {registros.length > 0 && (
        <>
          {/* Botão de impressão */}
          <Button
            style={{ width: "200px", margin: "1rem 0" }}
            onClick={() => window.print()}
          >
            Imprimir Registro
          </Button>

          {/* Conteúdo que será impresso */}
          <div id="print-area">
            <h1>Relatório Mensal das Horas</h1>
            <CardResumo className="card-resumo">
              {/* Informações básicas */}
              <h2>
                Funcionário:{" "}
                <strong>
                  {funcionarios.find((f) => f._id === employeeId)?.name}
                </strong>
              </h2>

              <h3>{mesSelecionado && nomesMeses[mesSelecionado.getMonth()]}</h3>

              {/* Resumo de horas */}
              <h4>
                Horas Positivas: <strong>{resumo.totalPositiveHours} </strong>{" "}
              </h4>
              <h4>
                Horas Negativas: <strong>{resumo.totalNegativeHours} </strong>{" "}
              </h4>
              <Saldo negativo={resumo.finalBalance.startsWith("-")}>
                Saldo: <strong>{resumo.finalBalance} </strong>
              </Saldo>
            </CardResumo>

            {/* Tabela compacta com os registros */}
            {/* Tabela para telas grandes */}
            <TableDesktop>
              <thead>
                <tr>
                  <th style={{ width: 300 }}>Data</th>
                  <th>Entrada</th>
                  <th>Almoço</th>
                  <th>Retorno</th>
                  <th>Saída</th>
                  <th>Horas</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro._id}>
                    <td>{formatarData(registro.clockIn)}</td>
                    <td>{formatarHorario(registro.clockIn)}</td>
                    <td>{formatarHorario(registro.lunchStart)}</td>
                    <td>{formatarHorario(registro.lunchEnd)}</td>
                    <td>{formatarHorario(registro.clockOut)}</td>
                    <td>{registro.workedHours}</td>
                    <td
                      className={
                        registro.balance?.startsWith("-")
                          ? "saldo-negativo"
                          : "saldo-positivo"
                      }
                    >
                      {registro.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableDesktop>

            {/* Cards para mobile */}
            <TableMobile>
              {registros.map((registro) => (
                <div className="card" key={registro._id}>
                  <p>
                    <strong>Data:</strong> {formatarData(registro.clockIn)}
                  </p>
                  <p>
                    <strong>Entrada:</strong>{" "}
                    {formatarHorario(registro.clockIn)}
                  </p>
                  <p>
                    <strong>Almoço:</strong>{" "}
                    {formatarHorario(registro.lunchStart)}
                  </p>
                  <p>
                    <strong>Retorno:</strong>{" "}
                    {formatarHorario(registro.lunchEnd)}
                  </p>
                  <p>
                    <strong>Saída:</strong> {formatarHorario(registro.clockOut)}
                  </p>
                  <p>
                    <strong>Horas:</strong> {registro.workedHours}
                  </p>
                  <p
                    className={
                      registro.balance?.startsWith("-")
                        ? "saldo-negativo"
                        : "saldo-positivo"
                    }
                  >
                    <strong>Saldo:</strong> {registro.balance}
                  </p>
                </div>
              ))}
            </TableMobile>

            {/* Linha para assinatura */}
            <Assinatura className="assinatura">
              <p>
                ______________________________________________________________
              </p>
              <p>Assinatura do Funcionário</p>
              <p>{funcionarios.find((f) => f._id === employeeId)?.name}</p>
            </Assinatura>
          </div>
        </>
      )}
      <ToastContainer />
    </Container>
  );
}

export default RegistroHoras;
