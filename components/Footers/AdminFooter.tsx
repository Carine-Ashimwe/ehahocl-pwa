/*eslint-disable*/

// reactstrap components
import { Col, NavItem, NavLink, Row } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "} eHaho All Rights Reserved by
            <a
              className="font-weight-bold ml-1"
              href="https://spiderbit.rw"
              rel="noopener noreferrer"
              target="_blank"
            >
              Spiderbit LTD.
            </a>
          </div>
        </Col>

        <Col xl="6">
          <div className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                href="#"
                onClick={(e) => e.preventDefault()}
                rel="noopener noreferrer"
                target="_blank"
              >
                Version 2.0
              </NavLink>
            </NavItem>
          </div>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
