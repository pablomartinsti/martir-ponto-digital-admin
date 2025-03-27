import styled from "styled-components";

export const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  background: #011d4c;
  padding: 1rem;
  border-radius: 8px;
  @media (max-width: 480px) {
    padding-top: 80px;
  }
`;

export const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
