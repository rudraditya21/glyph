import Editor from "./_components/editor"

export default async function EditorPage({ params, }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  console.log(projectId)
  return (
    <div>
      <Editor />
    </div>
  )
}