import type { SessionInfo, TelemetrySession } from "../types/telemetry";

const PRIMARY_FORMULA_KEY = "f1";
const DEFAULT_F1_COMPARISON_KEY = "f1-modern";
const F1_26_COMPARISON_KEY = "f1-26";

function normalizeFormula(formula: SessionInfo["formula"] | undefined): string {
  return formula?.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ") ?? "";
}

export function isRaceSessionType(type: string | undefined): boolean {
  return type?.startsWith("Race") ?? false;
}

export function isQualifyingSessionType(type: string | undefined): boolean {
  return type?.includes("Qualifying") ?? false;
}

export function isRaceSession(session: TelemetrySession): boolean {
  return isRaceSessionType(session["session-info"]["session-type"]);
}

export function getFormulaKey(formula: SessionInfo["formula"] | undefined): string {
  const normalized = normalizeFormula(formula);
  if (
    normalized === "" ||
    normalized === "f1" ||
    normalized.startsWith("f1 ") ||
    normalized === "formula 1" ||
    normalized.startsWith("formula 1 ")
  ) {
    return PRIMARY_FORMULA_KEY;
  }
  return normalized.replace(/\s+/g, "-");
}

export function getFormulaComparisonKey(formula: SessionInfo["formula"] | undefined): string {
  const formulaKey = getFormulaKey(formula);
  if (formulaKey !== PRIMARY_FORMULA_KEY) return formulaKey;

  const normalized = normalizeFormula(formula);
  if (normalized.includes("26") || normalized.includes("2026") || normalized.includes("season pack")) {
    return F1_26_COMPARISON_KEY;
  }

  return DEFAULT_F1_COMPARISON_KEY;
}

export function getFormulaLabel(formula: SessionInfo["formula"] | undefined): string {
  if (getFormulaComparisonKey(formula) === F1_26_COMPARISON_KEY) return "F1 26";
  if (getFormulaKey(formula) === PRIMARY_FORMULA_KEY) return "F1";
  return formula?.trim() || "Unknown";
}

export function isPrimaryFormula(formula: SessionInfo["formula"] | undefined): boolean {
  return getFormulaKey(formula) === PRIMARY_FORMULA_KEY;
}

export function isNonF1Formula(formula: SessionInfo["formula"] | undefined): boolean {
  return !isPrimaryFormula(formula);
}

export function shouldShowFormulaLabel(formula: SessionInfo["formula"] | undefined): boolean {
  return getFormulaComparisonKey(formula) !== DEFAULT_F1_COMPARISON_KEY;
}
