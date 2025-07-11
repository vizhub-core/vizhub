import { useCallback, useState } from 'react';
import { Button, Form, FormControl } from '../bootstrap';
import { SearchSVG } from '../Icons/sam/SearchSVG';

export const SearchBox = ({
  initialSearchQuery,
}: {
  initialSearchQuery?: string;
}) => {
  // State to track the input value
  const [searchQuery, setSearchQuery] = useState(
    initialSearchQuery || '',
  );

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
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    },
    [searchQuery],
  );

  return (
    <Form className="d-flex" onSubmit={handleSubmit}>
      <FormControl
        className="form-control thin-border-search-box no-glow"
        aria-label="Search"
        type="search"
        placeholder="Search"
        value={searchQuery} // Bind input value to state
        onChange={handleInputChange} // Update state on input change
      />

      <Button variant="link" type="submit">
        <SearchSVG />
      </Button>
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
