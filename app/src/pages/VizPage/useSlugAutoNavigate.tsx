import { Info } from 'entities';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// This hook is used to automatically navigate to the correct slug
// when the slug is changed in the database.
export const useSlugAutoNavigate = (info: Info) => {
  const { userName, idOrSlug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (info.slug && info.slug !== idOrSlug) {
      navigate(`/${userName}/${info.slug}`);
    }
  }, [info.id, info.slug]);
};
