export function parseGcpIcon(filename: string) {
  const name = filename
    .replace(/\.svg$/i, "")
    .replace(/-512-color(-rgb)?$/i, "")
    .trim();

  return {
    key: name.toLowerCase(),
    name,
  };
}
