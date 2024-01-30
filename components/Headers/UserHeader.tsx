
// reactstrap components
import { Col, Container, Row } from "reactstrap";

function UserHeader(props: any) {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center profile-header-bg"
      >
        {/* Mask */}
        <span className="mask bg-success opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Hello {props.user.profile.first_name + ' ' + props.user.profile.last_name} </h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default UserHeader;
