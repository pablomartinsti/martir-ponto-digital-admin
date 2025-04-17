import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localePt from "dayjs/locale/pt-br";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(localePt); // define o idioma

const timeZone = "America/Sao_Paulo";

// 🕐 Formata horário (ex: 08:30)
export function formatarHorario(dataIso?: string): string {
  if (!dataIso) return "--:--";
  return dayjs(dataIso).tz(timeZone).format("HH:mm");
}

// 📅 Formata data completa (ex: "Qua - 17/04/2025")
export function formatarDataCompleta(dataIso: string): string {
  return dayjs(dataIso).tz(timeZone).format("ddd - DD/MM/YYYY");
}

// 📆 Formata para input de mês (ex: "2025-04")
export function formatarParaInputMes(date: Date): string {
  return dayjs(date).format("YYYY-MM");
}

// 📍 Verifica se uma data é hoje
export function isHoje(data: string | Date): boolean {
  return dayjs(data).isSame(dayjs(), "day");
}
