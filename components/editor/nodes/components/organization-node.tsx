import { NodeProps, NodeResizer } from "@xyflow/react";
import type { CSSProperties } from "react";

import { EditorNode } from "@/types/editor";

const organizationNodeStyles = {
  frame: {
    shell:
      "border-dashed bg-background/55 shadow-[0_0_0_1px_var(--border)_inset] backdrop-blur-[2px]",
    header:
      "rounded-full border border-border/80 bg-background/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground shadow-sm",
    body: "text-muted-foreground",
  },
  group: {
    shell:
      "border-solid bg-secondary/35 shadow-[0_0_0_1px_var(--border)_inset] backdrop-blur-[1px]",
    header:
      "rounded-xl border border-border/80 bg-background/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm",
    body: "text-muted-foreground",
  },
  section: {
    shell:
      "border-solid bg-[color-mix(in_oklch,var(--muted),transparent_22%)] shadow-[0_0_0_1px_var(--border)_inset]",
    header:
      "rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-sm",
    body: "text-foreground/70",
  },
} as const;

export default function OrganizationNode({
  data,
  selected,
}: NodeProps<EditorNode>) {
  const variant = data.layoutVariant ?? "frame";
  const styles = organizationNodeStyles[variant];
  const accentColor = data.accentColor ?? "var(--primary)";
  const accentStyle = {
    "--organization-accent": accentColor,
  } as CSSProperties;

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={280}
        minHeight={160}
        color="var(--organization-accent)"
        lineStyle={{ borderColor: accentColor, opacity: 0.7 }}
        handleStyle={{
          width: 12,
          height: 12,
          borderWidth: 2,
          borderColor: "var(--background)",
          backgroundColor: accentColor,
          borderRadius: 999,
        }}
      />
      <div
        style={accentStyle}
        className={`h-full w-full rounded-[26px] border p-3 text-left ${styles.shell}`}
      >
        <div className="organization-node__header flex items-start justify-between gap-3">
          <div
            className={styles.header}
            style={{
              borderColor:
                variant === "section" ? "transparent" : "var(--organization-accent)",
              color: variant === "section" ? undefined : "var(--organization-accent)",
              backgroundColor:
                variant === "section"
                  ? "var(--organization-accent)"
                  : undefined,
            }}
          >
            <div>{data.label}</div>
            {data.description ? (
              <div className="mt-1 text-[11px] font-normal normal-case tracking-normal opacity-80">
                {data.description}
              </div>
            ) : null}
          </div>
          <div className="rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {variant}
          </div>
        </div>

        <div
          className={`mt-4 flex h-[calc(100%-4.25rem)] items-end rounded-[18px] border border-dashed p-4 text-xs ${styles.body}`}
          style={{
            borderColor: "color-mix(in oklch, var(--organization-accent), var(--border) 60%)",
          }}
        >
          Arrange related nodes inside this {variant}.
        </div>
      </div>
    </>
  );
}
