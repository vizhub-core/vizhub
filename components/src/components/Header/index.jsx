import {
  Nav,
  Navbar,
  Container,
  Dropdown,
  Button,
} from '../bootstrap';
import { HelpSVG } from '../Icons/HelpSVG';
import { LogoSVG } from '../Icons/LogoSVG';
import './styles.css';

export const Header = ({
  authenticatedUserAvatarURL,
  loginHref,
  logoutHref,
  profileHref,
  accountHref,
  onCreateVizClick,
  onForumClick,
  onVizHubClick,
  pricingHref,
  aboutHref,
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
          <Nav.Link href={aboutHref}>About</Nav.Link>
        
          <Nav.Link
            onClick={onForumClick}
            href="https://vizhub.com/forum/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forum
          </Nav.Link>
          <Nav.Link
            href="https://vizhub.com/forum/c/uncategorized/1"
            target="_blank"
          >
            Resources
          </Nav.Link>
          <Nav.Link href={pricingHref}>Pricing</Nav.Link>
          <Nav.Link
            href="https://vizhub.com/forum/c/help/6"
            target="_blank"
            title="Help"
          >
            <HelpSVG />
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
                <Dropdown.Item href={profileHref}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href={accountHref}>
                  Account
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href={logoutHref}>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              as="a"
              href={loginHref}
              className="vh-header-button"
              // style={{margin:'30px',padding:'10px'}}
            >
              Log in
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
