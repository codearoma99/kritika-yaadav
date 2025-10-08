// src/hooks/useContent.js
import { useEffect, useState } from 'react';

const useContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/content'); // Assumes GET /content returns id = 1
        if (!res.ok) throw new Error('Failed to fetch content');
        const data = await res.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error };
};

export default useContent;
