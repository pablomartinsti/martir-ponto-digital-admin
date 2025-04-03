import { ChangeEvent } from "react";
import { Group, StyledLabel, StyledInput, ErrorText } from "./styles";

interface Props {
  label: string;
  type?: "text" | "password" | "number"; // Tipos de input
  value: string | number; // Aceitar tanto string quanto number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string; // Exibição de erro, se houver
}

function InputGroup({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: Props) {
  return (
    <Group>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput
        type={type}
        value={value} // Valor agora pode ser string ou number
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Group>
  );
}

export default InputGroup;
