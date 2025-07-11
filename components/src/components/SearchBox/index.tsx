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
    <Form
      className="w-100"
      style={{ maxWidth: '400px' }}
      onSubmit={handleSubmit}
    >
      <InputGroup className="position-relative rounded-pill">
        <span
          className="position-absolute top-50 start-0 translate-middle-y ps-3 text-white-50"
          style={{ zIndex: 5, pointerEvents: 'none' }}
        >
          <SearchSVG />
        </span>
        <FormControl
          ref={inputRef}
          className="rounded-pill border-light bg-white bg-opacity-10 text-white ps-5"
          style={{
            height: '38px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: 'none',
            paddingRight: searchQuery ? '3rem' : '1rem',
          }}
          aria-label="Search"
          type="search"
          placeholder="Search visualizations..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        {searchQuery && (
          <Button
            variant="link"
            className="position-absolute top-50 end-0 translate-middle-y text-white-50 p-0 me-3 clear-button"
            style={{ zIndex: 5 }}
            onClick={handleClear}
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
