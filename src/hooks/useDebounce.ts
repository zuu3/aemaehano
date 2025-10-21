import { useEffect, useState } from 'react';

/**
 * 값을 debounce하는 커스텀 훅
 * @param value - debounce할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns debounced 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업: 다음 effect 실행 전 또는 컴포넌트 언마운트 시 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
