import { format } from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const timeZone = "America/Sao_Paulo";

export function formatarHorario(dataIso?: string): string {
  if (!dataIso) return "--:--";
  const zonedDate = toZonedTime(dataIso, timeZone);
  return formatTz(zonedDate, "HH:mm", { timeZone });
}

export function formatarDataCompleta(dataIso: string): string {
  const zonedDate = toZonedTime(dataIso, timeZone);
  return formatTz(zonedDate, "EEE - dd/MM/yyyy", {
    locale: ptBR,
    timeZone,
  });
}

export function formatarParaInputMes(date: Date): string {
  return format(date, "yyyy-MM");
}
