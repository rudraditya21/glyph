import { EditorNodeDefinition } from "@/types/editor";

import OrganizationNode from "../components/organization-node";

export const manualNodeRegistry: EditorNodeDefinition[] = [
  {
    type: "layout.container",
    label: "Container",
    name: "Container",
    category: "LAYOUT",
    hiddenInCatalog: true,
    component: OrganizationNode,
    initialData: {
      label: "New Container",
    },
    initialNode: {
      connectable: false,
      dragHandle: ".organization-node__header",
      initialWidth: 520,
      initialHeight: 280,
      zIndex: -1,
    },
  },
];
