// reactstrap components
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import axios from "../../helpers/axios";
import Spinner from 'react-bootstrap/Spinner';

// Card styles
const customCardStyle: React.CSSProperties = {
    borderRadius: '10px',
    border: 'none',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease-in-out',
};

function Header() {
  const [businesses, setBusinesses] = useState([]);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState(0);
  const [sales, setSales] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [purchase_request, setPurchaseRequest] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const business = localStorage.getItem('active_shop')
  let business_id: number;
  if (business !== null) {
    business_id = Number(JSON.parse(business).id)
  }
  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      try {
        const response = await axios.get(`/vendor_data/${business_id}/${false}`);
        const data = response.data.data;
        if (data !== undefined) {
          data.products > 0 && setProducts(data.products);
          data.purchases > 0 && setPurchases(data.purchases);
          data.purchases_requests > 0 && setPurchaseRequest(data.purchases_requests);
          data.sales > 0 && setSales(data.sales);
        }

                setLoading(false);
            } catch (error) {
                console.log(error);

                setError(true);

        setLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  return (
    <>
      <div className="header bg-success pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3" className="mt-4 mb-4 mb-md-0">
                <Card style={{ ...customCardStyle }} className={`card-stats mb-4 mb-xl-0 h-100 ${isLoading ? 'bg-light' : ''}`}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Products
                        </CardTitle>
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm" variant="primary" style={{ margin: '10px', borderColor: '#3498db' }} />
                            <Spinner animation="grow" variant="success" style={{ margin: '10px', borderColor: '#3498db' }} />
                          </div>
                        ) : (
                          <>
                            <span className="h2 font-weight-bold mb-0">
                              {products}
                            </span>
                            <div className="small-text text-muted">Products</div>
                          </>
                        )}
                      </div>
                      <Col className="col-auto">
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm"  style={{ margin: '10px', borderColor: '#3498db', color: 'red' }} />
                            <Spinner animation="grow" style={{ margin: '10px', borderColor: '#3498db', color: 'green' }} />
                          </div>
                        ) : (
                          <div className="icon icon-shape text-dark rounded-circle shadow bg-danger">
                            <i className="fas fa-store" />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3" className="mt-4 mb-4 mb-md-0">
                <Card style={{ ...customCardStyle }} className={`card-stats mb-4 mb-xl-0 h-100 ${isLoading ? 'bg-light' : ''}`}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Purchases
                        </CardTitle>
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm" variant="primary" style={{ margin: '10px', borderColor: '#3498db' }} />
                            <Spinner animation="grow" variant="success" style={{ margin: '10px', borderColor: '#3498db' }} />
                          </div>
                        ) : (
                          <>
                            <span className="h2 font-weight-bold mb-0">
                              {purchases}
                            </span>
                            <div className="small-text text-muted">Purchases</div>
                          </>
                        )}
                      </div>
                      <Col className="col-auto">
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm"  style={{ margin: '10px', borderColor: '#3498db', color: 'red' }} />
                            <Spinner animation="grow" style={{ margin: '10px', borderColor: '#3498db', color: 'green' }} />
                          </div>
                        ) : (
                          <div className="icon icon-shape text-dark rounded-circle shadow bg-warning">
                            <i className="fas fa-cart-shopping" />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3" className="mt-4 mb-4 mb-md-0">
                <Card style={{ ...customCardStyle }} className={`card-stats mb-4 mb-xl-0 h-100 ${isLoading ? 'bg-light' : ''}`}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Sales
                        </CardTitle>
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm" variant="primary" style={{ margin: '10px', borderColor: '#3498db' }} />
                            <Spinner animation="grow" variant="success" style={{ margin: '10px', borderColor: '#3498db' }} />
                          </div>
                        ) : (
                          <>
                            <span className="h2 font-weight-bold mb-0">
                              {sales}
                            </span>
                            <div className="small-text text-muted">Sales</div>
                          </>
                        )}
                      </div>
                      <Col className="col-auto">
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm"  style={{ margin: '10px', borderColor: '#3498db', color: 'red' }} />
                            <Spinner animation="grow" style={{ margin: '10px', borderColor: '#3498db', color: 'green' }} />
                          </div>
                        ) : (
                          <div className="icon icon-shape text-dark rounded-circle shadow bg-yellow">
                            <i className="ni ni-shop" />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3" className="mt-4 mb-4 mb-md-0">
                <Card style={{ ...customCardStyle }} className={`card-stats mb-4 mb-xl-0 h-100 ${isLoading ? 'bg-light' : ''}`}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Purchase Requests
                        </CardTitle>
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm" variant="primary" style={{ margin: '10px', borderColor: '#3498db' }} />
                            <Spinner animation="grow" variant="success" style={{ margin: '10px', borderColor: '#3498db' }} />
                          </div>
                        ) : (
                          <>
                            <span className="h2 font-weight-bold mb-0">
                              {purchase_request}
                            </span>
                            <div className="small-text text-muted">Purchase Requests</div>
                          </>
                        )}
                      </div>
                      <Col className="col-auto">
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" size="sm"  style={{ margin: '10px', borderColor: '#3498db', color: 'red' }} />
                            <Spinner animation="grow" style={{ margin: '10px', borderColor: '#3498db', color: 'green' }} />
                          </div>
                        ) : (
                          <div className="icon icon-shape text-dark rounded-circle shadow bg-info">
                            <i className="fas fa-truck" />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
