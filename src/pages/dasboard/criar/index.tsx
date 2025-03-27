import { useState } from "react";
import api from "../../../services/api";
import { z, ZodError } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../../Components/Input";
import Button from "../../../Components/Button";
import { Container, Title, Form } from "./styles";
import isApiError from "../../../utils/isApiError";

// Esquema de validação com Zod
const funcionarioSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  position: z.string().min(2, "Cargo é obrigatório"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

function CriarFuncionario() {
  // Estados para armazenar os dados do formulário
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    try {
      // Validação dos dados com Zod
      const dados = funcionarioSchema.parse({ name, position, cpf, password });

      // Envia os dados para a API com feedback visual usando toast.promise
      await toast.promise(
        api.post("/employees", {
          name: dados.name,
          position: dados.position,
          cpf: dados.cpf.replace(/\D/g, ""), // Remove caracteres não numéricos do CPF
          password: dados.password,
        }),
        {
          pending: "Cadastrando funcionário...",
          success: "Funcionário cadastrado com sucesso!",
          error: "Erro ao cadastrar funcionário.",
        }
      );

      // Limpa os campos após cadastro
      setName("");
      setPosition("");
      setCpf("");
      setPassword("");
    } catch (error: unknown) {
      // Exibe mensagem de erro de validação (Zod)
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);

        // Exibe mensagem de erro da API se for erro conhecido
      } else if (isApiError(error)) {
        toast.error(error.response.data.message);

        // Mensagem genérica para outros erros
      } else {
        toast.error("Erro ao cadastrar funcionário.");
      }
    }
  };

  return (
    <Container>
      {/* Título da página */}
      <Title>Criar Funcionário</Title>

      {/* Formulário de cadastro */}
      <Form onSubmit={handleSubmit}>
        {/* Campo: Nome */}
        <Input
          label="Nome"
          type="text"
          placeholder="Digite o nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Campo: Cargo */}
        <Input
          label="Cargo"
          type="text"
          placeholder="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        {/* Campo: CPF */}
        <Input
          label="CPF"
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        {/* Campo: Senha */}
        <Input
          label="Senha"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botão de envio */}
        <Button type="submit">Cadastrar</Button>
      </Form>

      {/* Container para exibir os toasts */}
      <ToastContainer />
    </Container>
  );
}

export default CriarFuncionario;
