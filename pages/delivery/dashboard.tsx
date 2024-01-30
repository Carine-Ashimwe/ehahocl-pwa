import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Button,
  Card, CardHeader,
  Col,
  Container,
  Modal, ModalBody, ModalHeader,
  Row,
  Table
} from 'reactstrap';
import Header from '../../components/Headers/Header';
import { IDoneSale, IDoneSaleProduct, IShop } from '../../interfaces';
import Delivery from '../../layouts/Delivery';
import { GetSales } from '../../pages/api/sales';

// layout for this page

// core components

const Dashboard = () => {
  const [activeShop, setActiveShop] = useState<IShop | null>(null);
  const [viewSaleModal, setViewSaleModal] = useState(false);
  const [viewClientModal, setViewClientModal] = useState(false);
  const [viewSAddressModal, setViewSAddressModal] = useState(false);
  const [viewedSale, setViewedSale] = useState<IDoneSale>();
  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
        //   setGreenLight(true);
      }
    }
  }, []);
  useEffect(() => {
    const active_shop = localStorage.getItem('active_shop');
    if (active_shop) {
      setActiveShop(JSON.parse(active_shop));
    }
    refetch()
  }, [])
  let get_payload = {
    sale_channel: 'Online',
    delivery_id: activeShop && activeShop.id != undefined ? (activeShop?.id) : (undefined),
    today: true
  };
  const { isLoading, isError, error, isSuccess, data, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    [`deliveries_1`],
    () => GetSales(get_payload),
    { enabled: !!activeShop }
  );
  console.log('data=>',data)

  const toggleViewSaleModal = (sale: IDoneSale | undefined = undefined) => {
    if (sale != undefined) {
      setViewedSale(sale);
    }
    setViewSaleModal(!viewSaleModal);
  }

  const toggleViewClientModal = (sale: IDoneSale | undefined = undefined) => {
    if (sale != undefined) {
      setViewedSale(sale);
    }
    setViewClientModal(!viewClientModal);
  }

  const toggleViewSAddressModal = (sale: IDoneSale | undefined = undefined) => {
    if (sale != undefined) {
      setViewedSale(sale);
    }
    setViewSAddressModal(!viewSAddressModal);
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0 d-flex justify-content-center" xl={12}>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Today&lsquo;s deliveries</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="deliveries"
                      size="sm"
                    >
                      View all deliveries
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Products</th>
                    <th className="no-wrap">Payment status</th>
                    <th className="no-wrap">Customer</th>
                    <th className="no-wrap">Shipping Address</th>
                    <th className="no-wrap">Sale date</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (
                      <option>Loading available deliveries...</option>
                    )
                      : isError ? (
                        <option>Error: {error.message}</option>
                      )
                        : isSuccess && data.length > 0 ? (
                          data.map((sale: IDoneSale, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1)}</td>
                              <td>
                                <Button
                                  className='bg-success text-white'
                                  size="sm"
                                  onClick={() => toggleViewSaleModal(sale)}
                                >
                                  {sale.products.length} products
                                </Button>

                              </td>
                              <td className="no-wrap">{sale.payment_status}</td>
                              <td className="no-wrap">
                                {
                                  <Button
                                  className="bg-success text-white"
                                  size="sm"
                                  onClick={() => toggleViewClientModal(sale)}
                                >
                                  {sale?.buyer?.profile.first_name} {sale?.buyer?.profile.last_name}
                                </Button>
                                }
                              </td>
                              <td className="no-wrap">
                                {
                                  sale.shipping_address ? (
                                    <Button
                                      className="bg-success text-white"
                                      size="sm"
                                      onClick={() => toggleViewSAddressModal(sale)}
                                    >Shipping Address
                                    </Button>
                                  )
                                    : ("Own delivery")
                                }
                              </td>
                              <td>{sale.sale_date}</td>
                            </tr>
                          ))
                        )
                          : (
                            <option>No delivery found</option>
                          )
                  }
                </tbody>                
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Display products */}
      <Modal
        isOpen={viewSaleModal}
        toggle={() => toggleViewSaleModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleViewSaleModal()}> Delivery&#39;s products on {viewedSale?.sale_date} </ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Vendor</th>
                <th>Vendor Phone</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {
                viewedSale?.products ? (
                  viewedSale?.products.map((sale_products: IDoneSaleProduct, index: number) => (
                    <tr key={index}>
                      <td>{(index + 1)}</td>
                      <td>
                        <img src={(sale_products.business_product.business_images && sale_products.business_product.business_images.length > 0 && sale_products.business_product.business_images[0].image_path) || (sale_products.business_product.product?.images && sale_products.business_product.product?.images.length > 0 && sale_products.business_product.product?.images[0].image_path) || ''} alt={sale_products.business_product.product?.product_name} width={50} />
                      </td>
                      <td>{sale_products.business_product.product?.product_name}</td>
                      <td>{sale_products.quantity} {sale_products.package.package_name}</td>
                      <td>{sale_products.business_product.business?.business_name}</td>
                      <td>{sale_products.business_product.business?.business_phone}</td>
                      <td>{sale_products.order_status}</td>
                    </tr>
                  ))
                )
                  : (null)
              }
            </tbody>
          </Table>
        </ModalBody>
      </Modal>

      {/* Display client */}
      <Modal
        isOpen={viewClientModal}
        toggle={() => toggleViewClientModal()}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={() => toggleViewClientModal()}> Sale&#39;s client on {viewedSale?.sale_date} </ModalHeader>
        <ModalBody>
          <table>
            <tbody>
              <tr>
                <th>Names</th>
                <td>: {viewedSale?.buyer?.profile.first_name} {viewedSale?.buyer?.profile.last_name}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>: {viewedSale?.buyer?.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>: {viewedSale?.buyer?.email}</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>

      {/* Display shipping Address */}
      <Modal
        isOpen={viewSAddressModal}
        toggle={() => toggleViewSAddressModal()}
        centered={true}
        size="md"
      >
        <ModalHeader toggle={() => toggleViewSAddressModal()}> Sale&#39;s Shipping Address on {viewedSale?.sale_date} </ModalHeader>
        <ModalBody>
          <table>
            <tbody>
              <tr>
                <th>Province</th>
                <td>: {viewedSale?.shipping_address?.province?.name}</td>
              </tr>
              <tr>
                <th>District</th>
                <td>: {viewedSale?.shipping_address?.district?.name}</td>
              </tr>
              <tr>
                <th>Sector</th>
                <td>: {viewedSale?.shipping_address?.sector.name}</td>
              </tr>
              <tr>
                <th>Cell</th>
                <td>: {viewedSale?.shipping_address?.cell.name}</td>
              </tr>
              <tr>
                <th>Village</th>
                <td>: {viewedSale?.shipping_address?.village.name}</td>
              </tr>
              <tr>
                <th>Street Number</th>
                <td>: {viewedSale?.shipping_address?.street_number}</td>
              </tr>
              <tr>
                <th>Common Name</th>
                <td>: {viewedSale?.shipping_address?.common_place}</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </>
  );
};

Dashboard.layout = Delivery;

export default Dashboard;
