export type ProjectBrief = {
  projectType: string;
  location: string;
  timeline: string;
  budget: string;
  stage: string;
  scope: string[];
  specifications: string;
  notes: string;
};

const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

// Only known option IDs may prefill the form; never accept customer text from a URL.
export function projectTypeFromSearch(search: string, allowedTypes: readonly string[]) {
  const values = new URLSearchParams(search).getAll("service");
  return values.length === 1 && allowedTypes.includes(values[0]) ? values[0] : "not-sure";
}

export function formatProjectBrief(brief: ProjectBrief) {
  return [
    "Hi ACT Creative, I'd like to discuss a project.",
    "",
    `Project type: ${brief.projectType}`,
    `Location: ${brief.location}`,
    `Required date: ${singleLine(brief.timeline) || "To be confirmed"}`,
    `Budget: ${brief.budget}`,
    `Project stage: ${brief.stage}`,
    `Scope: ${brief.scope.join(", ") || "Need advice"}`,
    `Quantity / dimensions: ${singleLine(brief.specifications) || "To be confirmed"}`,
    ...(brief.notes.trim() ? [`Notes: ${brief.notes.trim()}`] : []),
    "",
    "Reference images / drawings: please attach to this email if available.",
  ].join("\n");
}

export function projectBriefSubject(brief: ProjectBrief) {
  // A stable, short subject makes the inbox scannable; free-text notes never enter headers.
  return `Project inquiry | ${brief.projectType} | ${brief.location} | ${singleLine(brief.timeline).slice(0, 60) || "Date TBC"}`;
}

export function projectBriefMailto(brief: ProjectBrief, attribution = "") {
  return `mailto:contact@actcreative.net?subject=${encodeURIComponent(projectBriefSubject(brief))}&body=${encodeURIComponent(formatProjectBrief(brief) + attribution)}`;
}
