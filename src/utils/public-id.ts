export function generatePublicId(prefix: "USR" | "ADM" | "MST", sequence: number) {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  return `${prefix}-${yy}${mm}${dd}-${String(sequence).padStart(6, "0")}`;
}