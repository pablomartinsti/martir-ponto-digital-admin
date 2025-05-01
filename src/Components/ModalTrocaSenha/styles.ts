import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;

  h2 {
    margin: 1rem 0;
  }
`;

export const Input = styled.input`
  padding: 0.5rem;
  margin: 1rem 0;
  width: 100%;
  font-size: 1rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    margin-top: 1rem;
    padding: 0.4rem 1rem;
    background-color: #011d4c;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid black;
    transition: all 0.3s;

    &:hover {
      background-color: #fff;
      color: black;
    }
  }
`;
