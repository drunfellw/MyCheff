import { useCallback, useRef, useMemo } from 'react';

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// React Hooks for Performance

// Debounced callback hook
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
) => {
  const debouncedFn = useMemo(
    () => debounce(callback, delay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay, ...deps]
  );
  
  return useCallback(debouncedFn, [debouncedFn]);
};

// Throttled callback hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  deps: React.DependencyList
) => {
  const throttledFn = useMemo(
    () => throttle(callback, limit),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, limit, ...deps]
  );
  
  return useCallback(throttledFn, [throttledFn]);
};

// Previous value hook
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  const previous = ref.current;
  ref.current = value;
  
  return previous;
};

// Stable callback hook (prevents unnecessary re-renders)
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
};

// Performance measurement
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();
  
  static startMeasurement(label: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }
      
      this.measurements.get(label)!.push(duration);
      
      if (__DEV__) {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }
    };
  }
  
  static getAverageTime(label: string): number {
    const times = this.measurements.get(label);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  static getAllMeasurements(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    this.measurements.forEach((times, label) => {
      result[label] = {
        average: this.getAverageTime(label),
        count: times.length,
      };
    });
    
    return result;
  }
  
  static clearMeasurements(): void {
    this.measurements.clear();
  }
}

// Image optimization utilities
export const optimizeImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // For Unsplash images
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fit', 'crop');
    
    return `${url}?${params.toString()}`;
  }
  
  // For other image services, implement similar logic
  return url;
};

// Memory usage monitoring (React Native specific)
export const getMemoryUsage = (): Promise<number> => {
  return new Promise((resolve) => {
    // React Native doesn't have performance.memory
    // This would need to be implemented with native modules
    resolve(0);
  });
};

// Bundle size analyzer helper
export const analyzeBundleSize = () => {
  if (__DEV__) {
    console.log('📦 Bundle Analysis:');
    console.log('- Use Metro Bundle Analyzer for detailed analysis');
    console.log('- Check for duplicate dependencies');
    console.log('- Consider code splitting for large components');
  }
}; 