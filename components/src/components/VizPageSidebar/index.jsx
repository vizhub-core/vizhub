import { useRef, useState } from 'react';
import { Item, useListState } from 'react-stately';
import { mergeProps, useFocusRing, useListBox, useOption } from 'react-aria';

import './styles.scss';

function ListBox(props) {
  // Create state based on the incoming props
  const state = useListState(props);

  // Get props for the listbox element
  const ref = useRef(null);
  const { listBoxProps, labelProps } = useListBox(props, state, ref);

  return (
    <>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          padding: 0,
          margin: '5px 0',
          listStyle: 'none',
          border: '1px solid gray',
          maxWidth: 250,
          maxHeight: 300,
          overflow: 'auto',
        }}
      >
        {[...state.collection].map((item) => (
          <Option key={item.key} item={item} state={state} />
        ))}
      </ul>
    </>
  );
}

function Option({ item, state }) {
  // Get props for the option element
  const ref = useRef(null);
  const { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  );

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      style={{
        background: isSelected ? 'blueviolet' : 'transparent',
        color: isDisabled ? '#aaa' : isSelected ? 'white' : null,
        padding: '2px 5px',
        outline: isFocusVisible ? '2px solid orange' : 'none',
      }}
    >
      {item.rendered}
    </li>
  );
}

// Inspired by:
// https://react-spectrum.adobe.com/react-aria/useListBox.html
export const VizPageSidebar = () => {
  const options = [
    { id: 1, name: 'Aardvark' },
    { id: 2, name: 'Cat' },
    { id: 3, name: 'Dog' },
    { id: 4, name: 'Kangaroo' },
    { id: 5, name: 'Koala' },
    { id: 6, name: 'Penguin' },
    { id: 7, name: 'Snake' },
    { id: 8, name: 'Turtle' },
    { id: 9, name: 'Wombat' },
  ];

  const [selected, setSelected] = useState(new Set());

  const handleSelectionChange = (set) => {
    console.log(Array.from(set));
    setSelected(set);
  };

  return (
    <div className="vh-viz-page-sidebar">
      <ListBox
        label="Alignment"
        selectionMode="single"
        items={options}
        selectedKeys={selected}
        onSelectionChange={handleSelectionChange}
      >
        {(item) => <Item>{item.name}</Item>}
      </ListBox>
    </div>
  );
};
