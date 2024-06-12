import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useCallback } from 'react';

export const useDebounce = (callback: () => void) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };
    return debounce(func, 500);
  }, []);

  return useCallback(debouncedCallback, []);
};
