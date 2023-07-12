import { useRef, useCallback } from 'react';
import { Item, useListState } from 'react-stately';
import { mergeProps, useFocusRing, useListBox, useOption } from 'react-aria';
import './styles.scss';

// From https://react-spectrum.adobe.com/react-aria/useListBox.html

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
        }}
      >
        {[...state.collection].map((item) =>
          item.type === 'section' ? (
            <ListBoxSection key={item.key} section={item} state={state} />
          ) : (
            <Option key={item.key} item={item} state={state} />
          ),
        )}
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

  //   style={{
  //     background: isSelected ? 'bluevioconst' : 'transparent',
  //     color: isDisabled ? '#aaa' : isSelected ? 'white' : null,
  //     padding: '2px 5px',
  //     outline: isFocusVisible ? '2px solid orange' : 'none',
  //   }}

  return (
    <li {...mergeProps(optionProps, focusProps)} ref={ref} className="entry">
      {item.rendered}
    </li>
  );
}

export const Sidebar = ({ entries, storyKey, setStoryKey, setShowSidebar }) => {
  const handleSelectionChange = useCallback((selection) => {
    setStoryKey(Array.from(selection)[0]);
  }, []);

  return (
    <div className="sidebar">
      <div className="entry hide-sidebar" onClick={() => setShowSidebar(false)}>
        hide sidebar
      </div>
      <ListBox
        label="Stories"
        selectionMode="single"
        items={entries}
        onSelectionChange={handleSelectionChange}
      >
        {({ name }) => <Item>{name}</Item>}
      </ListBox>
    </div>
  );
};
