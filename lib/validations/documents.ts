export type DocumentValidationResult = {
    isValid: boolean
    error: string | null
  }
  
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',      
    'image/heic',      
    'image/heif',        
    'image/gif',        
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  
  export function validateDocument(file: File): DocumentValidationResult {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Only PDF, JPG, PNG, DOC, DOCX allowed' }
    }
  
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size must be less than 5MB' }
    }
  
    return { isValid: true, error: null }
  }