// Social Emote Outcomes
export const SIMPLE_OUTCOME = 'simple_outcome'
export const MULTIPLE_OUTCOME = 'multiple_outcome'
export const RANDOM_OUTCOME = 'random_outcome'

export const SIMPLE_OUTCOME_SHORT = 'so'
export const MULTIPLE_OUTCOME_SHORT = 'mo'
export const RANDOM_OUTCOME_SHORT = 'ro'

export const OUTCOMES = [SIMPLE_OUTCOME_SHORT, MULTIPLE_OUTCOME_SHORT, RANDOM_OUTCOME_SHORT]

export function mapOutcomeToString(outcome: string): string {
  if (outcome == MULTIPLE_OUTCOME_SHORT) {
    return MULTIPLE_OUTCOME
  } else if (outcome == RANDOM_OUTCOME_SHORT) {
    return RANDOM_OUTCOME
  }

  return SIMPLE_OUTCOME
}
