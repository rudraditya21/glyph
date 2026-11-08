import {
  convertToExcalidrawElements,
  MIME_TYPES,
} from "@excalidraw/excalidraw";
import type { FileId } from "@excalidraw/excalidraw/element/types";
import type {
  BinaryFiles,
  DataURL,
  LibraryItem,
  LibraryItems,
} from "@excalidraw/excalidraw/types";

type CloudProvider = "aws" | "azure" | "gcp";

interface CloudIconDefinition {
  id: string;
  name: string;
  provider: CloudProvider;
  source: string;
}

interface CloudLibraryData {
  files: BinaryFiles;
  libraryItems: LibraryItems;
}

const CLOUD_ICON_SAMPLES = {
  aws: [
    { id: "aws.ec2", name: "EC2", source: "/icons/aws/EC2.svg" },
    {
      id: "aws.s3",
      name: "Simple Storage Service",
      source: "/icons/aws/Simple-Storage-Service.svg",
    },
    { id: "aws.lambda", name: "Lambda", source: "/icons/aws/Lambda.svg" },
    {
      id: "aws.route53",
      name: "Route 53",
      source: "/icons/aws/Route-53.svg",
    },
  ],
  azure: [
    {
      id: "azure.virtual-machine",
      name: "Virtual Machine",
      source: "/icons/azure/10021-icon-service-Virtual-Machine.svg",
    },
    {
      id: "azure.storage-accounts",
      name: "Storage Accounts",
      source: "/icons/azure/10086-icon-service-Storage-Accounts.svg",
    },
    {
      id: "azure.key-vaults",
      name: "Key Vaults",
      source: "/icons/azure/10245-icon-service-Key-Vaults.svg",
    },
    {
      id: "azure.function-apps",
      name: "Function Apps",
      source: "/icons/azure/10029-icon-service-Function-Apps.svg",
    },
  ],
  gcp: [
    {
      id: "gcp.compute-engine",
      name: "Compute Engine",
      source: "/icons/gcp/ComputeEngine-512-color-rgb.svg",
    },
    {
      id: "gcp.cloud-storage",
      name: "Cloud Storage",
      source: "/icons/gcp/Cloud_Storage-512-color.svg",
    },
    {
      id: "gcp.bigquery",
      name: "BigQuery",
      source: "/icons/gcp/BigQuery-512-color.svg",
    },
    {
      id: "gcp.cloud-run",
      name: "Cloud Run",
      source: "/icons/gcp/CloudRun-512-color-rgb.svg",
    },
  ],
} as const;

function getIconDefinitions(): CloudIconDefinition[] {
  return Object.entries(CLOUD_ICON_SAMPLES).flatMap(([provider, icons]) =>
    icons.map((icon) => ({
      ...icon,
      provider: provider as CloudProvider,
    })),
  );
}

function assertUniqueIds(definitions: CloudIconDefinition[]) {
  const ids = new Set<string>();

  for (const definition of definitions) {
    if (ids.has(definition.id)) {
      throw new Error(`Duplicate cloud library ID: ${definition.id}`);
    }

    ids.add(definition.id);
  }
}

function readBlobAsDataURL(blob: Blob) {
  return new Promise<DataURL>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(reader.result as DataURL));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(blob);
  });
}

async function createLibraryItem(
  definition: CloudIconDefinition,
): Promise<{ file: BinaryFiles[string]; item: LibraryItem }> {
  const response = await fetch(definition.source);

  if (!response.ok) {
    throw new Error(`Failed to load cloud icon: ${definition.source}`);
  }

  const fileId = `glyph-cloud-${definition.id}` as FileId;
  const dataURL = await readBlobAsDataURL(
    new Blob([await response.text()], { type: MIME_TYPES.svg }),
  );
  const [element] = convertToExcalidrawElements(
    [
      {
        type: "image",
        id: `glyph-cloud-element-${definition.id}`,
        x: 0,
        y: 0,
        width: 160,
        height: 160,
        fileId,
        status: "saved",
        roughness: 0,
        customData: {
          glyph: {
            id: definition.id,
            provider: definition.provider,
            source: definition.source,
          },
        },
      },
    ],
    { regenerateIds: false },
  );

  if (!element) {
    throw new Error(`Failed to create cloud library item: ${definition.id}`);
  }

  return {
    file: {
      id: fileId,
      dataURL,
      mimeType: MIME_TYPES.svg,
      created: Date.now(),
    },
    item: {
      id: definition.id,
      status: "published",
      created: Date.now(),
      name: `${definition.provider.toUpperCase()} · ${definition.name}`,
      elements: [element],
    },
  };
}

async function createCloudLibrary(): Promise<CloudLibraryData> {
  const definitions = getIconDefinitions();

  assertUniqueIds(definitions);

  const results = await Promise.allSettled(definitions.map(createLibraryItem));
  const files: BinaryFiles = {};
  const libraryItems: LibraryItem[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") {
      console.error("Failed to create cloud library item", result.reason);
      continue;
    }

    files[result.value.file.id] = result.value.file;
    libraryItems.push(result.value.item);
  }

  return { files, libraryItems };
}

let cloudLibraryPromise: Promise<CloudLibraryData> | null = null;

export function loadCloudLibrary() {
  cloudLibraryPromise ??= createCloudLibrary();

  return cloudLibraryPromise;
}
