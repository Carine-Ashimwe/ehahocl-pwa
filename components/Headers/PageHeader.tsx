// reactstrap components
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";

function PageHeader({ page }: { page: any }) {
  return <>
    <div className="header bg-success pb-7 pt-5 pt-md-7">
      <Container fluid>
        <div className="header-body">
          <Row>
            <Col lg="6" xl="7">
              <h6 className="h2 text-white d-inline-block mb-0">{page}</h6>
              <nav aria-label="breadcrumb" className="d-none d-md-inline-block ml-md-4">
                <ol className="breadcrumb breadcrumb-links app-bg-secondary">
                  <li className="breadcrumb-item"><Link href="/admin/dashboard"><i className="fas fa-home text-white"></i></Link></li>
                  <li className="breadcrumb-item active text-white" aria-current="page">{page}</li>
                </ol>
              </nav>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  </>;
}

export default PageHeader;