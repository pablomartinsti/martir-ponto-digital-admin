import { useState } from "react";
import styled from "styled-components";
import api from "../../services/api";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  date: string;
  onJustified: () => void;
}

export default function ModalJustificativa({
  isOpen,
  onClose,
  employeeId,
  date,
  onJustified,
}: Props) {
  const [motivo, setMotivo] = useState("");

  const enviarJustificativa = async () => {
    if (!motivo) {
      toast.warn("Selecione um motivo.");
      return;
    }

    try {
      await api.post("/absences", {
        employeeId,
        date,
        type: motivo,
      });
      toast.success("Justificativa registrada com sucesso!");
      onJustified();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.error ??
        err?.message ??
        "Erro ao justificar ausência.";
      toast.error(mensagem);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        <h3>Justificar Ausência</h3>
        <p>
          <strong>Data:</strong> {date}
        </p>

        <Select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
          <option value="">Selecione o motivo</option>
          <option value="vacation">Férias</option>
          <option value="sick_leave">Atestado médico</option>
          <option value="justified">Falta justificada</option>
          <option value="day_off">Folga</option>
          <option value="holiday">Feriado</option>
          <option value="unjustified">Falta Injustificada</option>
        </Select>

        <Actions>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={enviarJustificativa}>Salvar</button>
        </Actions>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 320px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 1rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;

  button {
    padding: 6px 12px;
    cursor: pointer;
  }
`;
