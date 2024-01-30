/*eslint-disable*/

// reactstrap components
import { Col, Container, Nav, NavLink, Row } from "reactstrap";

function Login() {
  return (
    <>
      <footer className="py-5">
        <Container>
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
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavLink
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Version 2.0
                </NavLink>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Login;
