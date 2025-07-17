import { PlusSVG } from '../Icons/sam/PlusSVG';
import { Button } from '../bootstrap';
import { useLanguage } from '../LanguageContext';
import './styles.scss';

export const CreateNewButton = ({
  href = '/create-viz',
  label = undefined,
  onClick = undefined,
}) => {
  const { t } = useLanguage();

  return (
    <Button
      className="create-new-button"
      href={href}
      onClick={onClick}
    >
      <PlusSVG />
      {label || t('create.button.label')}
    </Button>
  );
};
