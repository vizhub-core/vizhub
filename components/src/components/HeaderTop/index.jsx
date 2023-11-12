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

export const HeaderTop = ({
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
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" />
        <Nav className="align-items-md-left">
          <Nav.Link>VizHub for</Nav.Link>
          <Button variant="secondary" size="sm">
            <Nav.Link href="">Individuals</Nav.Link>
          </Button>
          <Button variant="secondary" size="sm">
            <Nav.Link href="">Professionals</Nav.Link>
          </Button>
          <Button variant="secondary" size="sm">
            <Nav.Link href="">Enterprises</Nav.Link>
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
