import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const {
    immediate = true,
    onSuccess = null,
    onError = null,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
  } = options;

  // Execute the API call
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      setLastFetch(Date.now());
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      } else {
        console.error('API Error:', err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  // Check if data is stale
  const isStale = useCallback(() => {
    if (!lastFetch || !cacheDuration) return true;
    return Date.now() - lastFetch > cacheDuration;
  }, [lastFetch, cacheDuration]);

  // Refresh data if needed
  const refresh = useCallback(() => {
    if (isStale()) {
      execute();
    }
  }, [execute, isStale]);

  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    isStale: isStale(),
    lastFetch,
  };
};

// Hook for paginated data
export const usePaginatedApi = (apiFunction, initialParams = {}, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const {
    pageSize = 10,
    onSuccess = null,
    onError = null,
  } = options;

  const loadData = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...initialParams,
        page: pageNum,
        limit: pageSize,
      };

      const result = await apiFunction(params);
      const newData = result.data || result.items || [];
      
      setData(prevData => append ? [...prevData, ...newData] : newData);
      setTotalCount(result.totalCount || result.total || 0);
      setHasMore(newData.length === pageSize);
      setPage(pageNum);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, initialParams, pageSize, onSuccess, onError]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadData(page + 1, true);
    }
  }, [loadData, loading, hasMore, page]);

  const refresh = useCallback(() => {
    loadData(1, false);
  }, [loadData]);

  useEffect(() => {
    loadData(1, false);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    totalCount,
    loadMore,
    refresh,
  };
};

// Hook for mutations (POST, PUT, DELETE operations)
export const useMutation = (mutationFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const {
    onSuccess = null,
    onError = null,
    resetOnExecute = true,
  } = options;

  const execute = useCallback(async (...args) => {
    setLoading(true);
    
    if (resetOnExecute) {
      setError(null);
      setData(null);
    }

    try {
      const result = await mutationFunction(...args);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFunction, onSuccess, onError, resetOnExecute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    execute,
    reset,
    loading,
    error,
    data,
  };
};

// Hook for optimistic updates
export const useOptimisticMutation = (mutationFunction, updateFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess = null,
    onError = null,
  } = options;

  const execute = useCallback(async (optimisticUpdate, ...args) => {
    setLoading(true);
    setError(null);

    // Apply optimistic update immediately
    const previousData = data;
    const optimisticData = updateFunction(data, optimisticUpdate);
    setData(optimisticData);

    try {
      const result = await mutationFunction(...args);
      
      // Update with real data from server
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      // Revert optimistic update on error
      setData(previousData);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [data, mutationFunction, updateFunction, onSuccess, onError]);

  return {
    execute,
    data,
    loading,
    error,
    setData,
  };
};

// Hook for debounced API calls (useful for search)
export const useDebouncedApi = (apiFunction, delay = 500, options = {}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Use the regular useApi hook with debounced query
  const apiResult = useApi(
    () => apiFunction(debouncedQuery),
    [debouncedQuery],
    { immediate: !!debouncedQuery, ...options }
  );

  return {
    ...apiResult,
    query,
    setQuery,
    debouncedQuery,
  };
};

export default useApi;
