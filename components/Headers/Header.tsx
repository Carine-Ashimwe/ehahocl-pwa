
// reactstrap components
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import axios from "../../helpers/axios";
import { IShop } from '../../interfaces';
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
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      try {
        const response = await axios.get('/user_businesses');
        const data = response.data;
        if (data !== undefined) {
          setBusinesses(data);
        }

        // Grouping businesses by sector and counting the number of businesses per sector
        const businessesBySector: { [key: string]: number } = data.reduce((acc: { [key: string]: number }, business: any) => {
          const sectorName = business.user_sector?.sector.sector_name;
          if (sectorName) {
            if (!acc[sectorName]) {
              acc[sectorName] = 1;
            } else {
              acc[sectorName]++;
            }
          }
          return acc;
        }, {});

        // console.log(businessesBySector);

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
              {['Agrodealer', 'Producer', 'Farming', 'Delivery'].map((sector, index) => (
                <Col key={index} lg="6" xl="3" className="mt-4 mb-4 mb-md-0">
                  <Card style={{ ...customCardStyle }} className="card-stats mb-xl-0 h-100">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            {sector} Shops
                          </CardTitle>
                          {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center h-100">
                              <Spinner animation="grow" size="sm" variant="primary" style={{ margin: '10px', borderColor: '#3498db' }} />
                              <Spinner animation="grow" variant="success" style={{ margin: '10px', borderColor: '#3498db' }} />
                            </div>
                          ) : (
                            <>
                              <span className="h2 font-weight-bold mb-0">
                                {businesses.filter((business: IShop) => business.user_sector?.sector.sector_name === sector).length}
                              </span>
                              <div className="small-text text-muted">Shops</div>
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
                            <div className="icon icon-shape text-dark rounded-circle shadow">
                              {/* Icons based on sector */}
                              {sector === 'Agrodealer' && <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                <i className="fas fa-store" />
                              </div>}
                              {sector === 'Producer' && <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                <i className="fas fa-industry" />
                              </div>}
                              {sector === 'Farming' && <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                <i className="ni ni-shop" />
                              </div>}
                              {sector === 'Delivery' && <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                <i className="fas fa-truck" />
                              </div>}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;