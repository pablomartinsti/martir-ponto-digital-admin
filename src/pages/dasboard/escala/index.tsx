import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../services/api";
import Button from "../../../Components/Button";
import { toast, ToastContainer } from "react-toastify";
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
  List,
  CheckboxLabel,
} from "./styles";

const diasDaSemana = [
  { key: "Monday", short: "Seg", full: "Segunda" },
  { key: "Tuesday", short: "Ter", full: "Terça" },
  { key: "Wednesday", short: "Qua", full: "Quarta" },
  { key: "Thursday", short: "Qui", full: "Quinta" },
  { key: "Friday", short: "Sex", full: "Sexta" },
  { key: "Saturday", short: "Sáb", full: "Sábado" },
  { key: "Sunday", short: "Dom", full: "Domingo" },
];

function GerenciarEscala() {
  const [employeeId, setEmployeeId] = useState("");
  const [escalaCompleta, setEscalaCompleta] = useState<{
    [key: string]: {
      start: string;
      end: string;
      hasLunch: boolean;
      expectedLunchBreak: string; // <- novo formato HH:mm
      isDayOff: boolean;
    };
  }>({});

  const [escala, setEscala] = useState<
    | {
        day: string;
        start: string;
        end: string;
        hasLunch: boolean;
        expectedLunchBreakMinutes: number;
        isDayOff: boolean;
      }[]
    | null
  >(null);
  const [modo, setModo] = useState<"ver" | "editar" | "">("");
  const [funcionarios, setFuncionarios] = useState<
    { _id: string; name: string }[]
  >([]);

  const location = useLocation();

  const funcionarioSelecionado = funcionarios.find((f) => f._id === employeeId);

  useEffect(() => {
    setEmployeeId("");
    setModo("");
    setEscalaCompleta({});
  }, [location.key]);

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

  useEffect(() => {
    if (modo === "ver" && employeeId) {
      setEscala(null);
      async function buscarEscala() {
        const toastId = toast.loading("Carregando escala...");
        try {
          const { data } = await api.get(`/work-schedules/${employeeId}`);
          setEscala(data.customDays);
          toast.update(toastId, {
            render: "Escala carregada com sucesso!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch {
          setEscala([]);
          toast.update(toastId, {
            render: "Erro ao carregar escala.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }

      buscarEscala();
    }
  }, [modo, employeeId]);

  const handleChangeEscala = (
    dia: string,
    campo: string,
    valor: string | boolean | number
  ) => {
    setEscalaCompleta((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const todosPreenchidos = diasDaSemana.every((dia) => {
      const d = escalaCompleta[dia.key];
      return d && d.start && d.end;
    });

    if (!todosPreenchidos) {
      toast.error("Preencha todos os campos antes de salvar.");
      return;
    }

    const convertTimeToMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const payload = {
      employeeId,
      customDays: diasDaSemana.map((dia) => {
        const diaData = escalaCompleta[dia.key] || {};

        return {
          day: dia.key.toLowerCase(),
          start: diaData.start || "00:00",
          end: diaData.end || "00:00",
          hasLunch: !!diaData.hasLunch,
          expectedLunchBreakMinutes: convertTimeToMinutes(
            diaData.expectedLunchBreak || "00:00"
          ),
          isDayOff: !!diaData.isDayOff,
        };
      }),
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
      <Title>Gerenciar Escala</Title>

      {funcionarioSelecionado && <h2>{funcionarioSelecionado.name}</h2>}

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

      {employeeId && modo === "ver" && (
        <List>
          {escala === null ? null : escala.length === 0 ? (
            <h6>Este funcionário ainda não possui uma escala configurada.</h6>
          ) : (
            escala.map((dia) => {
              const diaInfo = diasDaSemana.find(
                (d) => d.key.toLowerCase() === dia.day.toLowerCase()
              );

              return (
                <div
                  key={dia.day}
                  style={{
                    backgroundColor: "#012869",
                    padding: "1rem",
                    borderRadius: "8px",
                    color: "#fff",
                    minWidth: "300px",
                    flex: "1 1 100px",
                  }}
                >
                  <h4 style={{ color: "#e8b931", marginBottom: "0.5rem" }}>
                    {diaInfo?.full || dia.day}
                  </h4>
                  {dia.isDayOff ? (
                    <p>
                      <strong>Folga</strong>
                    </p>
                  ) : (
                    <>
                      <p>
                        <strong>Jornada:</strong> {dia.start} às {dia.end}
                      </p>
                      <p>
                        <strong>Almoço:</strong>{" "}
                        {dia.hasLunch
                          ? `${dia.expectedLunchBreakMinutes} min`
                          : "Não"}
                      </p>
                    </>
                  )}
                </div>
              );
            })
          )}
        </List>
      )}

      {employeeId && modo === "editar" && (
        <Form onSubmit={handleSubmit}>
          <Grid>
            {diasDaSemana.map((dia) => (
              <InputBox key={dia.key}>
                <Label>{dia.full}</Label>

                <Label>Início da Jornada</Label>
                <InputStyled
                  type="time"
                  value={escalaCompleta[dia.key]?.start || ""}
                  onChange={(e) =>
                    handleChangeEscala(dia.key, "start", e.target.value)
                  }
                  disabled={escalaCompleta[dia.key]?.isDayOff}
                />

                <Label>Fim da Jornada</Label>
                <InputStyled
                  type="time"
                  value={escalaCompleta[dia.key]?.end || ""}
                  onChange={(e) =>
                    handleChangeEscala(dia.key, "end", e.target.value)
                  }
                  disabled={escalaCompleta[dia.key]?.isDayOff}
                />

                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={escalaCompleta[dia.key]?.hasLunch || false}
                    onChange={(e) =>
                      handleChangeEscala(dia.key, "hasLunch", e.target.checked)
                    }
                    disabled={escalaCompleta[dia.key]?.isDayOff}
                  />
                  Tem intervalo para almoço?
                </CheckboxLabel>

                <Label>Intervalo de Almoço</Label>
                <InputStyled
                  type="time"
                  step="60"
                  value={escalaCompleta[dia.key]?.expectedLunchBreak || "00:00"}
                  onChange={(e) =>
                    handleChangeEscala(
                      dia.key,
                      "expectedLunchBreak",
                      e.target.value
                    )
                  }
                  disabled={escalaCompleta[dia.key]?.isDayOff}
                />

                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={escalaCompleta[dia.key]?.isDayOff || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleChangeEscala(dia.key, "isDayOff", isChecked);

                      if (isChecked) {
                        handleChangeEscala(dia.key, "start", "00:00");
                        handleChangeEscala(dia.key, "end", "00:00");
                        handleChangeEscala(
                          dia.key,
                          "expectedLunchBreakMinutes",
                          0
                        );
                        handleChangeEscala(dia.key, "hasLunch", false);
                      }
                    }}
                  />
                  Este dia é uma <strong>folga</strong>
                </CheckboxLabel>

                <small
                  style={{
                    fontSize: "0.7rem",
                    color: "#ccc",
                    textAlign: "center",
                  }}
                >
                  Se for folga, os horários devem ser "00:00"
                </small>
              </InputBox>
            ))}
          </Grid>

          <Button style={{ minWidth: "100%" }} type="submit">
            Salvar Escala
          </Button>
        </Form>
      )}

      <ToastContainer />
    </Container>
  );
}

export default GerenciarEscala;
