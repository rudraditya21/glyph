export function parseAzureIcon(filename: string) {
  const name = filename
    .replace(/\.svg$/i, "")
    .replace(/^\d+-icon-service-/i, "")
    .replace(/-/g, " ");

  const key = name.replace(/\s+/g, "").toLowerCase();

  return {
    key,
    name: name.replace(/\b\w/g, (char) => char.toUpperCase()),
  };
}
