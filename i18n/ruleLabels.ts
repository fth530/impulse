import { Translations } from "./translations";

export function getRuleLabel(ruleId: string, t: Translations): string {
  if (ruleId === "even") return t.ruleEven;
  if (ruleId === "odd") return t.ruleOdd;
  if (ruleId === "prime") return t.rulePrime;
  if (ruleId.startsWith("gt_")) {
    const n = parseInt(ruleId.split("_")[1], 10);
    return t.ruleGreaterThan(n);
  }
  if (ruleId.startsWith("lt_")) {
    const n = parseInt(ruleId.split("_")[1], 10);
    return t.ruleLessThan(n);
  }
  if (ruleId === "ends_5") return t.ruleEndsWith5;
  if (ruleId === "ends_0") return t.ruleEndsWith0;
  if (ruleId === "mod_3") return t.ruleMultipleOf3;
  return ruleId;
}

export function getDifficultyLabelTranslated(level: number, t: Translations): string {
  switch (level) {
    case 1: return t.diffBeginner;
    case 2: return t.diffIntermediate;
    case 3: return t.diffHard;
    case 4: return t.diffExpert;
    default: return t.diffBeginner;
  }
}
