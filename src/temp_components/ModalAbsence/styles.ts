import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 320px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 1rem;
`;
export const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: none;
  padding: 8px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;

  &:focus {
    outline: none;
    border-color: #e8b931;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;

  button {
    padding: 6px 12px;
    cursor: pointer;
  }
`;
