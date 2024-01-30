import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card, CardHeader, Col,
  Container, Modal, ModalBody, ModalHeader, Row,
  Table
} from 'reactstrap';
import { ILocation, IShop } from '../../interfaces';
import { disableBusiness, enableBusiness } from '../../pages/api/user';
import { GetVendors } from '../../pages/api/vendors';
import PageHeader from '../Headers/PageHeader';
import DataEnteries from '../Pagination/dataSize';
import TablePagination from '../Pagination/pagination';
// layout for this page

// core components


const AdminVendors = ({ vendor }: { vendor: number }) => {

  const [viewVendorModal, setViewVendorModal] = useState(false);

  const [viewSaleModal, setViewSaleModal] = useState(false);
  const [viewVendorAddressModal, setViewVendorAddressModal] = useState(false);
  const [viewedVendor, setViewedVendor] = useState<IShop>();
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  let get_payload = {
    user_id: null,
    sector_id: vendor,
    paginate: true,
    page: page,
    dataSize: dataSize

  };
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch } = useQuery<any, Error>(
    [`vendors_${vendor}`],
    () => GetVendors(get_payload)
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

  const [businessId, setBusinessId] = useState<number | undefined>(undefined);

  const handleDisable = async (id: number) => {
    try {
      const response = await disableBusiness({ id });
      if (response && response.status) {
        console.log(response);
        toast.success("Business disabled successfully");
        refetch();
      } else {
        const message = response?.message || "Something went wrong!";
        toast.error(message);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleEnable = async (id: number) => {
    try {
      const response = await enableBusiness({ id });
      if (response && response.status) {
        console.log(response);
        toast.success("Business restored successfully");
        refetch();
      } else {
        const message = response?.message || "Something went wrong!";
        toast.error(message);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message || "Something went wrong!");
    }
  };

  function notify(msg_type: string) {
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

  const toggleViewVendorAddressModal = (vendor: IShop | undefined = undefined) => {
    if (vendor != undefined) {
      setViewedVendor(vendor);
    }
    setViewVendorAddressModal(!viewVendorAddressModal);
  }

  return <>
    <ToastContainer />
    <PageHeader page="Vendors" />
    {/* Page content */}
    <Container className="mt--7" fluid>

      <Row className="mt-5">
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <div className="col">
                  <h3 className="mb-0">Vendors</h3>
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
                  <th className="no-wrap">Business Type</th>
                  <th className="no-wrap">Business Name</th>
                  <th className="no-wrap">Business Logo</th>
                  <th className="no-wrap">Business Banner</th>
                  <th className="no-wrap">Business Owner</th>
                  <th className="no-wrap">Business Phone</th>
                  <th className="no-wrap">Business Email</th>
                  <th className="no-wrap">Business Address</th>
                  <th className="no-wrap">Business status</th>
                  <th className="no-wrap">Joined date</th>
                  <th className="no-wrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  isFetching || isLoading ? (
                    <option>Loading available vendors...</option>
                  )
                    : isError ? (
                      <option>Error: {error.message}</option>
                    )
                      : isSuccess && data[0].length > 0 ? (
                        data[0].map((business: IShop, index: number) => (
                          <tr key={index}>
                            <td>{(index + 1)}</td>
                            <td className="no-wrap">{business.user_sector?.sector.sector_name}</td>
                            <td className="no-wrap">{business.business_name}</td>
                            <td className="no-wrap">
                              <img src={business.business_logo} alt={business.business_name} width={50} />
                            </td>
                            <td className="no-wrap">
                              <img src={business.banner_image} alt={business.business_name} width={50} />
                            </td>
                            <td className="no-wrap">{business.user_sector?.user.profile?.first_name} {business.user_sector?.user.profile?.last_name}</td>
                            <td className="no-wrap">{business.business_phone}</td>
                            <td className="no-wrap">{business.business_email}</td>
                            <td className="no-wrap">
                              {
                                <Button
                                  className="bg-success text-white"
                                  size="sm"
                                  onClick={() => toggleViewVendorAddressModal(business)}
                                >View Address
                                </Button>
                              }
                            </td>
                            <td>{business.active}</td>
                            <td>{business.created_at}</td>
                            <td>
                              {vendor == 1 ? (
                                <Link href={`farmer-posts/${business.id}`} legacyBehavior>
                                  <i className="fas fa-shopping-basket"></i>
                                </Link>
                              ) : vendor == 2 || vendor == 3 ? (
                                <Link href={`vendors-products/${business.id}`} legacyBehavior>
                                  <i className="fas fa-shopping-basket"></i>
                                </Link>
                              ) : null} |
                              {business.active === "Yes" ? (
                                <a href="javascript:void(0)" onClick={() => handleDisable(business.id || 0)}>
                                  <i className="fas fa-ban text-danger mr-1 ml-1"></i>
                                </a>
                              ) : (
                                <a href="javascript:void(0)" onClick={() => handleEnable(business.id || 0)}>
                                  <i className="fas fa-check-circle text-success mr-1 ml-1"></i>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      )
                        : (
                          <option>No vendor found</option>
                        )
                }
              </tbody>
              <tfoot>
                <tr>
                  <th>ID</th>
                  <th className="no-wrap">Business Type</th>
                  <th className="no-wrap">Business Name</th>
                  <th className="no-wrap">Business Logo</th>
                  <th className="no-wrap">Business Banner</th>
                  <th className="no-wrap">Business Owner</th>
                  <th className="no-wrap">Business Phone</th>
                  <th className="no-wrap">Business Email</th>
                  <th className="no-wrap">Business Address</th>
                  <th className="no-wrap">Business status</th>
                  <th className="no-wrap">Joined date</th>
                  <th className="no-wrap">Actions</th>
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

    {/* Display shipping Address */}
    <Modal
      isOpen={viewVendorAddressModal}
      toggle={() => toggleViewVendorAddressModal()}
      centered={true}
      size="md"
    >
      <ModalHeader toggle={() => toggleViewVendorAddressModal()}> {viewedVendor?.business_name} Address</ModalHeader>
      <ModalBody>
        <table>
          <tbody>
            <tr>
              <th>Province</th>
              <td>: {(viewedVendor?.province as ILocation)?.name}</td>
            </tr>
            <tr>
              <th>District</th>
              <td>: {(viewedVendor?.district as ILocation)?.name}</td>
            </tr>
            <tr>
              <th>Sector</th>
              <td>: {(viewedVendor?.sector as ILocation)?.name}</td>
            </tr>
            <tr>
              <th>Cell</th>
              <td>: {(viewedVendor?.cell as ILocation)?.name}</td>
            </tr>
            <tr>
              <th>Village</th>
              <td>: {(viewedVendor?.village as ILocation)?.name}</td>
            </tr>
            <tr>
              <th>Street Number</th>
              <td>: {viewedVendor?.street_number}</td>
            </tr>
            <tr>
              <th>Common Name</th>
              <td>: {viewedVendor?.common_place}</td>
            </tr>
          </tbody>
        </table>
      </ModalBody>
    </Modal>
  </>;
};

export default AdminVendors;

function setData(updatedData: any[]) {
  throw new Error('Function not implemented.');
}
function setErrorMsg(arg0: string) {
  throw new Error('Function not implemented.');
}

function setSuccessMsg(arg0: string) {
  throw new Error('Function not implemented.');
}

