/**
 * Token estimation: 1 token ≈ 4 characters (OpenAI tokenizer rule of thumb)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Carbon emissions formula — Boundary A (operational electricity only)
 *
 * Formula:
 *   CO2 (kg) = tokens × J_per_token × PUE × CI / 3_600_000
 *
 * Where 3,600,000 J = 1 kWh (unit conversion constant)
 *
 * Parameters and sources:
 *
 * J_per_token = 0.18 J/token
 *   Measured energy per output token for a small (~8B parameter) dense LLM
 *   running text-conversation (non-reasoning) on an NVIDIA H100 GPU at
 *   moderate batch size.
 *   Source: ML.ENERGY Leaderboard v3.0, December 2025 — Qwen 3 8B on
 *   Text Conversation, H100, minimum-energy config ≈ 0.15–0.21 J/token.
 *   We use the midpoint 0.18 J/token as a representative value for
 *   grok-3-mini, a comparable small model class.
 *   https://ml.energy/blog/measurement/energy/diagnosing-inference-energy-consumption-with-the-mlenergy-leaderboard-v30/
 *
 * PUE = 1.15 (Power Usage Effectiveness — datacenter overhead multiplier)
 *   AWS global average PUE for 2024, used as a hyperscaler-class baseline.
 *   xAI's Colossus facility PUE is not publicly disclosed; 1.15 is the
 *   standard assumption for modern hyperscale datacenters.
 *   Source: AWS 2024 Sustainability Report.
 *   https://sustainability.aboutamazon.com/
 *
 * CI = 0.315 kg CO2e/kWh (Carbon Intensity of electricity grid)
 *   xAI's Colossus supercomputer is located in Memphis, Tennessee and
 *   powered by Memphis Light, Gas and Water (MLGW).
 *   MLGW published their CY2024 CO2 emission rate as 694.48 lbs/MWh
 *   = 694.48 × 0.000453592 kg/lb / (1/1000 MWh/kWh) = 0.315 kg CO2/kWh.
 *   Source: MLGW Carbon Allocation page (CY2024 data).
 *   https://www.mlgw.com/community/carbonallocation
 *
 * Limitations:
 *   - J/token varies with batch size, sequence length, and actual hardware.
 *     This uses a midpoint estimate; real values range ~0.15–0.21 J/token.
 *   - xAI also runs gas turbines on-site (unpermitted as of 2025), which
 *     would increase effective CI above the grid average.
 *   - This is Boundary A only (no embodied hardware or training amortization).
 *   - Input tokens (prefill) cost less energy than output tokens (decode);
 *     we apply the same rate to both as a simplification.
 */

const J_PER_TOKEN = 0.18;       // joules/token — ML.ENERGY Leaderboard v3.0
const PUE = 1.15;               // AWS 2024 global average
const CI = 0.315;               // kg CO2/kWh — MLGW CY2024
const J_PER_KWH = 3_600_000;   // unit conversion constant

export function calculateCarbonEmissions(tokens: number): number {
  return (tokens * J_PER_TOKEN * PUE * CI) / J_PER_KWH;
}

export function formatCarbon(kg: number): string {
  if (kg < 0.000001) return `${(kg * 1_000_000).toFixed(2)} μg`;
  if (kg < 0.001)    return `${(kg * 1_000).toFixed(4)} mg`;
  if (kg < 1)        return `${(kg * 1_000).toFixed(3)} g`;
  return `${kg.toFixed(6)} kg`;
}

export function getOptimizationSuggestion(tokens: number): string {
  if (tokens > 5000) return 'Try breaking down complex questions into smaller parts to reduce token usage';
  if (tokens > 3000) return 'Consider being more specific in your questions to reduce unnecessary tokens';
  return 'Great! Your queries are efficient';
}
