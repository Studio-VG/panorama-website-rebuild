const patterns = [
  /https?:\/\/\S+/gi,
  /\bwww\.\S+/gi,
  /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi,
  /\b(?:instagram|facebook|fb\.com|whatsapp|wa\.me|telegram|t\.me|tiktok|snapchat)\b[:\s./@-]*\S*/gi,
  /(^|[^\w])@[a-z0-9._]{2,}/gi,
  /\+\d[\d\s().-]{6,}\d/g,
  /\b(?:\d[\s().-]*){8,}\d\b/g,
];

export function stripOffsite(value: string) {
  let text = value;
  for (const pattern of patterns) text = text.replace(pattern, " ");
  return text.replace(/[ \t]{2,}/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function textChanged(before: string, after: string) {
  return before.trim() !== after.trim();
}
