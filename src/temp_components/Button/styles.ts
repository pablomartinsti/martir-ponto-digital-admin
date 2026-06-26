import styled from "styled-components";

export const StyledButton = styled.button`
  width: 100%;
  max-width: 27rem;
  height: 2.74rem;
  border-radius: 5px;
  background-color: #e8b931;
  color: #fff;
  border: 0;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 2rem;

  transition: all 0.3s ease;

  &:hover {
    border: 1px solid #fff;
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    border: 1px solid #fff;
    cursor: pointer;
    opacity: 1;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
