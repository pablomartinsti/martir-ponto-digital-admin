import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../services/api";
import Button from "../../../Components/Button";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Title,
  Form,
  Grid,
  InputBox,
  Label,
  InputStyled,
  Select,
  Text,
  List,
} from "./styles";

// Lista unificada com dados dos dias da semana
const diasDaSemana = [
  { key: "Monday", short: "Seg", full: "Segunda" },
  { key: "Tuesday", short: "Ter", full: "Terça" },
  { key: "Wednesday", short: "Qua", full: "Quarta" },
  { key: "Thursday", short: "Qui", full: "Quinta" },
  { key: "Friday", short: "Sex", full: "Sexta" },
  { key: "Saturday", short: "Sáb", full: "Sábado" },
  { key: "Sunday", short: "Dom", full: "Domingo" },
];

// Converte string "HH:MM" para número decimal (ex: "08:30" -> 8.5)
function converterHoraParaDecimal(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return h + m / 60;
}

// Converte número decimal para string "HH:MM" (ex: 8.5 -> "08:30")
function formatarDecimalParaHora(decimal: number): string {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
    2,
    "0"
  )}`;
}

function GerenciarEscala() {
  // Armazena horas digitadas por dia da semana
  const [horas, setHoras] = useState<{ [key: string]: string }>({});
  // ID do funcionário selecionado
  const [employeeId, setEmployeeId] = useState("");
  // Escala retornada da API (modo visualização)
  const [escala, setEscala] = useState<
    { day: string; dailyHours: number }[] | null
  >(null);
  // Modo atual: ver ou editar
  const [modo, setModo] = useState<"ver" | "editar" | "">("");
  // Lista de funcionários ativos (não admins)
  const [funcionarios, setFuncionarios] = useState<
    { _id: string; name: string }[]
  >([]);

  const location = useLocation();

  // Identifica o funcionário selecionado pelo ID
  const funcionarioSelecionado = funcionarios.find((f) => f._id === employeeId);

  // Reseta os estados ao mudar de rota
  useEffect(() => {
    setEmployeeId("");
    setModo("");
    setHoras({});
  }, [location.key]);

  // Carrega funcionários ativos ao montar o componente
  useEffect(() => {
    async function carregarFuncionarios() {
      try {
        const { data } = await api.get("/employees?filter=active");
        const apenasFuncionarios = data.filter(
          (func: { role: string }) => func.role !== "admin"
        );
        setFuncionarios(apenasFuncionarios);
      } catch {
        toast.error("Erro ao carregar funcionários.");
      }
    }

    carregarFuncionarios();
  }, []);

  // Busca escala do funcionário no modo visualização
  useEffect(() => {
    if (modo === "ver" && employeeId) {
      async function buscarEscala() {
        try {
          const { data } = await api.get(`/work-schedules/${employeeId}`);
          setEscala(data.customDays);
        } catch {
          setEscala([]); // Não encontrou escala
        }
      }
      buscarEscala();
    }
  }, [modo, employeeId]);

  // Atualiza as horas de um determinado dia
  const handleChange = (day: string, value: string) => {
    setHoras((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  // Envia a escala preenchida para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se todos os dias foram preenchidos
    const todosPreenchidos = diasDaSemana.every((dia) => horas[dia.key]);
    if (!todosPreenchidos) {
      toast.error("Preencha todos os dias da escala antes de salvar.");
      return;
    }

    // Valida se todas as horas estão no formato HH:MM
    const algumInvalido = Object.values(horas).some(
      (hora) => !/^\d{1,2}:\d{2}$/.test(hora)
    );
    if (algumInvalido) {
      toast.error("Formato inválido. Use HH:MM (ex: 08:00)");
      return;
    }

    // Monta o payload com os dados da escala
    const payload = {
      employeeId,
      customDays: diasDaSemana.map((dia) => ({
        day: dia.key,
        dailyHours: converterHoraParaDecimal(horas[dia.key] || "0:00"),
      })),
    };

    try {
      await toast.promise(api.post("/work-schedules", payload), {
        pending: "Salvando escala...",
        success: "Escala salva com sucesso!",
        error: "Erro ao salvar escala.",
      });
    } catch {
      toast.error("Erro ao enviar os dados.");
    }
  };

  return (
    <Container>
      {/* Título da página */}
      <Title>Gerenciar Escala</Title>

      {/* Nome do funcionário selecionado */}
      {funcionarioSelecionado && <h2>{funcionarioSelecionado.name}</h2>}

      {/* Seleção de funcionário */}
      {!employeeId && (
        <Form>
          <Label>Selecione um funcionário</Label>
          <Select
            onChange={(e) => setEmployeeId(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              -- Escolha um funcionário --
            </option>
            {funcionarios.map((func) => (
              <option key={func._id} value={func._id}>
                {func.name}
              </option>
            ))}
          </Select>
        </Form>
      )}

      {/* Seleção do modo: visualizar ou editar */}
      {employeeId && !modo && (
        <div>
          <Label>O que deseja fazer?</Label>
          <Select
            onChange={(e) => setModo(e.target.value as "ver" | "editar")}
            defaultValue=""
          >
            <option value="" disabled>
              -- Selecione a ação --
            </option>
            <option value="ver">Visualizar Escala</option>
            <option value="editar">Criar/Atualizar Escala</option>
          </Select>
        </div>
      )}

      {/* Exibição da escala do funcionário */}
      {employeeId && modo === "ver" && (
        <List>
          {escala === null ? (
            // Se ainda estiver carregando
            <Text>Carregando escala...</Text>
          ) : escala.length === 0 ? (
            // Se não houver escala cadastrada
            <Text>
              Este funcionário ainda não possui uma escala configurada.
            </Text>
          ) : (
            // Exibe os dias com as horas configuradas
            escala.map((dia) => {
              const diaInfo = diasDaSemana.find(
                (d) => d.key.toLowerCase() === dia.day.toLowerCase()
              );

              return (
                <Text key={dia.day}>
                  {diaInfo?.full || dia.day}{" "}
                  <span>{formatarDecimalParaHora(dia.dailyHours)}</span>
                </Text>
              );
            })
          )}
        </List>
      )}

      {/* Formulário para criar ou editar escala */}
      {employeeId && modo === "editar" && (
        <Form onSubmit={handleSubmit}>
          <Grid>
            {diasDaSemana.map((dia) => (
              <InputBox key={dia.key}>
                {/* Rótulo com nome abreviado do dia */}
                <Label>{dia.short}</Label>

                {/* Input do tipo "time" para definir a jornada */}
                <InputStyled
                  type="time"
                  value={horas[dia.key] || ""}
                  onChange={(e) => handleChange(dia.key, e.target.value)}
                  placeholder="HH:MM"
                />
              </InputBox>
            ))}
          </Grid>

          {/* Botão para salvar a escala */}
          <Button style={{ minWidth: "100%" }} type="submit">
            Salvar Escala
          </Button>
        </Form>
      )}

      {/* Componente que renderiza os toasts de feedback */}
      <ToastContainer />
    </Container>
  );
}

export default GerenciarEscala;
