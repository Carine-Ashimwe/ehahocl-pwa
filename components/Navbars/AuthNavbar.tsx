import Image from 'next/image';
import Link from "next/link";
// reactstrap components
import {
  Col, Container, Nav, Navbar, NavbarBrand, NavItem,
  NavLink, Row, UncontrolledCollapse
} from "reactstrap";

function AdminNavbar() {
  return <>
    <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
      <Container className="px-4">
        <Link href="/admin/dashboard" legacyBehavior>
          <span>
            <NavbarBrand href="#pablo">
              <Image src="/img/brand/nextjs_argon_white.png" alt="me" width="130" height="40" />
            </NavbarBrand>
          </span>
        </Link>
        <button className="navbar-toggler" id="navbar-collapse-main">
          <span className="navbar-toggler-icon" />
        </button>
        <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-brand" xs="6">
                <Link href="/admin/dashboard" legacyBehavior>
                  <Image src="/img/theme/team-4-800x800.jpg" alt="me" width="64" height="64" />
                </Link>
              </Col>
              <Col className="collapse-close" xs="6">
                <button className="navbar-toggler" id="navbar-collapse-main">
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link href="/admin/dashboard" legacyBehavior>
                <NavLink href="#pablo" className="nav-link-icon">
                  <i className="ni ni-planet" />
                  <span className="nav-link-inner--text">Dashboard</span>
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/auth/register" legacyBehavior>
                <NavLink href="#pablo" className="nav-link-icon">
                  <i className="ni ni-circle-08" />
                  <span className="nav-link-inner--text">Register</span>
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/auth/login" legacyBehavior>
                <NavLink href="#pablo" className="nav-link-icon">
                  <i className="ni ni-key-25" />
                  <span className="nav-link-inner--text">Login</span>
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/admin/profile" legacyBehavior>
                <NavLink href="#pablo" className="nav-link-icon">
                  <i className="ni ni-single-02" />
                  <span className="nav-link-inner--text">Profile</span>
                </NavLink>
              </Link>
            </NavItem>
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  </>;
}

export default AdminNavbar;
