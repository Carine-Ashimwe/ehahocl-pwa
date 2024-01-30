import Link from "next/link";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card, CardHeader,
  Col,
  Container,
  Row,
  Table
} from 'reactstrap';
import FarmerHeader from "../../components/Headers/FarmerHeader";
import PurchaseRequests from '../../components/PageChange/PurchaseRequests';
import axios from "../../helpers/axios";
import { IShop, IUser } from '../../interfaces';
import Farmer from '../../layouts/Farmer';
// layout for this page

// core components


const Dashboard = () => {

  const [activeShop, setActiveShop] = useState<IShop>();
  const [user, setUser] = useState<IUser>();
  const [go, setGo] = useState(false);
  const [getPayload, setGetPayload] = useState({});
  const [products, setProducts] = useState(0);
  const [sales, setSales] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [purchase_request, setPurchaseRequest] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);


  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const business = localStorage.getItem('active_shop')
  let business_id: number;
  if (business !== null) {
    business_id = Number(JSON.parse(business).id)
  }
  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      const userstring = localStorage.getItem('user');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
        let get_payload = {};
        get_payload = {
          business_id: JSON.parse(active_shop).id,
          today: true
        };
        setGetPayload(get_payload);
        setGo(true);
      }
      if (userstring) {
        setUser(JSON.parse(userstring));
      }
      if (user && user.role == 'admin') {
        setGo(true);
      }
    }

    async function fetchBusinesses() {
      setLoading(true);
      try {
        const response = await axios.get(`/vendor_data/${business_id}/${true}`);
        const data = response.data.data;
        if (data !== undefined) {
          // console.log(data)
          data.products > 0 && setProducts(data.products);
          data.purchases > 0 && setPurchases(data.purchases);
          data.purchases_requests > 0 && setPurchaseRequest(data.purchases_requests);
          data.sales > 0 && setSales(data.sales);
        }
      } catch (error) {
        console.log(error);

        setError(true);
        setLoading(false);
      }
    }

    fetchBusinesses()
  }, []);


  return <>
    <FarmerHeader />
    {/* Page content */}
    <Container className="mt--7" fluid>

      <Row className="mt-5">
        <Col className="mb-5 mb-xl-0" xl="8">
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <div className="col">
                  <h3 className="mb-0">Today&lsquo;s purchase requests</h3>
                </div>
                <div className="col text-right">
                  <Button
                    color="primary"
                    href="#"
                    size="sm"
                  >
                    <Link
                      href="purchase-requests"
                      style={{ color: 'white', textDecoration: 'none' }}>
                      See all purchase requests
                    </Link>
                  </Button>
                </div>
              </Row>
            </CardHeader>
            <PurchaseRequests business_id={activeShop?.id} go={go} get_payload={getPayload} />
          </Card>
        </Col>
        <Col xl="4">
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <div className="col">
                  <h3 className="mb-0">Today&lsquo;s Activiy</h3>
                </div>
                <div className="col text-right">
                  {/* <Button
                    color="primary"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    See all
                  </Button> */}
                </div>
              </Row>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              {/* <thead className="thead-light">
                <tr>
                  <th scope="col">Referral</th>
                  <th scope="col">Visitors</th>
                  <th scope="col" />
                </tr>
              </thead> */}
              <tbody>
                <tr>
                  <th scope="row">Posts</th>
                  <td>{products}</td>
                  {/* <td>
                    <div className="d-flex align-items-center">
                      <span className="mr-2">60%</span>
                      <div>
                        <Progress
                          max="100"
                          value="60"
                          barClassName="bg-gradient-danger"
                        />
                      </div>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <th scope="row">Orders</th>
                  <td>{purchases}</td>
                  {/* <td>
                    <div className="d-flex align-items-center">
                      <span className="mr-2">70%</span>
                      <div>
                        <Progress
                          max="100"
                          value="70"
                          barClassName="bg-gradient-success"
                        />
                      </div>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <th scope="row">Purchase Reqeusts</th>
                  <td>{sales}</td>
                  {/* <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td> */}
                </tr>
                <tr>
                  <th scope="row">Pre harvests</th>
                  <td>{purchase_request}</td>
                  {/* <td>
                    <div className="d-flex align-items-center">
                      <span className="mr-2">75%</span>
                      <div>
                        <Progress
                          max="100"
                          value="75"
                          barClassName="bg-gradient-info"
                        />
                      </div>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <th scope="row">Pre Orders</th>
                  <td>{purchase_request}</td>
                  {/* <td>
                    <div className="d-flex align-items-center">
                      <span className="mr-2">75%</span>
                      <div>
                        <Progress
                          max="100"
                          value="75"
                          barClassName="bg-gradient-info"
                        />
                      </div>
                    </div>
                  </td> */}
                </tr>
                {/* <tr>
                  <th scope="row">twitter</th>
                  <td>2,645</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="mr-2">30%</span>
                      <div>
                        <Progress
                          max="100"
                          value="30"
                          barClassName="bg-gradient-warning"
                        />
                      </div>
                    </div>
                  </td>
                </tr> */}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  </>;
};

Dashboard.layout = Farmer;

export default Dashboard;
