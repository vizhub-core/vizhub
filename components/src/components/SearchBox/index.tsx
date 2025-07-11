import { useCallback, useState, useRef } from 'react';
import {
  Button,
  Form,
  FormControl,
  InputGroup,
} from '../bootstrap';
import { SearchSVG } from '../Icons/sam/SearchSVG';
import './styles.scss';

export const SearchBox = ({
  initialSearchQuery,
}: {
  initialSearchQuery?: string;
}) => {
  // State to track the input value
  const [searchQuery, setSearchQuery] = useState(
    initialSearchQuery || '',
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler to update state with input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };

  // Perform a hard navigation to the search page
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
      }
    },
    [searchQuery],
  );

  // Clear the search input
  const handleClear = useCallback(() => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Form className="search-form" onSubmit={handleSubmit}>
      <InputGroup className="search-box-container">
        <div className="search-icon-wrapper">
          <SearchSVG />
        </div>
        <FormControl
          ref={inputRef}
          className="thin-border-search-box no-glow"
          aria-label="Search"
          type="search"
          placeholder="Search visualizations..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        {searchQuery && (
          <Button
            variant="link"
            className="clear-button"
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
          >
            ×
          </Button>
        )}
      </InputGroup>
    </Form>
  );
};

// import { Button, Form, FormControl } from '../bootstrap';

// export const SearchBox = () => {
//   return (
//     <Form className="d-flex">
//       <FormControl
//         className="vh-search-box me-2"
//         aria-label="Search"
//       />
//       <Button variant="outline-light">Search</Button>
//     </Form>
//   );
// };
