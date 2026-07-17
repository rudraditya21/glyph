import { EditorNodeDefinition } from "@/types/editor";

import OrganizationNode from "../components/organization-node";

function createCatalogIcon(
  accent: string,
  title: string,
  shape: "frame" | "group" | "section",
) {
  const shapeMarkup = {
    frame: `<rect x="14" y="14" width="68" height="68" rx="16" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="8 7" />`,
    group: `<rect x="18" y="18" width="60" height="60" rx="16" fill="${accent}" fill-opacity="0.16" stroke="${accent}" stroke-width="4" />`,
    section: `<rect x="14" y="14" width="68" height="68" rx="18" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="4" /><rect x="14" y="14" width="68" height="22" rx="12" fill="${accent}" />`,
  }[shape];

  const titleColor = shape === "section" ? "#ffffff" : accent;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
      <rect width="96" height="96" rx="24" fill="white" />
      ${shapeMarkup}
      <text x="48" y="53" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${titleColor}">
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const manualNodeRegistry: EditorNodeDefinition[] = [
  {
    type: "layout.frame",
    label: "Frame",
    name: "Frame",
    category: "LAYOUT",
    icon: createCatalogIcon("#2563eb", "FR", "frame"),
    component: OrganizationNode,
    initialData: {
      description: "Use for a broad area or system boundary.",
      layoutVariant: "frame",
      accentColor: "#2563eb",
    },
    initialNode: {
      connectable: false,
      dragHandle: ".organization-node__header",
      initialWidth: 520,
      initialHeight: 300,
      zIndex: -1,
    },
  },
  {
    type: "layout.group",
    label: "Group",
    name: "Group",
    category: "LAYOUT",
    icon: createCatalogIcon("#059669", "GR", "group"),
    component: OrganizationNode,
    initialData: {
      description: "Use for related services or a functional cluster.",
      layoutVariant: "group",
      accentColor: "#059669",
    },
    initialNode: {
      connectable: false,
      dragHandle: ".organization-node__header",
      initialWidth: 420,
      initialHeight: 260,
      zIndex: -1,
    },
  },
  {
    type: "layout.section",
    label: "Section",
    name: "Section",
    category: "LAYOUT",
    icon: createCatalogIcon("#7c3aed", "SC", "section"),
    component: OrganizationNode,
    initialData: {
      description: "Use for swimlanes, phases, or labeled zones.",
      layoutVariant: "section",
      accentColor: "#7c3aed",
    },
    initialNode: {
      connectable: false,
      dragHandle: ".organization-node__header",
      initialWidth: 560,
      initialHeight: 220,
      zIndex: -1,
    },
  },
];
