import { useCallback, useEffect, useState } from 'react';
import { getConnection } from '../../useShareDBDocData';

export const useShareDBError = () => {
  const [shareDBError, setShareDBError] = useState(null);

  const dismissShareDBError = useCallback(() => {
    setShareDBError(null);
  }, []);

  useEffect(() => {
    const connection = getConnection();
    const handleError = (error) => {
      console.error('error', error);
      console.error('error.code', error.code);
      console.error('error.message', error.message);
      setShareDBError(error);
    };

    connection.on('error', handleError);
    return () => {
      connection.off('error', handleError);
    };
  }, []);

  return {
    shareDBError,
    dismissShareDBError,
    setShareDBError,
  };
};
