import { PlusSVG } from '../Icons/sam/PlusSVG';
import { Button } from '../bootstrap';
import { useLanguage } from '../LanguageContext';
import './styles.scss';

// Button type constants
export const CREATE_VIZ = 'CREATE_VIZ';
export const CREATE_API_KEY = 'CREATE_API_KEY';

export const CreateNewButton = ({
  href = '/create-viz',
  // Deprecated: use buttonType instead for i18n support
  label = undefined,
  onClick = undefined,
  buttonType = CREATE_VIZ,
}) => {
  const { t } = useLanguage();

  // Get the appropriate translation based on button type
  const getButtonLabel = () => {
    if (label) {
      // Fallback for backward compatibility
      return label;
    }

    switch (buttonType) {
      case CREATE_API_KEY:
        return t('create.button.api-key.label');
      case CREATE_VIZ:
      default:
        return t('create.button.label');
    }
  };

  return (
    <Button
      className="create-new-button"
      href={href}
      onClick={onClick}
    >
      <PlusSVG />
      {getButtonLabel()}
    </Button>
  );
};
