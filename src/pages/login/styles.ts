import styled from "styled-components";

export const Container = styled.div`
  background-color: #011d4c;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;
export const ContainerItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;

  width: 100%;
  max-width: 30rem;
  padding: 0 1rem;
  box-sizing: border-box;

  img {
    max-width: 100%;
    height: auto;
    margin-bottom: 2rem;
  }
`;
