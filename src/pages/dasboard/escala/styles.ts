import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #011d4c;
  border-radius: 10px;
  h2 {
    color: #e8b931;
    text-align: center;
    margin: 3rem 0;
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #fff;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  margin-bottom: 1rem;
  text-align: center;
`;

export const Select = styled.select`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 1rem;
  border: none;
  background-color: #fff;
  color: #000;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: 2px solid #e8b931;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #012869;
  border-radius: 12px;
  padding: 1rem;
  gap: 0.6rem;
  color: #fff;
  min-width: 140px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  align-items: stretch;
  text-align: left;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.15rem;
    color: #e8b931;
  }

  small {
    font-size: 0.7rem;
    color: #ccc;
    margin-top: 0.4rem;
  }
`;

export const Label = styled.label`
  color: #e8b931;
  font-size: 0.9rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.3rem;
  text-align: center;
`;
export const CheckboxLabel = styled.label`
  font-size: 0.85rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const InputStyled = styled.input`
  width: 100%;
  height: 2.2rem;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  text-align: center;
  border: none;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: 2px solid #e8b931;
  }
`;

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;

  h6 {
    display: flex;
    justify-content: center;
    width: 100%;
    color: #fff;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Text = styled.p`
  font-size: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #011d4c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  width: 100%;

  span {
    font-weight: bold;
    color: #fcbf49;
  }

  @media (min-width: 769px) {
    background: none;
    padding: 0;
    width: auto;
  }
`;
