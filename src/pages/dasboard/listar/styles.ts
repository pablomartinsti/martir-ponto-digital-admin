import styled from "styled-components";

export const Container = styled.div`
  h1 {
    margin: 1rem 0 2rem 0;
  }
`;

export const Filtros = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  button {
    padding: 0.5rem 1rem;
    background-color: #011d4c;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: #033175;
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 0.5rem;
    color: #011d4c;
  }

  p {
    margin: 0.3rem 0;
    color: #333;
  }

  span {
    font-weight: bold;
  }

  .ativo {
    color: green;
  }

  .inativo {
    color: red;
  }

  button {
    margin-top: 1rem;
    padding: 0.4rem 1rem;
    background-color: #011d4c;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #033175;
    }
  }
`;
