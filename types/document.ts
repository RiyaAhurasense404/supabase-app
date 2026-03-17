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
