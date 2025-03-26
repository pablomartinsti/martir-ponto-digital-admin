import { ChangeEvent } from "react";
import { Group, StyledLabel, StyledInput, ErrorText } from "./styles";

interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string; // <-- isso aqui resolve o problema
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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Group>
  );
}

export default InputGroup;
