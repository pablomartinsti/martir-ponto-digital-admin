import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
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
    "todos"
  );

  // Estado para armazenar a lista de funcionários retornados da API
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Função para buscar os funcionários com base no filtro atual
  const carregarFuncionarios = useCallback(async () => {
    try {
      let endpoint = "/employees";

      // Define o endpoint de acordo com o filtro selecionado
      if (filtro === "ativos") endpoint = "/employees?filter=active";
      else if (filtro === "inativos") endpoint = "/employees?filter=inactive";

      // Faz a requisição à API
      const response = await api.get(endpoint);

      // Filtra os usuários para exibir apenas os que não são admins
      const apenasFuncionarios = response.data.filter(
        (func: Funcionario) => func.role !== "admin"
      );

      // Atualiza o estado com os funcionários filtrados
      setFuncionarios(apenasFuncionarios);
    } catch {
      toast.error("Erro ao buscar funcionários.");
    }
  }, [filtro]);

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
        <button onClick={() => setFiltro("todos")}>Todos</button>
        <button onClick={() => setFiltro("ativos")}>Ativos</button>
        <button onClick={() => setFiltro("inativos")}>Inativos</button>
      </Filtros>

      {/* Grid com os cards de cada funcionário */}
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

      {/* Componente que exibe os toasts de feedback */}
      <ToastContainer />
    </Container>
  );
}

export default ListarFuncionarios;
