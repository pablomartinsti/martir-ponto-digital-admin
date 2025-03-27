import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #011d4c;
  border-radius: 10px;
  h2 {
    color: #e8b931;
    text-align: center;
    margin: 3rem 0;
  }
  @media (max-width: 480px) {
    padding-top: 80px;
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
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const InputBox = styled.div``;

export const Label = styled.label`
  color: #e8b931;
  font-size: 0.9rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.3rem;
  text-align: center;
`;

export const InputStyled = styled.input`
  width: 100%;
  height: 2rem;
  border-radius: 5px;
  padding-left: 6px;
  border: none;
  text-align: center;
`;
export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;

  h6 {
    display: flex;
    justify-content: center;
    width: 100%;
    color: #fff;
    font-size: 1rem;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
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
