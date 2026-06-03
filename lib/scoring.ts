export type MatchResult = { homeScore: number; awayScore: number };

export function calculateMatchPoints(
  result: MatchResult,
  prediction: MatchResult
): number {
  // Exact result
  if (prediction.homeScore === result.homeScore && prediction.awayScore === result.awayScore) {
    return 5;
  }

  const resultOutcome = Math.sign(result.homeScore - result.awayScore);
  const predOutcome = Math.sign(prediction.homeScore - prediction.awayScore);

  if (resultOutcome !== predOutcome) return 0;

  // Correct outcome: +2, correct goal difference (not exact): +1
  const resultDiff = result.homeScore - result.awayScore;
  const predDiff = prediction.homeScore - prediction.awayScore;
  return 2 + (resultDiff === predDiff ? 1 : 0);
}

export type BonusResults = {
  champion: string | null;
  finalist1: string | null;
  finalist2: string | null;
  semi1: string | null;
  semi2: string | null;
  semi3: string | null;
  semi4: string | null;
};

export function calculateBonusPoints(
  position: string,
  teamName: string,
  results: BonusResults
): number {
  switch (position) {
    case "CHAMPION":
      return teamName === results.champion ? 15 : 0;
    case "FINALIST_1":
    case "FINALIST_2":
      return [results.finalist1, results.finalist2].includes(teamName) ? 10 : 0;
    case "SEMI_1":
    case "SEMI_2":
    case "SEMI_3":
    case "SEMI_4":
      return [results.semi1, results.semi2, results.semi3, results.semi4].includes(teamName) ? 5 : 0;
    default:
      return 0;
  }
}
