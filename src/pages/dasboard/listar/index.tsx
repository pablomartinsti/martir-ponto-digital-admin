import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Filtros, Grid, Card } from "./styles";

// Interface para tipar os dados dos funcionários
interface Funcionario {
  _id: string;
  name: string;
  cpf: string;
  isActive: boolean;
  role: "admin" | "employee";
}

function ListarFuncionarios() {
  // Estado para armazenar o filtro selecionado (todos, ativos ou inativos)
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "inativos">(
    "ativos"
  );
  const [primeiraBusca, setPrimeiraBusca] = useState(true);

  // Estado para armazenar a lista de funcionários retornados da API
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Função para buscar os funcionários com base no filtro atual
  const carregarFuncionarios = useCallback(async () => {
    const loadingToast = setTimeout(() => {
      toast.info("Carregando funcionários...", {
        toastId: "loading-funcionarios",
        autoClose: false,
        closeOnClick: false,
      });
    }, 1000);

    try {
      let endpoint = "/employees";

      if (filtro === "ativos") endpoint = "/employees?filter=active";
      else if (filtro === "inativos") endpoint = "/employees?filter=inactive";

      const response = await api.get(endpoint);

      const apenasFuncionarios = response.data.filter(
        (func: Funcionario) => func.role !== "admin"
      );

      setFuncionarios(apenasFuncionarios);

      toast.dismiss("loading-funcionarios");

      // ✅ Mostra toast de sucesso após atualizar a lista
      if (!primeiraBusca) {
        toast.success("Funcionários carregados com sucesso!");
      } else {
        setPrimeiraBusca(false);
      }
    } catch {
      toast.dismiss("loading-funcionarios");
      toast.error("Erro ao buscar funcionários.");
    } finally {
      clearTimeout(loadingToast);
    }
  }, [filtro, primeiraBusca]);

  // Atualiza a lista sempre que o filtro mudar
  useEffect(() => {
    carregarFuncionarios();
  }, [carregarFuncionarios]);

  // Função para ativar ou inativar um funcionário
  const alternarStatus = async (_id: string, isAtivo: boolean) => {
    const acao = isAtivo ? "inativar" : "ativar";

    // Confirmação do usuário
    const confirmado = window.confirm(
      `Tem certeza que deseja ${acao} este funcionário?`
    );

    if (!confirmado) return;

    try {
      // Envia atualização de status para a API com feedback via toast
      await toast.promise(
        api.patch(`/${_id}/status`, {
          isActive: !isAtivo,
        }),
        {
          pending: `${
            acao === "inativar" ? "Inativando" : "Ativando"
          } funcionário...`,
          success: `Funcionário ${
            acao === "inativar" ? "inativado" : "ativado"
          } com sucesso!`,
          error: `Erro ao ${acao} funcionário.`,
        }
      );

      // Atualiza a lista de funcionários após a alteração
      carregarFuncionarios();
    } catch {
      toast.error("Erro ao buscar funcionários.");
    }
  };

  return (
    <Container>
      {/* Título da página */}
      <h1>Funcionários</h1>

      {/* Botões de filtro */}
      <Filtros>
        <button
          className={filtro === "todos" ? "ativo" : ""}
          onClick={() => setFiltro("todos")}
        >
          Todos
        </button>
        <button
          className={filtro === "ativos" ? "ativo" : ""}
          onClick={() => setFiltro("ativos")}
        >
          Ativos
        </button>
        <button
          className={filtro === "inativos" ? "ativo" : ""}
          onClick={() => setFiltro("inativos")}
        >
          Inativos
        </button>
      </Filtros>

      {/* Grid com os cards de cada funcionário */}
      {funcionarios.length === 0 ? (
        <p
          style={{ marginTop: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          Nenhum funcionário encontrado com esse filtro.
        </p>
      ) : (
        <Grid>
          {funcionarios.map((func) => (
            <Card key={func._id}>
              <h3>{func.name}</h3>
              <p>
                <span>CPF:</span> {func.cpf}
              </p>
              <p className={func.isActive ? "ativo" : "inativo"}>
                <span>Status:</span> {func.isActive ? "Ativo" : "Inativo"}
              </p>
              <button onClick={() => alternarStatus(func._id, func.isActive)}>
                {func.isActive ? "Inativar" : "Ativar"}
              </button>
            </Card>
          ))}
        </Grid>
      )}

      {/* Componente que exibe os toasts de feedback */}
      <ToastContainer />
    </Container>
  );
}

export default ListarFuncionarios;
