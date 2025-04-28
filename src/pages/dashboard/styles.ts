import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  max-height: 100vh;

  @media (max-width: 480px) {
    flex-direction: column;
    max-height: none;
  }
`;

export const ContainerItems = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 6rem;
  }
`;
