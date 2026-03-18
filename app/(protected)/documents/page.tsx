import { getCurrentUser } from '@/lib/queries/auth'
import { getAllDocuments } from '@/lib/queries/documents'
import UploadButton from '@/components/documents/UploadButton'
import DocumentList from '@/components/documents/DocumentList'

export default async function DocumentsPage() {
  const { data: user } = await getCurrentUser()
  const { data: documents } = await getAllDocuments()

  return (
    <div>
      <h1>Documents</h1>
      <UploadButton userId={user?.id!} />
      <br /><br />
      <DocumentList documents={documents ?? []} />
    </div>
  )
}