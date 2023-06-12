import PropTypes from 'prop-types';
import { Nav, Navbar, Container, Dropdown, Button } from '../bootstrap';
import { LogoSVG } from '../Icons/LogoSVG';
import './styles.css';

export const HeaderBody = ({
  authenticatedUserAvatarURL,
  loginHref,
  logoutHref,
  profileHref,
  onCreateVizClick,
  onForumClick,
  onVizHubClick,
}) => (
  <Navbar bg="dark" variant="dark" expand="md">
    <Container fluid>
      <Navbar.Brand
        className="vh-brand-logo"
        style={{ cursor: 'pointer' }}
        onClick={onVizHubClick}
      >
        <LogoSVG height={32} />
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
              <Dropdown.Toggle
                className="navbar__avatar-toggle"
                variant="secondary"
                id="authenticated-user-actions-dropdown"
              >
                <img
                  src={authenticatedUserAvatarURL}
                  width="32"
                  height="32"
                  className="rounded-circle"
                ></img>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onCreateVizClick}>
                  Create Viz
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href={profileHref}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href={logoutHref}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button as="a" href={loginHref} className="vh-header-button">
              Log in
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

HeaderBody.propTypes = {
  user: PropTypes.shape({}),
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onCreateViz: PropTypes.func,
  onProfile: PropTypes.func,
  onForum: PropTypes.func,
  onVizHub: PropTypes.func,
};
