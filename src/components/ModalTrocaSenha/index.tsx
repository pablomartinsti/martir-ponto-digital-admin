import { Overlay, ModalBox, Input, ButtonGroup } from "./styles";

interface Funcionario {
  _id: string;
  name: string;
  cpf: string;
  isActive: boolean;
  role: "admin" | "sub_admin" | "employee";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  funcionario: Funcionario | null;
  novaSenha: string;
  setNovaSenha: (senha: string) => void;
  onSubmit: () => void;
}

export default function ModalTrocarSenha({
  isOpen,
  onClose,
  funcionario,
  novaSenha,
  setNovaSenha,
  onSubmit,
}: Props) {
  if (!isOpen || !funcionario) return null;

  return (
    <Overlay>
      <ModalBox>
        <h2>Redefinir Senha</h2>
        <h2> {funcionario.name}</h2>
        <Input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          placeholder="Nova senha"
        />
        <ButtonGroup>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onSubmit}>Salvar</button>
        </ButtonGroup>
      </ModalBox>
    </Overlay>
  );
}
