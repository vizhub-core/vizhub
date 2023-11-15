import { Nav } from '../bootstrap';

export const ShareSectionsNav = ({
  section,
  handleSectionSelect,
  navItems,
}) => (
  <Nav
    variant="pills"
    defaultActiveKey={section}
    onSelect={handleSectionSelect}
  >
    {navItems.map((item) => (
      <Nav.Item key={item.key}>
        <Nav.Link eventKey={item.key}>
          {item.title}
        </Nav.Link>
      </Nav.Item>
    ))}
  </Nav>
);
