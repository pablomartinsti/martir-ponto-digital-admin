# 🕒 Martir Ponto Digital Admin

Sistema de administração do Ponto Digital, desenvolvido para facilitar o controle de jornada de trabalho de pequenas empresas e seus funcionários.

> ⚠️ Este repositório representa apenas a **parte administrativa (admin)** do sistema. O projeto completo também inclui:
>
> - 📱 **Aplicativo Mobile (funcionário)**: desenvolvido com **React Native** para marcação de ponto e visualização de jornada  
>   🔗 [Repositório do app mobile](https://github.com/pablomartinsti/martir-ponto-digital-react-native)
>
> - 🔧 **API (backend)**: desenvolvida com **Node.js + TypeScript + MongoDB** para gerenciar autenticação, registros, escalas e relatórios  
>   🔗 [Repositório da API](https://github.com/pablomartinsti/martir-ponto-digital-backend)

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido para um escritório de contabilidade, com o intuito de ser oferecido aos seus clientes que possuem poucos funcionários e, por isso, não justificam o investimento em sistemas de ponto digitais mais robustos e caros.

Criar uma plataforma simples, intuitiva e funcional onde administradores (como escritórios de contabilidade) possam:

- Cadastrar e gerenciar funcionários
- Definir e visualizar escalas de trabalho
- Consultar relatórios de horas trabalhadas
- Imprimir registros com layout otimizado para papel

Este projeto surgiu da necessidade real de pequenas empresas que não têm recursos para contratar sistemas de ponto mais robustos.

---

## 👨‍💼 Funcionalidades do Admin

- ✅ **Criar Funcionário:** Cadastro com nome, cargo e status (ativo/inativo)
- ✅ **Listar Funcionários:** Visualização e filtro por status
- ✅ **Alterar Status:** Ativar/Inativar funcionários com confirmação
- ✅ **Gerenciar Escalas:** Definir quantidade de horas que o funcionário deve trabalhar por dia da semana
- ✅ **Visualizar Escalas:** Exibir horários atribuídos em formato responsivo
- ✅ **Relatório de Horas:** Ver registros por mês com dados de entrada/saída, saldos e total de horas
- ✅ **Impressão de Registros:** Layout próprio para impressão (A4), com quebra controlada e assinatura

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React + TypeScript** – base da aplicação
- **Vite** – bundler rápido e moderno
- **Styled-Components** – estilização com escopo local
- **React Router DOM** – gerenciamento de rotas
- **React Toastify** – alertas e feedbacks para o usuário
- **Axios** – requisições HTTP para a API

## 📸 Responsividade e Impressão

- Design adaptado para **telas grandes e pequenas**
- Tabelas se transformam em **cards** no celular
- Impressão com layout próprio usando `@media print` (ideal para papel A4)


## 🌐 Deploy

O projeto está hospedado gratuitamente na Vercel:  
📎 [Acesse aqui](https://pontodigital.martircontabil.com.br/)

---



## Smoke Test do Frontend

O projeto possui um smoke test simples para validar rapidamente se o frontend está respondendo e se a integração básica com a API está acessível.

Com a API rodando e o frontend iniciado, execute:

```bash
npm run test:smoke
```

Por padrão, o teste usa:

```txt
Frontend: http://localhost:5173
API: http://localhost:3000
```

Para testar login e rotas protegidas, informe CPF e senha de um usuário válido:

```powershell
$env:SMOKE_CPF="00000000000"
$env:SMOKE_PASSWORD="senha-do-usuario"
npm run test:smoke
```

Se a API ou o frontend estiverem em outra URL:

```powershell
$env:SMOKE_FRONT_URL="http://localhost:5173"
$env:SMOKE_API_URL="http://localhost:3000"
npm run test:smoke
```

Resultado esperado:

```txt
Smoke test do frontend finalizado com sucesso.
```
