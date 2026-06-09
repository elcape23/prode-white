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
  bestPlayer: string | null;
  topScorer: string | null;
  bestYoungPlayer: string | null;
};

export function calculateBonusPoints(
  position: string,
  teamName: string,
  results: BonusResults
): number {
  switch (position) {
    case "CHAMPION":
      return teamName === results.champion ? 15 : 0;
    case "BEST_PLAYER":
      return teamName === results.bestPlayer ? 10 : 0;
    case "TOP_SCORER":
      return teamName === results.topScorer ? 10 : 0;
    case "BEST_YOUNG_PLAYER":
      return teamName === results.bestYoungPlayer ? 5 : 0;
    default:
      return 0;
  }
}
