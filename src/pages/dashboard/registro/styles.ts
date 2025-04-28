// src/pages/Dashboard/Registro/styles.ts
import styled from "styled-components";

export const Container = styled.div`
  padding: 0 20px;
`;

export const FiltroWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  .input-mes {
    padding: 8px;
    border-radius: 5px;
    font-size: 1rem;
    border: 1px solid black;
    width: 100%;
    max-width: 250px;

    &:hover {
      border: 1px solid #e8b931;
    }
  }
`;

export const SelectFuncionario = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 250px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid black;

  &:hover {
    border: 1px solid #e8b931;
    cursor: pointer;
  }
`;

export const CardResumo = styled.div`
  border: 1px solid #011d4c;
  color: #000;
  font-weight: bold;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 2rem 0;

  strong {
    font-weight: 400;
  }
`;

export const Saldo = styled.span<{ negativo?: boolean }>`
  color: ${(props) => (props.negativo ? "red" : "green")};
  font-weight: bold;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
  margin-top: 1rem;
  table-layout: fixed;

  thead {
    background-color: #f5f5f5;
  }

  th,
  td {
    padding: 1px;
    border: 1px solid #ccc;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
  }
  .col-status {
    width: 170px;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  td.saldo-negativo {
    color: red;
    font-weight: bold;
  }

  td.saldo-positivo {
    color: green;
    font-weight: bold;
  }
`;
export const TableDesktop = styled(Table)`
  @media screen and (max-width: 1024px) {
    display: none;
  }

  @media print {
    display: table;
  }
`;

export const TableMobile = styled.div`
  display: none;

  @media screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  @media print {
    display: none; /* Esconde os cards na impressão */
  }

  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    font-size: 18px;

    p {
      margin: 4px 0;

      strong {
        font-weight: bold;
      }
    }

    .saldo-positivo {
      color: green;
      font-weight: bold;
    }

    .saldo-negativo {
      color: red;
      font-weight: bold;
    }
  }
`;

export const Assinatura = styled.div`
  margin-top: 4rem;
  text-align: center;
  font-size: 16px;
  word-wrap: break-word;
  width: 100%;
  padding: 0 1rem;

  p {
    margin: 4px 0;
  }

  p:first-child {
    width: 100%;
    white-space: normal;
    overflow-wrap: break-word;
  }

  p:last-child {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    margin-top: 2rem;

    p:first-child {
      font-size: 12px;
    }
  }
`;
