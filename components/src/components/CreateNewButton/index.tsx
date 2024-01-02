import { PlusSVG } from '../Icons/sam/PlusSVG';
import { Button } from '../bootstrap';
import './styles.scss';

export const CreateNewButton = () => (
  <Button className="create-new-button" href="/create-viz">
    <PlusSVG />
    Create new
  </Button>
);
