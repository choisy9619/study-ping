// 브라우저 스토리지 관련 유틸리티 함수들

/**
 * 로컬 스토리지에 JSON 데이터 저장
 */
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * 로컬 스토리지에서 JSON 데이터 읽기
 */
export const getLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item)
  } catch (error) {
    console.error('Failed to read from localStorage:', error)
    return null
  }
}

/**
 * 로컬 스토리지에서 항목 삭제
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

/**
 * 세션 스토리지에 JSON 데이터 저장
 */
export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value)
    sessionStorage.setItem(key, serialized)
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error)
  }
}

/**
 * 세션 스토리지에서 JSON 데이터 읽기
 */
export const getSessionStorage = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item)
  } catch (error) {
    console.error('Failed to read from sessionStorage:', error)
    return null
  }
}

/**
 * 세션 스토리지에서 항목 삭제
 */
export const removeSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from sessionStorage:', error)
  }
}

/**
 * 로컬 스토리지 전체 초기화
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

/**
 * 세션 스토리지 전체 초기화
 */
export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear()
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error)
  }
}

/**
 * 스토리지 사용 가능 여부 확인
 */
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type]
    const test = '__storage_test__'
    storage.setItem(test, test)
    storage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * 스토리지 사용량 계산 (대략적)
 */
export const getStorageSize = (type: 'localStorage' | 'sessionStorage'): number => {
  let total = 0
  const storage = window[type]
  
  for (const key in storage) {
    if (storage.hasOwnProperty(key)) {
      total += storage[key].length + key.length
    }
  }
  
  return total
}
