import { useCallback, useState } from 'react';
import { Button, Form, FormControl } from '../bootstrap';

export const SearchBox = () => {
  // State to track the input value
  const [searchQuery, setSearchQuery] = useState('');

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
        className="vh-search-box me-2"
        aria-label="Search"
        value={searchQuery} // Bind input value to state
        onChange={handleInputChange} // Update state on input change
      />
      <Button variant="outline-light" type="submit">
        Search
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
