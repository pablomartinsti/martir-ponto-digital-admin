import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Filtros, Grid, Card } from "./styles";
import { AxiosError } from "axios";
import ModalTrocarSenha from "../../../Components/ModalTrocaSenha";

interface Funcionario {
  _id: string;
  name: string;
  cpf: string;
  isActive: boolean;
  role: "admin" | "sub_admin" | "employee";
}

interface Empresa {
  _id: string;
  name: string;
  cnpj: string;
}

function ListarFuncionarios() {
  const [filtro, setFiltro] = useState<"todos" | "ativos" | "inativos">(
    "todos"
  );
  const [primeiraBusca, setPrimeiraBusca] = useState(true);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cnpjSelecionado, setCnpjSelecionado] = useState("");

  // Modal de troca de senha
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<Funcionario | null>(null);
  const [novaSenha, setNovaSenha] = useState("");

  const [user] = useState(() => {
    const userStorage = localStorage.getItem("user");
    return userStorage ? JSON.parse(userStorage) : null;
  });

  useEffect(() => {
    if (user?.role === "admin") {
      api
        .get("/companies")
        .then((res) => setEmpresas(res.data))
        .catch(() => toast.error("Erro ao carregar empresas."));
    }
  }, [user]);

  const carregarFuncionarios = useCallback(async () => {
    const loadingToast = setTimeout(() => {
      toast.info("Carregando funcionários...", {
        toastId: "loading-funcionarios",
        autoClose: false,
        closeOnClick: false,
      });
    }, 500);

    try {
      const url = "/employees";
      const params = new URLSearchParams();

      if (filtro === "ativos") params.append("filter", "active");
      else if (filtro === "inativos") params.append("filter", "inactive");

      if (user?.role === "admin" && cnpjSelecionado) {
        params.append("cnpj", cnpjSelecionado);
      }

      const response = await api.get(`${url}?${params.toString()}`);
      const apenasFuncionarios = response.data.filter(
        (func: Funcionario) => func.role !== "admin"
      );

      setFuncionarios(apenasFuncionarios);

      toast.dismiss("loading-funcionarios");
      if (!primeiraBusca) toast.success("Funcionários carregados com sucesso!");
      else setPrimeiraBusca(false);
    } catch {
      toast.dismiss("loading-funcionarios");
      toast.error("Erro ao buscar funcionários.");
    } finally {
      clearTimeout(loadingToast);
    }
  }, [filtro, cnpjSelecionado, primeiraBusca, user]);

  useEffect(() => {
    if (user?.role === "admin" && !cnpjSelecionado) return;
    carregarFuncionarios();
  }, [carregarFuncionarios, cnpjSelecionado, user?.role]);

  const alternarStatus = async (_id: string, isAtivo: boolean) => {
    const acao = isAtivo ? "inativar" : "ativar";
    const confirmado = window.confirm(
      `Tem certeza que deseja ${acao} este funcionário?`
    );
    if (!confirmado) return;

    try {
      await toast.promise(
        api.patch(`/employees/${_id}/status`, { isActive: !isAtivo }),
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
      carregarFuncionarios();
    } catch {
      toast.error("Erro ao atualizar funcionário.");
    }
  };

  const abrirModalTrocarSenha = (funcionario: Funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setNovaSenha("");
    setModalAberto(true);
  };

  const trocarSenha = async () => {
    if (!funcionarioSelecionado || !novaSenha) return;

    try {
      await api.put(`/users/${funcionarioSelecionado._id}/reset-password`, {
        newPassword: novaSenha,
      });
      toast.success("Senha redefinida com sucesso!");
      setModalAberto(false);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error: string }>;
      const errorMsg = axiosError.response?.data?.error;
      toast.error(errorMsg || "Erro ao redefinir senha.");
    }
  };

  return (
    <Container>
      <h1>Funcionários</h1>

      {user?.role === "admin" && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "0.5rem" }}>Filtrar por empresa:</label>
          <select
            value={cnpjSelecionado}
            onChange={(e) => setCnpjSelecionado(e.target.value)}
            disabled={empresas.length === 0}
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa._id} value={empresa.cnpj}>
                {empresa.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <Filtros>
        <button
          className={filtro === "todos" ? "ativo" : ""}
          onClick={() => setFiltro("todos")}
          disabled={user?.role === "admin" && !cnpjSelecionado}
        >
          Todos
        </button>
        <button
          className={filtro === "ativos" ? "ativo" : ""}
          onClick={() => setFiltro("ativos")}
          disabled={user?.role === "admin" && !cnpjSelecionado}
        >
          Ativos
        </button>
        <button
          className={filtro === "inativos" ? "ativo" : ""}
          onClick={() => setFiltro("inativos")}
          disabled={user?.role === "admin" && !cnpjSelecionado}
        >
          Inativos
        </button>
      </Filtros>

      {!cnpjSelecionado && user?.role === "admin" ? (
        <p
          style={{ marginTop: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          Selecione uma empresa para visualizar os funcionários.
        </p>
      ) : funcionarios.length === 0 ? (
        <p
          style={{ marginTop: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          Nenhum funcionário encontrado com esse filtro.
        </p>
      ) : (
        <Grid>
          {funcionarios.map((func) => (
            <Card key={func._id}>
              {func.role === "sub_admin" && (
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#008000",
                    marginBottom: "0.3rem",
                  }}
                >
                  👤 Administrador da Empresa
                </p>
              )}
              <h3>{func.name}</h3>
              <p>
                <span>CPF:</span> {func.cpf}
              </p>
              <p className={func.isActive ? "ativo" : "inativo"}>
                <span>Status:</span> {func.isActive ? "Ativo" : "Inativo"}
              </p>

              {!(user?.role === "sub_admin" && user.id === func._id) && (
                <div className="box-botao">
                  <button
                    onClick={() => alternarStatus(func._id, func.isActive)}
                  >
                    {func.isActive ? "Inativar" : "Ativar"}
                  </button>

                  <button onClick={() => abrirModalTrocarSenha(func)}>
                    Trocar Senha
                  </button>
                </div>
              )}
            </Card>
          ))}
        </Grid>
      )}
      <ModalTrocarSenha
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        funcionario={funcionarioSelecionado}
        novaSenha={novaSenha}
        setNovaSenha={setNovaSenha}
        onSubmit={trocarSenha}
      />

      <ToastContainer />
    </Container>
  );
}

export default ListarFuncionarios;
