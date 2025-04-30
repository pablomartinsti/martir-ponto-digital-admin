import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { formatarHorario, formatarDataCompleta } from "../../../utils/date";
import { isHoje } from "../../../utils/date";

import {
  Container,
  SelectFuncionario,
  CardResumo,
  Saldo,
  Assinatura,
  TableDesktop,
  TableMobile,
  FiltroWrapper,
} from "./styles";
import Button from "../../../Components/Button";
import ModalJustificativa from "../../../Components/ModalAbsence/";

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
  _id?: string;
  date: string;
  clockIn?: string;
  lunchStart?: string;
  lunchEnd?: string;
  clockOut?: string;
  workedHours: string;
  balance: string;
  status: string;
  justified?: boolean;
  description?: string;
}

function RegistroHoras() {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] =
    useState<Registro | null>(null);

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
        setFuncionarios(data.filter((f: Funcionario) => f.role === "employee"));
      } catch {
        toast.error("Erro ao carregar funcionários");
      }
    }
    carregarFuncionarios();
  }, []);

  const buscarRegistros = useCallback(async () => {
    const toastId = toast.loading("Buscando registros de ponto...");
    setLoading(true);
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

    const ano = mesSelecionado.getFullYear();
    const mes = mesSelecionado.getMonth() + 1;

    const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const fim = new Date(ano, mes, 0).toISOString().split("T")[0];

    try {
      const { data } = await api.get(
        `/time-records?period=month&startDate=${inicio}&endDate=${fim}&employeeId=${employeeId}`
      );

      setRegistros(data.records || []);
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
  const abrirJustificativaModal = (registro: Registro) => {
    setRegistroSelecionado(registro);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setRegistroSelecionado(null);
  };

  const aoJustificar = () => {
    buscarRegistros(); // atualiza os dados
  };

  const podeJustificar = [
    "jornada incompleta",
    "horas faltando",
    "falta justificada",
    "férias",
    "atestado médico",
    "falta injustificada",
    "folga concedida",
    "feriado",
  ];

  return (
    <Container>
      <FiltroWrapper>
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
          maxDate={new Date()}
        />
      </FiltroWrapper>

      {!loading && registros.length === 0 && employeeId && (
        <p className="text">
          Nenhum registro encontrado para o período selecionado.
        </p>
      )}

      {registros.length > 0 && (
        <>
          <Button
            style={{ width: "200px", margin: "1rem 0" }}
            onClick={() => window.print()}
          >
            Imprimir Registro
          </Button>

          <div>
            <h1>Relatório Mensal das Horas</h1>
            <CardResumo className="card-resumo">
              <h2>
                Funcionário:{" "}
                <strong>
                  {funcionarios.find((f) => f._id === employeeId)?.name}
                </strong>
              </h2>
              <h3>{mesSelecionado && nomesMeses[mesSelecionado.getMonth()]}</h3>
              <h4>
                Horas Positivas: <strong>{resumo.totalPositiveHours}</strong>
              </h4>
              <h4>
                Horas Negativas: <strong>{resumo.totalNegativeHours}</strong>
              </h4>
              <Saldo negativo={resumo.finalBalance.startsWith("-")}>
                Saldo: <strong>{resumo.finalBalance}</strong>
              </Saldo>
            </CardResumo>

            <TableDesktop>
              <thead>
                <tr>
                  <th className="data">Data</th>
                  <th className="th">Entrada</th>
                  <th className="th">Almoço</th>
                  <th className="th">Retorno</th>
                  <th className="th">Saída</th>
                  <th className="th">Horas</th>
                  <th className="th">Saldo</th>
                  <th id="ajuste" className="col-status">
                    Status
                  </th>
                  <th className="descricao">Descrição</th>
                  <th id="ajuste" className="col-status">
                    Ajuste
                  </th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.date}>
                    <td>
                      {registro.clockIn
                        ? formatarData(registro.clockIn)
                        : formatarData(registro.date)}
                    </td>
                    <td>
                      {registro.clockIn
                        ? formatarHorario(registro.clockIn)
                        : "-"}
                    </td>
                    <td>
                      {registro.lunchStart
                        ? formatarHorario(registro.lunchStart)
                        : "-"}
                    </td>
                    <td>
                      {registro.lunchEnd
                        ? formatarHorario(registro.lunchEnd)
                        : "-"}
                    </td>
                    <td>
                      {registro.clockOut
                        ? formatarHorario(registro.clockOut)
                        : "-"}
                    </td>
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
                    <td className="col-status">
                      <div>
                        <span> {registro.status}</span>
                      </div>
                    </td>
                    <td>
                      <div className="descricao-limitada">
                        <span>{registro.description}</span>
                      </div>
                    </td>
                    <td className="col-status">
                      {" "}
                      {podeJustificar.includes(registro.status.toLowerCase()) &&
                        !isHoje(registro.date) && (
                          <Button
                            style={{
                              height: 20,
                              marginTop: "4px",
                              padding: "2px 6px",
                              fontSize: "0.75rem",
                            }}
                            onClick={() => abrirJustificativaModal(registro)}
                          >
                            {registro.justified
                              ? "Editar justificativa"
                              : "Justificar"}
                          </Button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableDesktop>

            <TableMobile>
              {registros.map((registro) => (
                <div className="card" key={registro.date}>
                  <p>
                    <strong>Data:</strong>{" "}
                    {registro.clockIn
                      ? formatarData(registro.clockIn)
                      : formatarData(registro.date)}
                  </p>
                  <p>
                    <strong>Entrada:</strong>{" "}
                    {registro.clockIn ? formatarHorario(registro.clockIn) : "-"}
                  </p>
                  <p>
                    <strong>Início do Almoço:</strong>{" "}
                    {registro.lunchStart
                      ? formatarHorario(registro.lunchStart)
                      : "-"}
                  </p>
                  <p>
                    <strong>Fim do Almoço:</strong>{" "}
                    {registro.lunchEnd
                      ? formatarHorario(registro.lunchEnd)
                      : "-"}
                  </p>
                  <p>
                    <strong>Saída:</strong>{" "}
                    {registro.clockOut
                      ? formatarHorario(registro.clockOut)
                      : "-"}
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
                  <p>
                    <strong>Descrição:</strong> {registro.status}
                  </p>
                  {registro.justified && registro.description && (
                    <p>
                      <strong>Justificativa:</strong> {registro.description}
                    </p>
                  )}

                  {podeJustificar.includes(registro.status.toLowerCase()) &&
                    !isHoje(registro.date) && (
                      <Button
                        style={{
                          height: 20,
                          marginTop: "4px",
                          padding: "2px 6px",
                          fontSize: "0.75rem",
                        }}
                        onClick={() => abrirJustificativaModal(registro)}
                      >
                        {registro.justified
                          ? "Editar justificativa"
                          : "Justificar"}
                      </Button>
                    )}
                </div>
              ))}
            </TableMobile>

            <Assinatura>
              <p>
                ______________________________________________________________
              </p>
              <p>Assinatura do Funcionário</p>
            </Assinatura>
          </div>
        </>
      )}
      <ToastContainer />
      {registroSelecionado && (
        <ModalJustificativa
          isOpen={modalAberto}
          onClose={fecharModal}
          employeeId={employeeId}
          date={registroSelecionado.date}
          onJustified={aoJustificar}
        />
      )}
    </Container>
  );
}

export default RegistroHoras;
