// reactstrap components
import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Table
} from "reactstrap";
// layout for this page
// core components
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IPurchaseRequest } from '../../interfaces';
import { GetPurchaseRequests } from '../../pages/api/purchase-requests';
import TablePagination from '../Pagination/pagination';
const PurchaseRequests = ({ get_payload, business_id, go }: { get_payload: any, business_id: number | undefined | null, go: boolean }) => {
  // let initialValues:IPurchaseRequest = {
  //   business_product_id: 0,
  //   purchase_quantity: 0,
  //   purchase_package: 0,
  //   purchase_date: '',
  //   packages: [
  //     {
  //       package_name: '',
  //       smallest_unit_conversion: 0
  //     }
  //   ]
  // };

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  // console.log(page, JSON.stringify(get_payload))
  get_payload.page = page
  get_payload.dataSize = dataSize
  const notify = (msg_type: string) => {
    if (msg_type === 'error') {
      toast.error(errorMsg, {
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
    if (msg_type === 'success') {
      toast.success(successMsg, {
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
    if (successMsg) {
      notify('success')
    }
  }, [successMsg])

  useEffect(() => {
    if (errorMsg) {
      notify('error')
    }
  }, [errorMsg])

  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    [`${business_id}_Purchaserequests`],
    () => GetPurchaseRequests(get_payload),
    { enabled: !!go }
  );

  useEffect(() => {
    'business_id' in get_payload && refetch();
  }, [dataSize])

  useEffect(() => {
    get_payload.page = page
    get_payload.paginate = true
    refetch();
  }, [page]);
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data[1] / dataSize));
    }
  }, [data]);


  const handlePageClick = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <>
      <Row>
        <div className="col">
          <Card className="shadow">
            {/* <CardHeader className="border-0">
              <Row className="align-items-center">
                <div className="col">
                  <h3 className="mb-0">Purchase Requests List</h3>
                </div>
              </Row>
            </CardHeader> */}
            {/* show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries */}
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th className="no-wrap">Product Image</th>
                  <th className="no-wrap">Product Name</th>
                  <th className="no-wrap">Purchase Quantity</th>
                  <th className="no-wrap">Customer</th>
                  <th className="no-wrap">Purchase date</th>
                  <th className="no-wrap">Purchase Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  isFetching || isLoading ? (
                    <td colSpan={8}>Loading available requests...</td>
                  )
                    : isError ? (
                      <td colSpan={8}>Error: {error.message}</td>
                    )
                      : isSuccess && get_payload.paginate && data[0].length > 0 ? (
                        data[0].map((purchaseRequest: IPurchaseRequest, index: number) => (
                          <tr key={index}>
                            <td>{(index + 1)}</td>
                            <td>
                              <img src={(purchaseRequest.product?.images && purchaseRequest.product?.images.length > 0 && purchaseRequest.product?.images[0].image_path) || ''} alt={purchaseRequest.product?.product_name} width={50} />
                            </td>
                            <td className="no-wrap">{purchaseRequest.product?.product_name}</td>
                            <td className="no-wrap">{purchaseRequest.quantity} {purchaseRequest.package?.package_name} ({purchaseRequest.order_request_frequency})</td>
                            <td>{purchaseRequest.client.profile?.first_name} {purchaseRequest.client.profile?.last_name}</td>
                            <td>{purchaseRequest.created_at}</td>
                            <td>{purchaseRequest.request_details}</td>
                            <td>
                              <div className=" btn-actions">
                                <a
                                  href={void (0)}
                                // onClick={()=>toggleEditModal(purchaseRequest)}
                                >
                                  <i className="fas fa-pencil text-primary mr-1 ml-1"></i>
                                </a>
                                <a href={void (0)}><i className="fas fa-trash text-danger mr-1 ml-1"></i></a>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : isSuccess && get_payload.paginate && data.length > 0 ? (
                        data.map((purchaseRequest: IPurchaseRequest, index: number) => (
                          <tr key={index}>
                            <td>{(index + 1)}</td>
                            <td>
                              <img src={(purchaseRequest.product?.images && purchaseRequest.product?.images.length > 0 && purchaseRequest.product?.images[0].image_path) || ''} alt={purchaseRequest.product?.product_name} width={50} />
                            </td>
                            <td className="no-wrap">{purchaseRequest.product?.product_name}</td>
                            <td className="no-wrap">{purchaseRequest.quantity} {purchaseRequest.package?.package_name} ({purchaseRequest.order_request_frequency})</td>
                            <td>{purchaseRequest?.client?.profile?.first_name} {purchaseRequest?.client?.profile?.last_name}</td>
                            <td>{purchaseRequest.created_at}</td>
                            <td>{purchaseRequest.request_details}</td>
                            <td>
                              <div className=" btn-actions">
                                <a
                                  href={void (0)}
                                // onClick={()=>toggleEditModal(purchaseRequest)}
                                >
                                  <i className="fas fa-pencil text-primary mr-1 ml-1"></i>
                                </a>
                                <a href={void (0)}><i className="fas fa-trash text-danger mr-1 ml-1"></i></a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                        : (
                          <td colSpan={8}>No purchase request found</td>
                        )
                }
              </tbody>
              <tfoot>
                <tr>
                  <th>ID</th>
                  <th className="no-wrap">Product Image</th>
                  <th className="no-wrap">Product Name</th>
                  <th>Purchase Quantity</th>
                  <th className="no-wrap">Customer</th>
                  <th className="no-wrap">Purchase date</th>
                  <th className="no-wrap">Purchase Details</th>
                  <th>Action</th>
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
        </div>
      </Row>
    </>
  );
}

export default PurchaseRequests;
