import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/loginSchema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../hooks/useAuth";
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
  const navigate = useNavigate();

  const { login, logout } = useAuth(); // ✅ Agora está no lugar certo

  // Função chamada ao clicar no botão de login
  const handleLogin = async () => {
    setLoading(true);
    const timeoutToast = setTimeout(() => {
      toast.info("Conectando com o servidor, aguarde...");
    }, 3000); // mostra toast se demorar mais de 3s
    try {
      const cpfLimpo = cpf.replace(/\D/g, ""); // remove tudo que não for número

      setErros({});
      const dadosValidados = loginSchema.parse({ cpf: cpfLimpo, senha });

      const response = await api.post("/login", {
        cpf: dadosValidados.cpf.replace(/\D/g, ""),
        password: dadosValidados.senha,
      });

      toast.info("Conectando com o servidor, aguarde...");

      const { token, user } = response.data;
      console.log("✅ Login bem-sucedido:", { token, user });

      // ⛔️ Verifica se não é admin antes de logar
      if (user.role !== "admin" && user.role !== "sub_admin") {
        setErros({ cpf: "Apenas administradores podem acessar este painel" });
        logout();
        return;
      }

      login(token, user); // ✅ tudo certo aqui

      toast.dismiss();
      toast.success("Login realizado com sucesso!");

      setTimeout(() => {
        if (user.role === "admin") {
          // Redireciona o admin para a página de criação de empresa
          navigate("/dashboard/criar-empresa");
        } else if (user.role === "sub_admin") {
          // Redireciona o sub-admin para a página de criação de funcionário
          navigate("/dashboard/criar-funcionario");
        }
      }, 1000);
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
