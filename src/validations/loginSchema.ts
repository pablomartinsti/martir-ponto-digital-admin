// src/Validations/loginSchema.ts

import { z } from "zod";

export const loginSchema = z.object({
  cpf: z
    .string()
    .nonempty("CPF é obrigatório")
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos"),
  senha: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(6, "Senha deve conter pelo menos 6 caracteres"),
});
