import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../../Components/Input";
import Button from "../../../Components/Button";
import { Container, Title, Form } from "./styles";
import { z, ZodError } from "zod";
import api from "../../../services/api";

// Esquema de validação para sub-admin (funcionário)
const funcionarioSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  position: z.string().min(2, "Cargo é obrigatório"),
});

function CriarFuncionario() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dados = funcionarioSchema.parse({
        name,
        cpf,
        password,
        position,
      });

      await toast.promise(
        api.post("/employees", {
          name: dados.name,
          cpf: dados.cpf.replace(/\D/g, ""),
          password: dados.password,
          position: dados.position,
        }),
        {
          pending: "Cadastrando funcionário...",
          success: "Funcionário cadastrado com sucesso!",
          error: "Erro ao cadastrar funcionário.",
        }
      );

      setName("");
      setCpf("");
      setPassword("");
      setPosition("");
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao cadastrar funcionário.");
      }
    }
  };

  return (
    <Container>
      <Title>Criar Funcionário</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <Input
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <Button type="submit">Cadastrar Funcionário</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
}

export default CriarFuncionario;
