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

// Feature flag to enable/disable help icon
const enableHelpSVG = false;

// Feature flag to enable/disable resources link
const enableResourcesLink = false;

// Feature flag to enable/disable pricing page link
const enablePricingLink = true;

const enableExploreLink = true;

export const Header = ({
  authenticatedUserAvatarURL,
  loginHref,
  logoutHref,
  profileHref,
  createVizHref,
  onVizHubClick,
  pricingHref,
  resourcesHref,
  exploreHref,
  showBillingLink,
  onBillingClick,
}: {
  authenticatedUserAvatarURL: string;
  loginHref: string;
  logoutHref: string;
  profileHref: string;
  createVizHref: string;
  onVizHubClick: () => void;
  pricingHref: string;
  resourcesHref: string;
  exploreHref?: string;
  showBillingLink?: boolean;
  onBillingClick: () => void;
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
          {enableExploreLink && (
            <Nav.Link href={exploreHref}>Explore</Nav.Link>
          )}

          <Nav.Link
            href="https://vizhub.com/forum/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forum
          </Nav.Link>
          {enableResourcesLink && (
            <Nav.Link
              href={resourcesHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resources
            </Nav.Link>
          )}
          {enablePricingLink && (
            <Nav.Link
              href={pricingHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pricing
            </Nav.Link>
          )}
          <Nav.Link href={createVizHref}>Create</Nav.Link>
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
              className="vh-header-button"
            >
              Log in
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
