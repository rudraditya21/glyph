// Generated registry entry point plus manual layout nodes.
// The generated registry is created by scripts/generate-node-registry.ts

import { nodeRegistry as generatedNodeRegistry } from "./generated";
import { manualNodeRegistry } from "./manual";

export const nodeRegistry = [...manualNodeRegistry, ...generatedNodeRegistry];
