import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../../Components/Input";
import Button from "../../../Components/Button";
import { Container, Title, Form } from "./styles";
import { z, ZodError } from "zod";
import api from "../../../services/api";

// Esquema de validação para admin (empresa)
const adminSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 caracteres"),
  position: z.string().min(2, "Cargo é obrigatório"),
  latitude: z.number(),
  longitude: z.number(),
});

function CriarEmpresa() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [position, setPosition] = useState("");
  const [latitude, setLatitude] = useState<number>(0); // Definido como número
  const [longitude, setLongitude] = useState<number>(0); // Definido como número

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dados = adminSchema.parse({
        name,
        cpf,
        password,
        companyName,
        cnpj,
        position,
        latitude,
        longitude,
      });

      await toast.promise(
        api.post("/sub-admin", {
          name: dados.name,
          cpf: dados.cpf.replace(/\D/g, ""),
          password: dados.password,
          companyName: dados.companyName,
          cnpj: dados.cnpj,
          position: dados.position,
          latitude: dados.latitude,
          longitude: dados.longitude,
        }),
        {
          pending: "Cadastrando sub admin...",
          success: "Sub admin cadastrado com sucesso!",
          error: "Erro ao cadastrar sub admin.",
        }
      );

      setName("");
      setCpf("");
      setPassword("");
      setCompanyName("");
      setCnpj("");
      setPosition("");
      setLatitude(0);
      setLongitude(0);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao cadastrar sub admin.");
      }
    }
  };

  return (
    <Container>
      <Title>Criar Sub-Admin</Title>
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
          label="Nome da Empresa"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          label="CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
        />
        <Input
          label="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <Input
          label="Latitude"
          type="text"
          value={latitude}
          onChange={(e) => {
            const value = e.target.value;
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              setLatitude(parsedValue);
            } else {
              setLatitude(0); // Define como 0 ou algum valor padrão se inválido
            }
          }}
        />

        <Input
          label="Longitude"
          type="text"
          value={longitude}
          onChange={(e) => {
            const value = e.target.value;
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              setLongitude(parsedValue);
            } else {
              setLongitude(0); // Define como 0 ou algum valor padrão se inválido
            }
          }}
        />

        <Button type="submit">Cadastrar Sub-Admin</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
}

export default CriarEmpresa;
