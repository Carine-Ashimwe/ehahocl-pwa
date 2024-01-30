/*eslint-disable*/
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from '../../helpers/axios';
import ProfileLink from './ProfileLink';
// nodejs library to set properties for components


// reactstrap components
import {
  Col, Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Form,
  Input, InputGroup, InputGroupText, Media, Nav, Navbar, NavbarBrand, NavItem,
  NavLink, Row, UncontrolledDropdown
} from "reactstrap";

var ps;

function Sidebar(props: any) {
  // used for checking current route
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [UserRole, setUserRole] = useState("");
  const [UserPicture, setUserPicture] = useState("");
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: any) => {
    return router.route.indexOf(routeName) > -1;
  };

  useEffect(() => {
    const user_role = localStorage.getItem("user");
    if (user_role !== null) {
      setUserRole(JSON.parse(user_role).role);
      setUserPicture(JSON.parse(user_role).profile.user_picture);
      // console.log(UserRole)
    }
  }, []);

  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // logout
  const logout = async () => {
    return await axios.post('/logout')
      .then((res) => {
        if (res.data.status) {
          // console.log(res.data);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('active_shop');
          window.location.href = "/auth/login";
        }
      })
      .catch((error) => {
        alert(error);
      })
  };

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes: any) => {
    return routes.map((prop: any, key: string) => {
      return (
        <NavItem key={key} active={activeRoute(prop.layout + prop.path)}>
          <Link href={prop.layout + prop.path} legacyBehavior>
            <NavLink
              href="#ehaho"
              active={activeRoute(prop.layout + prop.path)}
              onClick={closeCollapse}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </Link>
        </NavItem>
      );
    });
  };
  const { routes, logo } = props;
  // console.log(logo.imgSrc)
  let navbarBrand = (
    <NavbarBrand href="#pablo" className="pt-0">
      <div className="d-none d-md-block"> {/* Display on screens larger than mobile */}
        <img src="/img/brand/ehaho-logo.png" alt="ehaho-logo" width="100" height="110" style={{ maxHeight: '110px', width: '100%' }} />
      </div>
      <div className="d-md-none"> {/* Display on mobile screens */}
        <div style={{ width: '50px', height: '50px', marginLeft: '-40px' }}>
          <img src='/img/brand/ehaho-logo.png' alt='logo' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </NavbarBrand>
  );
  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo && logo.innerLink ? (
          <Link href={logo.innerLink} legacyBehavior>
            <span>{navbarBrand}</span>
          </Link>
        ) : null}
        {logo && logo.outterLink ? (
          <a href={logo.innerLink} target="_blank">
            {navbarBrand}
          </a>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
            <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <Image
                    src="/img/theme/user.png"
                    alt="me"
                    width="100"
                    height="30"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" end>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <ProfileLink userRole={UserRole} />
              {/* <Link href="/admin/profile" legacyBehavior>
                <DropdownItem>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
              </Link>
              <Link href="/admin/profile">
                <DropdownItem>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
              </Link>
              <Link href="/admin/profile">
                <DropdownItem>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
              </Link> */}
              <DropdownItem divider />
              <NavItem>
                <Link
                  href="http://178.62.195.18/"
                  target="_blank"
                  rel="noopener noreferrer"
                  legacyBehavior>
                  <NavLink title="Click to go to the Marketplace" style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="ni ni-shop text-primary" style={{ marginRight: '8px' }} />
                    <span>Go to Marketplace</span>
                  </NavLink>
                </Link>
              </NavItem>
              {/* <NavItem>
                <Link href="http://178.62.195.18/" target="_blank" rel="noopener noreferrer">
                  <NavLink title="Click to go to the Marketplace" style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Go to Marketplace</span>
                    <span role="img" aria-label="Right Arrow" style={{ marginLeft: '8px', fontSize: '1.2rem' }}>➡️</span>
                  </NavLink>
                </Link>
              </NavItem> */}
              {/* <NavItem>
                <Link href="http://178.62.195.18/" target="_blank" rel="noopener noreferrer">
                  <NavLink title="Go to Marketplace" style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Go to Marketplace</span>
                    <i style={{ marginLeft: '8px', fontSize: '1.2rem', verticalAlign: 'middle' }}>&rarr;</i>
                  </NavLink>
                </Link>
              </NavItem> */}
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={() => { logout() }}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link href={logo.innerLink} legacyBehavior>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          {/* <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupText>
                <span className="fa fa-search" />
              </InputGroupText>
            </InputGroup>
          </Form> */}
          {/* Navigation */}
          <Nav navbar>
            {createLinks(routes)}

            <NavItem active={activeRoute("/auth/logout")}>
              <Link href="#" onClick={() => { logout() }} legacyBehavior>
                <NavLink
                  href="#ehaho"
                  active={activeRoute("/auth/logout")}
                  onClick={() => { logout() }}
                >
                  <i className="ni ni-button-power text-red" />
                  Logout
                </NavLink>
              </Link>
            </NavItem>
          </Nav>

        </Collapse>
      </Container>
    </Navbar>
  );
}

Sidebar.defaultProps = {
  routes: [{}],
};

// Sidebar.propTypes = {
//   // links that will be displayed inside the component
//   routes: PropTypes.arrayOf(PropTypes.object),
//   logo: PropTypes.shape({
//     // innerLink is for links that will direct the user within the app
//     // it will be rendered as <Link href="...">...</Link> tag
//     innerLink: PropTypes.string,
//     // outterLink is for links that will direct the user outside the app
//     // it will be rendered as simple <a href="...">...</a> tag
//     outterLink: PropTypes.string,
//     // the image src of the logo
//     imgSrc: PropTypes.string.isRequired,
//     // the alt for the img
//     imgAlt: PropTypes.string.isRequired,
//   }),
// };

export default Sidebar;
