'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { handleUpload } from '@/lib/services/upload'
import { UploadButtonProps, UploadState, INITIAL_UPLOAD_STATE } from '@/types/document'

export default function UploadButton({ userId }: UploadButtonProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>(INITIAL_UPLOAD_STATE)

  const updateProgress = (percent: number, chunk: number, total: number) => {
    setState(prev => ({ ...prev, progress: percent, currentChunk: chunk, totalChunks: total }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setState({ ...INITIAL_UPLOAD_STATE, uploading: true })

    try {
      await handleUpload(file, userId, updateProgress)
      toast.success('Document uploaded successfully!')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message ?? 'Something went wrong')
    } finally {
      setState(INITIAL_UPLOAD_STATE)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={state.uploading}
      >
        {state.uploading ? `Uploading... ${state.progress}%` : 'Upload Document'}
      </button>
      {state.uploading && <ProgressBar {...state} />}
    </>
  )
}

function ProgressBar({ progress, currentChunk, totalChunks }: UploadState) {
  return (
    <div>
      <div style={{
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '8px',
        marginTop: '8px',
        height: '12px',
      }}>
        <div style={{
          width: `${progress}%`,
          backgroundColor: '#3ecf8e',
          height: '12px',
          borderRadius: '8px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <p style={{ fontSize: '12px', marginTop: '4px' }}>
        {totalChunks > 1
          ? `Chunk ${currentChunk} of ${totalChunks} — ${progress}%`
          : `Uploading... ${progress}%`
        }
      </p>
    </div>
  )
}