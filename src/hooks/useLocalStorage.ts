// 로컬 스토리지 커스텀 훅

import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // 초기값 설정 (로컬 스토리지에서 읽기)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getLocalStorage<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setLocalStorage(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 값 삭제 함수
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      removeLocalStorage(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// 로컬 스토리지 값이 변경될 때 감지하는 훅
export const useLocalStorageListener = <T>(key: string, initialValue: T): T => {
  const [value, setValue] = useState<T>(() => {
    const item = getLocalStorage<T>(key);
    return item !== null ? item : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setValue(newValue);
        } catch {
          setValue(event.newValue as T);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return value;
};
