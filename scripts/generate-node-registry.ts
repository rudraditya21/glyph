import fs from "fs";
import path from "path";

const ICON_ROOT = path.resolve("public/icons");
const OUTPUT = path.resolve("components/editor/nodes/registry/index.ts");

const COMPONENT_IMPORT = `import CatalogNode from "../components/catalog-node";`;

function normalizeName(filename: string) {
  return filename
    .replace(".svg", "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function generateNodes() {
  const providers = fs
    .readdirSync(ICON_ROOT)
    .filter((file) => fs.statSync(path.join(ICON_ROOT, file)).isDirectory());

  const nodes = [];

  for (const provider of providers) {
    const providerPath = path.join(ICON_ROOT, provider);

    const icons = fs
      .readdirSync(providerPath)
      .filter((file) => file.endsWith(".svg"));

    for (const icon of icons) {
      const name = normalizeName(icon);

      nodes.push({
        type: `${provider}.${name}`,
        label: `${provider}-${name}`,
        name: icon.replace(/\.svg$/i, ""),
        category: provider.toUpperCase(),
        icon: `/icons/${provider}/${icon}`,
      });
    }
  }

  return nodes.sort((a, b) => a.type.localeCompare(b.type));
}

function writeRegistry() {
  const nodes = generateNodes();

  const content = `
// THIS FILE IS AUTO-GENERATED.
// DO NOT EDIT MANUALLY.

${COMPONENT_IMPORT}

import { EditorNodeDefinition } from "@/types/editor";

export const nodeRegistry: EditorNodeDefinition[] = ${JSON.stringify(
    nodes,
    null,
    2,
  )}.map((node) => ({
  ...node,
  component: CatalogNode,
}));
`;

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

  fs.writeFileSync(OUTPUT, content, "utf8");

  console.log(`Generated ${nodes.length} nodes`);
}

writeRegistry();
