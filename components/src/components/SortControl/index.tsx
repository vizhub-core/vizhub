import { useMemo } from 'react';
import { Form, Dropdown, Row } from '../bootstrap';
import './styles.scss';

export const SortControl = ({
  sortId,
  setSortId,
  sortOptions,
  isVertical = false,
}) => {
  // Possible sorts that are not the current sort.
  const otherSortOptions = useMemo(
    () =>
      sortOptions
        ? sortOptions.filter(({ id }) => id !== sortId)
        : [],
    [sortOptions, sortId],
  );

  // Used for looking up a sort label by id.
  const sortsById = useMemo(
    () =>
      new Map(
        sortOptions
          ? sortOptions.map((sortOption) => [
              sortOption.id,
              sortOption,
            ])
          : [],
      ),
    [sortOptions],
  );

  return (
    <Form.Group
      className="mx-0"
      controlId="sort"
      as={isVertical ? 'div' : Row}
    >
      <Form.Label
        column
        sm="auto"
        className="sort-by-label"
      >
        Sort by
      </Form.Label>
      <div className="px-0 col">
        <Dropdown onSelect={setSortId}>
          <Dropdown.Toggle
            id="dropdown-sort"
            variant="secondary"
          >
            {sortsById.get(sortId)?.label + ' '}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {otherSortOptions.map((sortOption) => (
              <Dropdown.Item
                key={sortOption.id}
                eventKey={sortOption.id}
              >
                {sortOption.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Form.Group>
  );
};
