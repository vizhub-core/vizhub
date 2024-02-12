import { Info } from 'entities';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// This hook is used to automatically navigate to the correct slug
// when the slug is changed in the database.
export const useSlugAutoNavigate = ({
  info,
  isEmbedMode,
}: {
  info: Info;
  isEmbedMode: boolean;
}) => {
  const { userName, idOrSlug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !isEmbedMode &&
      info.slug &&
      info.slug !== idOrSlug
    ) {
      // navigate(`/${userName}/${info.slug}`);
      // Preserve the query string when navigating
      navigate(
        `/${userName}/${info.slug}${window.location.search}`,
      );
    }
  }, [info.id, info.slug]);
};
