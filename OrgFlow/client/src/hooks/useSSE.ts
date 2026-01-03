import { useEffect, useState } from 'react';

/**
 * Minimal hook for Server-Sent Events (SSE).
 * Used for receiving real-time notifications from the backend.
 */
export const useSSE = (url: string) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSource(url, {
      withCredentials: true, // Required for JWT in cookies if applicable
    });

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return data;
};
