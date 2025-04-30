import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Actions, ModalBox, Overlay, Select, Textarea } from "./styles";

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
  const [descricao, setDescricao] = useState("");

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
        description: descricao,
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
          <option value="unjustified">Falta</option>
        </Select>
        <Textarea
          placeholder="Descreva detalhes da ausência (máx. 20 caracteres)"
          value={descricao}
          onChange={(e) => {
            if (e.target.value.length <= 20) {
              setDescricao(e.target.value);
            }
          }}
          maxLength={20}
        />
        <p
          style={{ textAlign: "right", fontSize: "0.75rem", marginTop: "4px" }}
        >
          {descricao.length}/20
        </p>
        <Actions>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={enviarJustificativa}>Salvar</button>
        </Actions>
      </ModalBox>
    </Overlay>
  );
}
