import { getBonusDeadline, isLastDayToChooseBonus } from "@/lib/bonus";
import { BonusDeadlineToast } from "./bonus-deadline-toast";

const TOURNAMENT_ID = "default-tournament";

/**
 * Avisa que hoy es el último día para elegir los puntos bonus. La decisión se
 * computa en el server (a partir del fixture, ver `lib/bonus`) y, si corresponde,
 * se monta un toast neutro en el cliente.
 */
export async function BonusDeadlineBanner() {
  const deadline = await getBonusDeadline(TOURNAMENT_ID);
  if (!isLastDayToChooseBonus(deadline)) return null;

  return <BonusDeadlineToast />;
}
