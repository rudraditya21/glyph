export function parseDefaultIcon(filename: string) {
  const name = filename.replace(/\.svg$/i, "");

  return {
    key: name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
    name,
  };
}
