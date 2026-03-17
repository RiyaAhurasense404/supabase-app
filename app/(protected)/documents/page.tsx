import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/queries/auth'
import { getAllDocuments } from '@/lib/queries/documents'
import UploadButton from '@/components/documents/UploadButton'
import DocumentList from '@/components/documents/DocumentList'

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: user } = await getCurrentUser(supabase)

  const { data: documents } = await getAllDocuments(supabase)

  return (
    <div>
      <h1>Documents</h1>

      <UploadButton userId={user?.id!} />

      <br /><br />

      <DocumentList documents={documents ?? []} />
    </div>
  )
}