import { useCallback } from 'react';
import { Form } from '../bootstrap';
import '../index.scss';

const visibilities = {
  public: 'Anyone can see this viz',
  unlisted: 'Anyone with the link can see this viz',
  private: 'Only collaborators can see this viz',
};

export const VisibilityControl = ({ visibility, setVisibility }) => {
  const handleChange = useCallback((event) => {
    setVisibility(event.target.value);
  }, []);
  return (
    <Form.Group className="mb-3" controlId="visibility">
      <Form.Label>Visibility</Form.Label>
      <div>
        {Object.keys(visibilities).map((value) => (
          <Form.Check
            inline
            key={value}
            type="radio"
            id={value}
            value={value}
            label={value}
            checked={visibility === value}
            onChange={handleChange}
          />
        ))}
      </div>
      <Form.Text className="text-muted">{visibilities[visibility]}</Form.Text>
    </Form.Group>
  );
};
