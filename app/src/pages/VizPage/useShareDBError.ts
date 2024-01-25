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
      console.log('error', error);
      console.log('error.code', error.code);
      console.log('error.message', error.message);

      setShareDBError(error);
    };

    connection.on('error', handleError);
    return () => {
      connection.off('error', handleError);
    };
  }, []);

  return { shareDBError, dismissShareDBError };
};
