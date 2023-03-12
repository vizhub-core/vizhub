import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import './header.css';

// Inspired by:
// https://react-bootstrap.netlify.app/components/dropdowns/#custom-dropdown-components
const AvatarToggle = forwardRef(({ children, onClick }, ref) => (
  <button
    type="button"
    className="navbar__avatar-toggle dropdown-toggle"
    ref={ref}
    onClick={onClick}
  >
    {children}
  </button>
));

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateViz,
  onProfile,
  onForum,
  onVizHub,
}) => (
  <Navbar bg="dark" variant="dark" expand="md">
    <Container fluid>
      <Navbar.Brand
        style={{ cursor: 'pointer' }}
        onClick={onVizHub}
      ></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" />
        <Nav className="align-items-md-center">
          <Nav.Link onClick={onForum}>Forum</Nav.Link>
          {user ? (
            <Dropdown align="end">
              <Dropdown.Toggle as={AvatarToggle}>
                <Image
                  src="https://github.com/mdo.png"
                  roundedCircle
                  width="32"
                  height="32"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onCreateViz}>Create Viz</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onProfile}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onLogout}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button size="sm" className="vh-header-button" onClick={onLogin}>
              Log in
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

Header.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onCreateViz: PropTypes.func,
  onProfile: PropTypes.func,
  onForum: PropTypes.func,
  onVizHub: PropTypes.func,
};
