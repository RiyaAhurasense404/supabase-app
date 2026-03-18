export type Document = {
  id: string
  name: string
  file_path: string
  file_size: number
  file_type: string
  user_id: string
  created_at: string
}

export type UploadPayload = {
  name: string
  file_path: string
  file_size: number
  file_type: string
  user_id: string
}

export type DocumentResponse = {
  message?: string
  error?: string
  document?: Document
  documents?: Document[]
}

export type UploadButtonProps = {
  userId: string
}

export type UploadState = {
  uploading: boolean
  progress: number
  currentChunk: number
  totalChunks: number
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  uploading: false,
  progress: 0,
  currentChunk: 0,
  totalChunks: 0,
}