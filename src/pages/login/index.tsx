import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/loginSchema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";
import Logo from "../../assets/Logo-Ponto-Digital.svg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { Container, ContainerItems } from "./styles";
import { ZodError } from "zod";

function Login() {
  // Estados para armazenar os valores dos inputs e erros de validação
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [erros, setErros] = useState<{ cpf?: string; senha?: string }>({});

  // Hook do React Router para navegação
  const navigate = useNavigate();

  // Função chamada ao clicar no botão de login
  const handleLogin = async () => {
    setLoading(true);
    const timeoutToast = setTimeout(() => {
      toast.info("Conectando com o servidor, aguarde...");
    }, 3000); // mostra toast se demorar mais de 3s
    try {
      // Limpa os erros anteriores
      setErros({});

      // Validação dos dados usando Zod
      const dadosValidados = loginSchema.parse({ cpf, senha });

      // Requisição para a API de login
      const response = await api.post("/login", {
        cpf: dadosValidados.cpf.replace(/\D/g, ""), // Remove caracteres não numéricos do CPF
        password: dadosValidados.senha,
      });
      toast.info("Conectando com o servidor, aguarde...");

      const { token, user } = response.data;

      // Armazena token e informações do usuário no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verifica se o usuário é um admin
      if (user.role !== "admin") {
        setErros({ cpf: "Apenas administradores podem acessar este painel" });

        // Remove os dados armazenados se não for admin
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      toast.dismiss(); // esconde o "aguarde..."
      // Exibe mensagem de sucesso
      toast.success("Login realizado com sucesso!");

      // Redireciona para o painel após 2 segundos
      setTimeout(() => {
        navigate("/dashboard/criar-funcionario");
      }, 2000);
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao fazer login. Verifique suas credenciais.");

      if (error instanceof ZodError) {
        const fieldErrors: { cpf?: string; senha?: string } = {};
        error.errors.forEach((err) => {
          if (err.path.includes("cpf")) fieldErrors.cpf = err.message;
          if (err.path.includes("senha")) fieldErrors.senha = err.message;
        });
        setErros(fieldErrors);
      }
    } finally {
      clearTimeout(timeoutToast);
      setLoading(false);
    }
  };

  return (
    <Container>
      <ContainerItems>
        {/* Logo do sistema */}
        <img src={Logo} alt="Logo Ponto Digital" />

        {/* Input para CPF */}
        <Input
          label="CPF"
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          error={erros.cpf}
        />

        {/* Input para Senha */}
        <Input
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={erros.senha}
        />

        {/* Botão de login */}
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </ContainerItems>

      {/* Componente que exibe os toasts (mensagens de feedback) */}
      <ToastContainer />
    </Container>
  );
}

export default Login;
