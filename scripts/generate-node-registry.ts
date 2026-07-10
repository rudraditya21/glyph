import fs from "fs";
import path from "path";

import { parseAwsIcon } from "./parsers/aws.parser";
import { parseAzureIcon } from "./parsers/azure.parser";
import { parseDefaultIcon } from "./parsers/default.parser";

const ICON_ROOT = path.resolve("public/icons");

const OUTPUT = path.resolve(
  "components/editor/nodes/registry/generated.ts",
);

const COMPONENT_IMPORT =
  `import CatalogNode from "../components/catalog-node";`;

interface ParsedIcon {
  key: string;
  name: string;
}

function parseIcon(
  provider: string,
  filename: string,
): ParsedIcon {
  switch (provider.toLowerCase()) {
    case "aws":
      return parseAwsIcon(filename);

    case "azure":
      return parseAzureIcon(filename);

    default:
      return parseDefaultIcon(filename);
  }
}


function generateNodes() {
  if (!fs.existsSync(ICON_ROOT)) {
    throw new Error(
      `Icon directory does not exist: ${ICON_ROOT}`,
    );
  }

  const providers = fs
    .readdirSync(ICON_ROOT)
    .filter((file) =>
      fs
        .statSync(path.join(ICON_ROOT, file))
        .isDirectory(),
    );


  const nodes = [];


  for (const provider of providers) {
    const providerPath = path.join(
      ICON_ROOT,
      provider,
    );


    const icons = fs
      .readdirSync(providerPath)
      .filter((file) =>
        file.endsWith(".svg"),
      );


    for (const icon of icons) {
      const parsed = parseIcon(
        provider,
        icon,
      );


      nodes.push({
        type: `${provider}.${parsed.key}`,

        label: `${provider}-${parsed.key}`,

        name: parsed.name,

        category:
          provider.toUpperCase(),

        icon:
          `/icons/${provider}/${icon}`,
      });
    }
  }


  return nodes.sort((a, b) =>
    a.type.localeCompare(b.type),
  );
}


function writeRegistry() {
  const nodes = generateNodes();


  const content = `// THIS FILE IS AUTO-GENERATED.
// DO NOT EDIT MANUALLY.

${COMPONENT_IMPORT}

import { EditorNodeDefinition } from "@/types/editor";

export const nodeRegistry: EditorNodeDefinition[] =
${JSON.stringify(nodes, null, 2)}
.map((node) => ({
  ...node,
  component: CatalogNode,
}));
`;


  fs.mkdirSync(
    path.dirname(OUTPUT),
    {
      recursive: true,
    },
  );


  fs.writeFileSync(
    OUTPUT,
    content,
    "utf8",
  );


  console.log(
    `Generated ${nodes.length} nodes`,
  );
}


writeRegistry();