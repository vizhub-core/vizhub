import { useMemo } from 'react';
import { Form, Dropdown, Row, Col } from '../bootstrap';

export const SortControl = ({ sortId, setSortId, sortOptions }) => {
  // Possible sorts that are not the current sort.
  const otherSortOptions = useMemo(
    () => (sortOptions ? sortOptions.filter(({ id }) => id !== sortId) : []),
    [sortOptions, sortId]
  );

  // Used for looking up a sort label by id.
  const sortsById = useMemo(
    () =>
      new Map(
        sortOptions
          ? sortOptions.map((sortOption) => [sortOption.id, sortOption])
          : []
      ),
    [sortOptions]
  );

  return (
    <Form.Group className="mb-3" controlId="sort" as={Row}>
      <Form.Label column sm="auto">
        Sort by
      </Form.Label>
      <Col className="px-0">
        <Dropdown onSelect={setSortId}>
          <Dropdown.Toggle id="dropdown-sort">
            {sortsById.get(sortId)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {otherSortOptions.map((sortOption) => (
              <Dropdown.Item key={sortOption.id} eventKey={sortOption.id}>
                {sortOption.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Form.Group>
  );
};
