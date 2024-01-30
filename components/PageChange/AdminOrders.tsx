import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card, CardHeader, Col,
  Container, Modal, ModalBody, ModalHeader, Row,
  Table
} from 'reactstrap';
import { IDoneSale, IDoneSaleProduct } from '../../interfaces';
import { GetSales } from '../../pages/api/sales';
import PageHeader from '../Headers/PageHeader';
import DataEnteries from '../Pagination/dataSize';
import TablePagination from '../Pagination/pagination';
// layout for this page

// core components


const AdminOrders = ({ vendor }: { vendor: number }) => {

  const [viewSaleModal, setViewSaleModal] = useState(false);
  const [viewClientModal, setViewClientModal] = useState(false);
  const [viewSAddressModal, setViewSAddressModal] = useState(false);
  const [viewedSale, setViewedSale] = useState<IDoneSale>();
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);


  let get_payload = {
    category_id: vendor,
    sale_channel: 'Online',
    paginate: true,
    page: page,
    dataSize: dataSize
  };
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    [`orders_${vendor}`],
    () => GetSales(get_payload)
  );
  useEffect(() => {
    'business_id' in get_payload && refetch();
  }, [dataSize])
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data[1] / dataSize));
    }
  }, [data]);

  const handlePageClick = async (newPage: number) => {
    await new Promise<void>((resolve) => {
      setPage(newPage)
      resolve();
    });

    refetch();
  }
  const notify = (msg_type: string) => {
    if (msg_type === 'error') {
      toast.error(isError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  }

  useEffect(() => {
    if (isError) {
      notify('error')
    }
  }, [isError])

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
      <ToastContainer />
      <PageHeader page="Products" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Orders</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    {/* <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>*/}
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Products</th>
                    <th className="no-wrap">Total Payment</th>
                    <th className="no-wrap">Payment method</th>
                    <th className="no-wrap">Payment status</th>
                    <th className="no-wrap">Sale invoice</th>
                    <th className="no-wrap">Customer</th>
                    <th className="no-wrap">Shipping Address</th>
                    <th className="no-wrap">Sale channel</th>
                    <th className="no-wrap">Sale date</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (
                      <option>Loading available sales...</option>
                    )
                      : isError ? (
                        <option>Error: {error.message}</option>
                      )
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((sale: IDoneSale, index: number) => (
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
                              <td className="no-wrap">{sale.order_paid_amount} RWF</td>
                              <td className="no-wrap">{sale.payment_method}</td>
                              <td className="no-wrap">{sale.payment_status}</td>
                              <td className="no-wrap">{sale.order_invoice}</td>
                              <td className="no-wrap">
                                {
                                  <Button
                                    className="bg-success text-white"
                                    size="sm"
                                    onClick={() => toggleViewClientModal(sale)}
                                  >View Customer
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
                              <td>{sale.sale_channel}</td>
                              <td>{sale.sale_date}</td>
                            </tr>
                          ))
                        )
                          : (
                            <option>No sale found</option>
                          )
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Products</th>
                    <th className="no-wrap">Total Payment</th>
                    <th className="no-wrap">Payment method</th>
                    <th className="no-wrap">Payment status</th>
                    <th className="no-wrap">Sale invoice</th>
                    <th className="no-wrap">Customer</th>
                    <th className="no-wrap">Shipping Address</th>
                    <th className="no-wrap">Sale channel</th>
                    <th className="no-wrap">Sale Date</th>
                  </tr>
                </tfoot>
              </Table>
              <TablePagination
                isLoading={isLoading}
                isError={isError}
                error={error}
                page={page}
                totalPages={totalPages}
                handlePageClick={handlePageClick}
              />
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
        <ModalHeader toggle={() => toggleViewSaleModal()}> Sale&#39;s products on {viewedSale?.sale_date} </ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
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
                        <img src={(sale_products.business_product.business_images && sale_products.business_product.business_images.length > 0 && sale_products.business_product.business_images[0].image_path) || ''} alt={sale_products.business_product.product?.product_name} width={50} />
                      </td>
                      <td>{sale_products.business_product.product?.product_name}</td>
                      <td>{sale_products.unit_price} RWF</td>
                      <td>{sale_products.quantity} {sale_products.package.package_name}</td>
                      <td>{sale_products.quantity * sale_products.unit_price} RWF</td>
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
              {/* <tr>
                <th>Names</th>
                <td>: {viewedSale?.buyer?.profile?.first_name} {viewedSale?.buyer?.profile?.last_name}</td>
              </tr> */}
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

export default AdminOrders;