// node.js library that concatenates classes (strings)
// javascipt plugin for creating charts
// react plugin used to create charts
// reactstrap components
import { useEffect, useState } from 'react';
import {
  Button,
  Card, CardHeader,
  Col,
  Container,
  Row,
  Table
} from 'reactstrap';
import Header from '../../components/Headers/Header';
import axios from "../../helpers/axios";
import { IShop } from '../../interfaces';
import Admin from '../../layouts/Admin';

const Dashboard = () => {
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
          setBusinesses(data.slice(0, 5));
        }
        // console.log(data);

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
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">User Businesses</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Business name</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4}>Loading registered businesses...</td>
                    </tr>
                  ) : (
                    businesses.length === 0 ? (
                      <tr>
                        <td colSpan={4}>No registered businesses</td>
                      </tr>
                    ) : (
                      businesses.map((business: IShop, index: number) => (
                        <tr key={index}>
                          <th scope="row">{business.business_name}</th>
                          <td>{business.user_sector?.sector.sector_name}</td>
                          <td>{`${business.user_sector?.user.profile?.first_name} ${business.user_sector?.user.profile?.last_name}`}</td>
                          <td>{business.sector.name}, {business.district.name}</td>
                        </tr>
                      ))
                    )
                  )}
                  {isError && (
                    <tr>
                      <td colSpan={4}>An error occurred while fetching businesses</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Sites</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Site Name</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">INES-Ruhengeri</th>
                    <td>Musanze</td>
                  </tr>
                  <tr>
                    <th scope="row">IPRC-Kigali</th>
                    <td>Kicukiro</td>
                  </tr>
                  <tr>
                    <th scope="row">ISAIE-Busogo</th>
                    <td>Rwaza</td>
                  </tr>
                  <tr>
                    <th scope="row">KMS</th>
                    <td>Kayonza</td>
                  </tr>
                  <tr>
                    <th scope="row">Mahindra-Veesh</th>
                    <td>Hyderabad</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Dashboard.layout = Admin;

export default Dashboard;
