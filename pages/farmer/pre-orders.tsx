// reactstrap components
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader, Container,
  Row,
  Table
} from "reactstrap";
// layout for this page
import PageHeader from '../../components/Headers/PageHeader';
// core components
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import { IImage, IPreOrder, IShop } from '../../interfaces';
import Farmer from '../../layouts/Farmer';
import { AddPreOrders, GetPreOrders, UpdatePreOrders } from '../api/pre-orders';
const PreOrder = () => {
  const [activeShop, setActiveShop] = useState<IShop>();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [viewedPreOrder, setViewedPreOrder] = useState<IPreOrder>();

  const [updatingPreOrder, setUpdatingPreOrder] = useState(false);
  const [savingPreOrder, setSavingPreOrder] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
      }
    }
  }, []);

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

  const createMutation = useMutation(AddPreOrders);
  const updateMutation = useMutation(UpdatePreOrders);

  const addPreOrder = async (payload: IPreOrder) => {
    if (savingPreOrder) {
      return
    }
    setSavingPreOrder(true);
    setErrorMsg("");
    const newPreOrder = await createMutation.mutateAsync(payload);
    setSavingPreOrder(false);

    // Handle result from API
    console.log(newPreOrder);
    // setSavingPreOrder(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editPreOrder = async (payload: IPreOrder) => {
    console.log(payload);
    if (updatingPreOrder) {
      // return
    }
    setUpdatingPreOrder(true);
    setErrorMsg("");
    const updatePreOrder = await updateMutation.mutateAsync(payload);
    setUpdatingPreOrder(false);

    // Handle result from API
    console.log(updatePreOrder);
    // setSavingPreOrder(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  let get_payload = {};
  if (activeShop && activeShop.id != undefined) {
    get_payload = {
      business_id: activeShop.id,
      paginate: true,
      page: page,
      dataSize: dataSize

    };
  }
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["PreOrders"],
    () => GetPreOrders(get_payload),
    { enabled: !!activeShop }
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

  const toggleEditModal = (pre_order: IPreOrder | undefined = undefined) => {
    if (pre_order != undefined) {
      setViewedPreOrder(pre_order);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <PageHeader page="Pre order" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Pre orders List</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Product Image</th>
                    <th className="no-wrap">Product Name</th>
                    <th>Pre order Quantity</th>
                    <th className="no-wrap">Customer</th>
                    <th className="no-wrap">Order date</th>
                    <th className="no-wrap">Order Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (
                      <option>Loading available pre-orders...</option>
                    )
                      : isError ? (
                        <option>Error: {error.message}</option>
                      )
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((preOrder: any, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1)}</td>
                              <td>
                                {/* Displaying image of product */}
                                <img src={(preOrder.preharvest.pre_harvest_images && preOrder.preharvest.pre_harvest_images.length > 0 && (preOrder.preharvest.pre_harvest_images[0] as IImage).image_path) || (preOrder.preharvest.product?.images && preOrder.preharvest.product?.images.length > 0 && preOrder.preharvest.product?.images[0].image_path) || ''} alt={preOrder.preharvest.product?.product_name} width={50} />
                              </td>
                              <td className="no-wrap">{preOrder.preharvest?.product?.product_name}</td>
                              <td className="no-wrap">{preOrder.pre_order_quantity} {preOrder.package?.package_name}</td>
                              <td>{preOrder.buyer?.profile?.first_name} {preOrder.buyer?.profile?.last_name}</td>
                              <td>{preOrder.created_at}</td>
                              <td>{preOrder.comment}</td>
                              <td>
                                <div className=" btn-actions">
                                  <a href={void (0)}><i className="fas fa-trash text-danger mr-1 ml-1"></i></a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (
                            <td colSpan={8}>No pre orders found</td>
                          )
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Product Image</th>
                    <th className="no-wrap">Product Name</th>
                    <th>Pre order Quantity</th>
                    <th className="no-wrap">Customer</th>
                    <th className="no-wrap">Order date</th>
                    <th className="no-wrap">Order Details</th>
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
      </Container>
    </>
  );
}

PreOrder.layout = Farmer;

export default PreOrder;
