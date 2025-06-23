import { PlusSVG } from '../Icons/sam/PlusSVG';
import { Button } from '../bootstrap';
import './styles.scss';

export const CreateNewButton = ({
  href = '/create-viz',
  label = 'Create visualization',
  onClick = undefined,
}) => (
  <Button
    className="create-new-button"
    href={href}
    onClick={onClick}
  >
    <PlusSVG />
    {label}
  </Button>
);
