import {
  Nav,
  Navbar,
  Container,
  Dropdown,
  Button,
} from '../bootstrap';
import { discordLink } from '../discordLink';
import { HelpSVG } from '../Icons/HelpSVG';
import { LogoSVG } from '../Icons/LogoSVG';
import { SearchBox } from '../SearchBox';
import './styles.css';

// Feature flag to enable/disable help icon
const enableHelpSVG = false;

// Feature flag to enable/disable resources link
const enableResources = true;

export const Header = ({
  authenticatedUserAvatarURL,
  loginHref,
  logoutHref,
  profileHref,
  createVizHref,
  onVizHubClick,
  pricingHref,
  showBillingLink,
  onBillingClick,
  initialSearchQuery,
}: {
  authenticatedUserAvatarURL: string;
  loginHref: string;
  logoutHref: string;
  profileHref: string;
  createVizHref: string;
  onVizHubClick: () => void;
  pricingHref: string;
  showBillingLink?: boolean;
  onBillingClick: () => void;
  initialSearchQuery?: string;
}) => (
  <Navbar className="vh-navbar" variant="dark" expand="md">
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
        <Nav className="me-auto d-flex align-items-md-center justify-content-md-center flex-md-grow-1">
          <SearchBox
            initialSearchQuery={initialSearchQuery}
          />
        </Nav>
        <Nav className="align-items-md-center">
          <Nav.Link href={pricingHref}>Pricing</Nav.Link>
          {/* <Nav.Link href="/explore">Explore</Nav.Link> */}
          {/* <Nav.Link href="/features">Features</Nav.Link> */}

          {/* <Nav.Link href={discordLink}>Discord</Nav.Link> */}

          {enableResources && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="dark"
                id="dropdown-resources"
              >
                Resources
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/features">
                  Features
                </Dropdown.Item>
                <Dropdown.Item href={discordLink}>
                  Discord
                </Dropdown.Item>
                <Dropdown.Item href="/forum">
                  Forum
                </Dropdown.Item>
                {/* <Dropdown.Item href="/documentation">
                  Documentation
                </Dropdown.Item> */}
                <Dropdown.Item href="https://github.com/vizhub-core">
                  Open Source
                </Dropdown.Item>
                <Dropdown.Item href="https://github.com/vizhub-core/vizhub/issues/new">
                  Report an issue
                </Dropdown.Item>
                {/* <Dropdown.Item href={createVizHref}>
                  Create Viz
                </Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          )}

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-contact"
            >
              Contact
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="mailto:support@vizhub.com">
                <i className="bi bi-envelope me-2"></i>
                Email Support
              </Dropdown.Item>
              <Dropdown.Item href={discordLink}>
                <i className="bi bi-discord me-2"></i>
                Discord Community
              </Dropdown.Item>
              <Dropdown.Item href="/contact">
                <i className="bi bi-chat-dots me-2"></i>
                Contact Form
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="https://twitter.com/vizhub">
                <i className="bi bi-twitter me-2"></i>
                Twitter
              </Dropdown.Item>
              <Dropdown.Item href="https://github.com/vizhub-core">
                <i className="bi bi-github me-2"></i>
                GitHub
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* <Nav.Link href={createVizHref}>Create</Nav.Link> */}
          {enableHelpSVG && (
            <Nav.Link
              href="https://vizhub.com/forum/c/help/6"
              target="_blank"
              rel="noopener noreferrer"
              title="Help"
            >
              <HelpSVG />
            </Nav.Link>
          )}

          {authenticatedUserAvatarURL ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                className="navbar__avatar-toggle"
                variant="dark"
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
                {/* <Dropdown.Item href={createVizHref}>
                  Create Viz
                </Dropdown.Item> */}
                {/* <Dropdown.Divider /> */}
                <Dropdown.Item href={profileHref}>
                  Profile
                </Dropdown.Item>
                {/* <Dropdown.Divider /> */}
                {/* <Dropdown.Item href={accountHref}>
                  Account
                </Dropdown.Item> */}
                {/* <Dropdown.Divider /> */}
                {showBillingLink && (
                  <Dropdown.Item onClick={onBillingClick}>
                    Billing
                  </Dropdown.Item>
                )}
                <Dropdown.Item href={logoutHref}>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              as="a"
              href={loginHref}
              className="ms-3"
            >
              Log in
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
