// 포맷팅 관련 유틸리티 함수들

/**
 * 출석률을 퍼센트로 포맷팅
 */
export const formatAttendanceRate = (rate: number): string => {
  return `${Math.round(rate)}%`
}

/**
 * 숫자를 한국어 단위로 포맷팅 (예: 1000 -> 1천)
 */
export const formatNumberKorean = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`
  }
  return num.toString()
}

/**
 * 바이트를 읽기 쉬운 형태로 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 전화번호 포맷팅 (010-1234-5678)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  
  return phone
}

/**
 * 이메일 마스킹 (example@email.com -> ex***@email.com)
 */
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  
  const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2)
  return `${maskedUsername}@${domain}`
}

/**
 * 텍스트 자르기 with 말줄임표
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
