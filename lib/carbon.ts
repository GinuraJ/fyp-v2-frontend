export type CarbonInput = {
  /** Wood density in g/cm^3 */
  woodDensity: number
  /** Diameter at breast height in cm */
  diameterCm: number
  /** Tree height in meters */
  heightM: number
  /** Age in years */
  ageYears: number
}

export type CarbonOutput = {
  agbKg: number
  carbonKg: number
  totalCo2Kg: number
  yearlyCo2Kg: number
  creditsPerYear: number
}

/**
 * Calculates carbon/CO2/credits using:
 * AGB = 0.0673 × (ρ·D²·H)^0.976
 * Carbon = AGB × 0.47
 * CO2 = Carbon × 3.67
 * Annual CO2 = Total CO2 / age
 * Credits/year = Annual CO2 (kg) / 1000
 */
export function calculateCarbonCredits(input: CarbonInput): CarbonOutput {
  const rho = input.woodDensity
  const D = input.diameterCm
  const H = input.heightM
  const age = input.ageYears

  const safe = (n: number) => (Number.isFinite(n) ? n : 0)
  const positive = (n: number) => (safe(n) > 0 ? safe(n) : 0)

  const rhoPos = positive(rho)
  const dPos = positive(D)
  const hPos = positive(H)
  const agePos = positive(age)

  const agbKg =
    rhoPos && dPos && hPos
      ? 0.0673 * Math.pow(rhoPos * Math.pow(dPos, 2) * hPos, 0.976)
      : 0

  const carbonKg = agbKg * 0.47
  const totalCo2Kg = carbonKg * 3.67
  const yearlyCo2Kg = agePos ? totalCo2Kg / agePos : 0
  const creditsPerYear = yearlyCo2Kg / 1000

  return {
    agbKg: safe(agbKg),
    carbonKg: safe(carbonKg),
    totalCo2Kg: safe(totalCo2Kg),
    yearlyCo2Kg: safe(yearlyCo2Kg),
    creditsPerYear: safe(creditsPerYear),
  }
}

