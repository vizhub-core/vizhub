import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Nav, Navbar, Container, Dropdown, Image, Button } from '../bootstrap';
import '../index.scss';
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
  authenticatedUserAvatarURL,
  onLoginClick,
  onLogoutClick,
  onCreateVizClick,
  onProfileClick,
  onForumClick,
  onVizHubClick,
}) => (
  <Navbar bg="dark" variant="dark" expand="md">
    <Container fluid>
      <Navbar.Brand style={{ cursor: 'pointer' }} onClick={onVizHubClick}>
        VizHub 3 Beta
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" />
        <Nav className="align-items-md-center">
          <Nav.Link
            onClick={onForumClick}
            href="https://vizhub.com/forum/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forum
          </Nav.Link>
          {authenticatedUserAvatarURL ? (
            <Dropdown align="end">
              <Dropdown.Toggle as={AvatarToggle}>
                <Image
                  src={authenticatedUserAvatarURL}
                  roundedCircle
                  width="32"
                  height="32"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onCreateVizClick}>
                  Create Viz
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onProfileClick}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onLogoutClick}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              size="sm"
              className="vh-header-button"
              onClick={onLoginClick}
            >
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
