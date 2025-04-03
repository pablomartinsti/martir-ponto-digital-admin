import styled from "styled-components";

// Container do input
export const Group = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 27rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
`;

// Label
export const StyledLabel = styled.label`
  color: #e8b931;
  margin-bottom: 0.3rem;
  font-weight: bold;
  font-size: 1rem;
`;

// Campo de input
export const StyledInput = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 0.3125rem;
  border: none;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border: 1px solid #e8b931;
  }

  &::placeholder {
    color: #aaa;
  }
`;
export const ErrorText = styled.span`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;
