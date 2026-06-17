import { getBonusDeadline, isLastDayToChooseBonus } from "@/lib/bonus";
import { BonusDeadlineModal } from "./bonus-deadline-modal";

const TOURNAMENT_ID = "default-tournament";

/**
 * Avisa que quedan las últimas horas para elegir los puntos bonus. La decisión
 * se computa en el server (a partir del fixture, ver `lib/bonus`) y, si
 * corresponde, se monta el bottom-sheet de aviso en el cliente.
 */
export async function BonusDeadlineBanner() {
  const deadline = await getBonusDeadline(TOURNAMENT_ID);
  if (!isLastDayToChooseBonus(deadline)) return null;

  return <BonusDeadlineModal />;
}
