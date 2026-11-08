import Editor from "../../../components/editor/editor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <Editor projectId={projectId} />;
}
