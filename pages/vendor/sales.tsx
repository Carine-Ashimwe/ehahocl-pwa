// reactstrap components
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader, Col,
  Container, Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
// layout for this page
import PageHeader from '../../components/Headers/PageHeader';
// core components
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { FieldArray, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import axios from '../../helpers/axios';
import { IBusinessProduct, IDoneSale, IDoneSaleProduct, IPackage, ISale, ISaleProduct, IShop } from '../../interfaces';
import Vendor from '../../layouts/Vendor';
import { AddSales, GetSales, Intransit, Success, UpdateSales, UpdateStatus } from '../api/sales';
const Sales = () => {

  let initialValues: ISale = {
    business_id: 0,
    buyer_id: 0,
    order_paid_amount: 0,
    payment_status: '',
    order_status: '',
    payment_method: '',
    sale_channel: '',
    sale_platform: '',
    sale_date: '',
    order_products: [
      {
        business_product_id: 0,
        delivery_id: null,
        unit_package: 0,
        unit_price: 0,
        quantity: 0,
        product_discount: 0,
        delivery_amount: 0,
        packages: [
          {
            package_name: '',
            smallest_unit_conversion: 0
          }
        ]
      }
    ],
  };

  const [activeShop, setActiveShop] = useState<IShop>();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState(false);
  const [deliveryCode_check, setDeliveryCodeCheck] = useState(0);
  const [buyerCode, setBuyerCode] = useState(false);
  const [BuyerCodeCheck, setBuyerCodeCheck] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [viewSaleModal, setViewSaleModal] = useState(false);
  const [viewClientModal, setViewClientModal] = useState(false);
  const [viewSAddressModal, setViewSAddressModal] = useState(false);
  const [viewedSale, setViewedSale] = useState<IDoneSale>();
  const [individualProduct, setIndividualProduct] = useState<IDoneSaleProduct>();

  const [business_products, setBusinessProducts] = useState([]);
  const [isBusinessProductLoading, setIsBusinessProductLoading] = useState(false);

  const [updatingSale, setUpdatingSale] = useState(false);
  const [savingSale, setSavingSale] = useState(false);

  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
        let get_payload: any = {
          business_id: JSON.parse(active_shop).id
        }
        get_business_products(get_payload);
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

  const createMutation = useMutation(AddSales);
  const updateMutation = useMutation(UpdateSales);
  const statusMutation = useMutation(UpdateStatus);
  const IntransitMutation = useMutation(Intransit);
  const BuyerMutation = useMutation(Success);

  const addSale = async (payload: ISale) => {
    if (savingSale) {
      return
    }
    if (activeShop && activeShop.id != undefined) {
      payload.business_id = activeShop?.id;
    }
    payload.buyer_id = 1;
    payload.order_paid_amount = calc_sale_paid_amount(payload);
    payload.payment_status = 'success';
    payload.order_status = 'success';
    payload.sale_channel = 'Offline';
    payload.sale_platform = 'Web';
    setSavingSale(true);
    setErrorMsg("");
    const newSale = await createMutation.mutateAsync(payload);
    refetch();
    setSavingSale(false);

    // Handle result from API
    console.log(newSale);
    // setSavingSale(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editSale = async (payload: IDoneSale) => {
    if (updatingSale) {
      // return
    }
    payload.order_paid_amount = calc_done_sale_paid_amount(payload);
    setUpdatingSale(true);
    setErrorMsg("");
    const updateSale = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingSale(false);

    // Handle result from API
    console.log(updateSale);
    // setSavingSale(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editStatus = async (payload: IDoneSaleProduct, order_status: string) => {
    if (updatingSale) {
      // return
    }
    payload.order_status = order_status;
    setUpdatingSale(true);
    setErrorMsg("");
    const update_status = await statusMutation.mutateAsync(payload);
    refetch();
    setUpdatingSale(false);
    console.log(update_status)
    // Handle result from API  
    // setSavingSale(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }
  const check_deliveryCode = async () => {
    const id = individualProduct!.id
    const payload = {
      id: id,
      deliveryCode: deliveryCode_check
    }
    const isSame = await IntransitMutation.mutateAsync(payload)
    if (isSame) {
      editStatus(individualProduct!, 'intransit')
    } else {
      setErrorMsg("Delivery Code is incorrect")
    }
  }
  const check_buyerCode = async () => {
    const id = individualProduct!.id
    const payload = {
      id: id,
      buyerCode: BuyerCodeCheck
    }
    const isSame = await BuyerMutation.mutateAsync(payload)
    if (isSame) {
      editStatus(individualProduct!, 'success')
    } else {
      setErrorMsg("Buyer Code is incorrect")
    }
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
  const shouldEnableQuery =  'business_id' in get_payload;

  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["sales"],
    () => GetSales(get_payload),
    { enabled: shouldEnableQuery }
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
  const get_business_products = (payload: any) => {
    // Get products
    if (isBusinessProductLoading) {
      return
    }
    setErrorMsg("");
    setIsBusinessProductLoading(true);
    axios.get('/business_products', { params: payload })
      .then((res) => {
        setIsBusinessProductLoading(false);
        setErrorMsg("");
        setBusinessProducts(res.data);
      })
      .catch((error) => {
        setIsBusinessProductLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  const FormValidationSchema = Yup.object().shape({
    // business_product_id: Yup.string().trim().required().label('Product'),
    // unit_price: Yup.string().trim().required().label('Sale Price'),
    // unit_package: Yup.string().trim().required().label('Sale price'),
    // quantity: Yup.string().trim().required().label('Sale quantity'),
    payment_method: Yup.string().trim().required().label('Payment method'),
    sale_date: Yup.string().trim().required().label('Sale Date'),
    // images: Yup.array().min(1),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }
  const toggelDeliveryCode = () => {
    setDeliveryCode(!deliveryCode);
  }
  const toggleBuyerCode = () => {
    setBuyerCode(!buyerCode);
  }

  const toggleEditModal = (sale: IDoneSale | undefined = undefined) => {
    if (sale != undefined) {
      setViewedSale(sale);
    }
    setEditModal(!editModal);
  }

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

  const calc_sale_paid_amount = (payload: ISale) => {
    let tot = 0;
    payload.order_products.forEach((value: ISaleProduct, index) => {
      tot = Number(tot) + Number(Number(value.unit_price) * Number(value.quantity));
    });
    return tot;
  }

  const calc_done_sale_paid_amount = (payload: IDoneSale) => {
    let tot = 0;
    payload.products.forEach((value: IDoneSaleProduct, index) => {
      tot = Number(tot) + Number(Number(value.unit_price) * Number(value.quantity));
    });
    return tot;
  }

  const setProductSelected = (index: number, values: ISale, event: any) => {
    let product_id = event.currentTarget.value;
    let product_index = business_products.findIndex((x: IBusinessProduct) => x.id == product_id);
    let product: IBusinessProduct = business_products[product_index];
    if (product.product?.unit?.packages) {
      values.order_products[index].packages = product.product?.unit?.packages;
    }
  }

  const setProductSelectedToEdit = (index: number, values: IDoneSale, event: any) => {
    let product_id = event.currentTarget.value;
    let product_index = business_products.findIndex((x: IBusinessProduct) => x.id == product_id);
    let product: IBusinessProduct = business_products[product_index];
    values.products[index].packages = product.product?.unit?.packages;
  }

  return (
    <>
      <PageHeader page="Sales" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Sales List</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW SALE
                    </Button>
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
                    <th>Action</th>
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
                                    : ("-")
                                }
                              </td>
                              <td>{sale.sale_channel}</td>
                              <td>{sale.sale_date}</td>
                              <td>
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(sale)}
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

      {/* Add new product */}
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={toggleAddModal}>Add New Sale</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addSale}
            validationSchema={FormValidationSchema}
          >
            {({
              values,
              setFieldValue,
              handleChange,
              handleSubmit,
              touched,
              handleBlur,
              errors,
            }) => (
              <Form role="form" method="post" onSubmit={handleSubmit}>
                <Row>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Payment method</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Ex: MoMo"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.payment_method}
                          onChange={handleChange('payment_method')}
                          onBlur={handleBlur('payment_method')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.payment_method && errors.payment_method && (
                      <>
                        <MsgText
                          text={errors.payment_method}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Sale Date</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Sale Date"
                          type="date"
                          autoComplete="new-product-name"
                          value={values.sale_date}
                          onChange={handleChange('sale_date')}
                          onBlur={handleBlur('sale_date')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.sale_date && errors.sale_date && (
                      <>
                        <MsgText
                          text={errors.sale_date}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                </Row>
                <FieldArray
                  name="order_products"
                  render={arrayHelpers => (
                    <div className='m-b-3'>
                      {
                        values.order_products.map((product: ISaleProduct, index: number) => (
                          <>
                            <h5>
                              Product {(index + 1)}
                              <button
                                type="button"
                                className="btn btn-sm text-white bg-red"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </button>
                            </h5>
                            <Row>
                              <Col xl="3">
                                <FormGroup className="mb-3">
                                  <Label>Select Product</Label>
                                  <InputGroup className="input-group-alternative">

                                    <InputGroupText>
                                      <i className="fas fa-table" />
                                    </InputGroupText>

                                    <Input
                                      type="select"
                                      value={values.order_products[index].business_product_id}
                                      name={`order_products.${index}.business_product_id`}
                                      className="custom-select"
                                      onChange={(event: any) => {
                                        setFieldValue(`order_products.${index}.business_product_id`, event.currentTarget.value);
                                        setProductSelected(index, values, event);
                                      }}
                                    >
                                      {
                                        isBusinessProductLoading ? (
                                          <option>Loading available products...</option>
                                        )
                                          : errorMsg != '' ? (
                                            <option>Error: {errorMsg}</option>
                                          )
                                            : business_products.length > 0 ? (
                                              <>
                                                <option value="">Select existing product</option>
                                                {
                                                  business_products.map((product: IBusinessProduct, index) => (
                                                    <option key={index} value={product.id}>{product.product?.product_name}</option>
                                                  ))
                                                }
                                              </>
                                            )
                                              : (
                                                <option>No product found</option>
                                              )
                                      }
                                    </Input>

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.business_product_id && errors.business_product_id && (
                                  //   <MsgText
                                  //     text={errors.business_product_id}
                                  //     textColor="danger"
                                  //   />
                                  // )
                                }
                              </Col>
                              <Col xl="3">
                                <FormGroup className="mb-3">
                                  <Label>Select Default Package</Label>
                                  <InputGroup className="input-group-alternative">

                                    <InputGroupText>
                                      <i className="fas fa-table" />
                                    </InputGroupText>

                                    <Input
                                      type="select"
                                      value={values.order_products[index].unit_package}
                                      name={`order_products.${index}.unit_package`}
                                      className="custom-select"
                                      onChange={(event: any) => {
                                        setFieldValue(`order_products.${index}.unit_package`, event.currentTarget.value);
                                      }}
                                    >
                                      {
                                        isBusinessProductLoading ? (
                                          <option>Loading available packages...</option>
                                        )
                                          : errorMsg != '' ? (
                                            <option>Error: {errorMsg}</option>
                                          )
                                            : product.packages ? (
                                              <>
                                                <option value="">Select package</option>
                                                {
                                                  product.packages.map((unit_package: IPackage, index) => (
                                                    <option key={index} value={unit_package.id}>{unit_package.package_name}</option>
                                                  ))
                                                }
                                              </>
                                            )
                                              : (
                                                <option>No package found</option>
                                              )
                                      }
                                    </Input>

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.unit_package && errors.unit_package && (
                                  //   <MsgText
                                  //     text={errors.unit_package}
                                  //     textColor="danger"
                                  //   />
                                  // )
                                }
                              </Col>
                              <Col xl="3">
                                <FormGroup>
                                  <Label>Product Price</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`order_products.${index}.unit_price`}
                                      placeholder="Product Price"
                                      type="number"
                                      autoComplete="new-product-name"
                                      value={product.unit_price}
                                      onChange={(event: any) => {
                                        setFieldValue(`order_products.${index}.unit_price`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.unit_price && errors.unit_price && (
                                  //   <>
                                  //     <MsgText
                                  //       text={errors.unit_price}
                                  //       textColor="danger"
                                  //     />
                                  //     <br />
                                  //   </>
                                  // )
                                }
                              </Col>
                              <Col xl="3">
                                <FormGroup>
                                  <Label>Sale Qty</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`order_products.${index}.quantity`}
                                      placeholder="Sale Qty"
                                      type="number"
                                      autoComplete="new-product-name"
                                      value={product.quantity}
                                      onChange={(event: any) => {
                                        setFieldValue(`order_products.${index}.quantity`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.quantity && errors.quantity && (
                                  //   <>
                                  //     <MsgText
                                  //       text={errors.quantity}
                                  //       textColor="danger"
                                  //     />
                                  //     <br />
                                  //   </>
                                  // )
                                }
                              </Col>
                            </Row>
                          </>
                        ))
                      }
                      <button
                        type="button"
                        className="btn btn-sm text-white bg-success"
                        onClick={
                          () => arrayHelpers.push({
                            business_product_id: 0,
                            delivery_id: null,
                            unit_package: 0,
                            unit_price: 0,
                            quantity: 0,
                            product_discount: 0,
                            delivery_amount: 0,
                            packages: [
                              {
                                package_name: '',
                                smallest_unit_conversion: 0
                              }
                            ]
                          })
                        }
                      >
                        Add Product
                      </button>
                    </div>
                  )}
                />
                {touched.order_products && errors.order_products && (
                  <MsgText
                    text="Add Image. atleast upload featured image of product"
                    textColor="danger"
                  />
                )}

                <div className="text-center">
                </div>
                <Row>
                  <Col xl="6">
                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                      {
                        savingSale ?
                          ("Loading...") :
                          ("Save Transaction")
                      }
                    </Button>
                  </Col>
                  <Col xl="6">
                    <Button className="my-4 w-100 bg-red text-white" color="secondary" onClick={toggleAddModal}>Cancel</Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Edit product */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit Sale {viewedSale?.sale_date}</ModalHeader>
        <ModalBody>
          {
            viewedSale ? (
              <Formik
                enableReinitialize
                initialValues={viewedSale}
                onSubmit={editSale}
                validationSchema={FormValidationSchema}
              >
                {({
                  values,
                  setFieldValue,
                  handleChange,
                  handleSubmit,
                  touched,
                  handleBlur,
                  errors,
                }) => (
                  <Form role="form" method="post" onSubmit={handleSubmit}>
                    <Row>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Payment method</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Ex: MoMo"
                              type="text"
                              autoComplete="new-product-name"
                              value={values.payment_method}
                              onChange={handleChange('payment_method')}
                              onBlur={handleBlur('payment_method')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {touched.payment_method && errors.payment_method && (
                          <>
                            <MsgText
                              text={errors.payment_method}
                              textColor="danger"
                            />
                            <br />
                          </>
                        )}
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Sale Date</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Sale Date"
                              type="date"
                              autoComplete="new-product-name"
                              value={values.sale_date}
                              onChange={handleChange('sale_date')}
                              onBlur={handleBlur('sale_date')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {touched.sale_date && errors.sale_date && (
                          <>
                            <MsgText
                              text={errors.sale_date}
                              textColor="danger"
                            />
                            <br />
                          </>
                        )}
                      </Col>
                    </Row>
                    <FieldArray
                      name="products"
                      render={arrayHelpers => (
                        <div className='m-b-3'>
                          {
                            values.products.map((product: IDoneSaleProduct, index: number) => (
                              <>
                                <h5>
                                  Product {(index + 1)}
                                  <button
                                    type="button"
                                    className="btn btn-sm text-white bg-red"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </button>
                                </h5>
                                <Row>
                                  <Col xl="3">
                                    <FormGroup className="mb-3">
                                      <Label>Select Product</Label>
                                      <InputGroup className="input-group-alternative">

                                        <InputGroupText>
                                          <i className="fas fa-table" />
                                        </InputGroupText>

                                        <Input
                                          type="select"
                                          value={values.products[index].business_product_id}
                                          name={`products.${index}.business_product_id`}
                                          className="custom-select"
                                          onChange={(event: any) => {
                                            setFieldValue(`products.${index}.business_product_id`, event.currentTarget.value);
                                            setProductSelectedToEdit(index, values, event);
                                          }}
                                        >
                                          {
                                            isBusinessProductLoading ? (
                                              <option>Loading available products...</option>
                                            )
                                              : errorMsg != '' ? (
                                                <option>Error: {errorMsg}</option>
                                              )
                                                : business_products.length > 0 ? (
                                                  <>
                                                    <option value="">Select existing product</option>
                                                    {
                                                      business_products.map((product: IBusinessProduct, index) => (
                                                        <option key={index} value={product.id}>{product.product?.product_name}</option>
                                                      ))
                                                    }
                                                  </>
                                                )
                                                  : (
                                                    <option>No product found</option>
                                                  )
                                          }
                                        </Input>

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.business_product_id && errors.business_product_id && (
                                      //   <MsgText
                                      //     text={errors.business_product_id}
                                      //     textColor="danger"
                                      //   />
                                      // )
                                    }
                                  </Col>
                                  <Col xl="3">
                                    <FormGroup className="mb-3">
                                      <Label>Select Default Package</Label>
                                      <InputGroup className="input-group-alternative">

                                        <InputGroupText>
                                          <i className="fas fa-table" />
                                        </InputGroupText>

                                        <Input
                                          type="select"
                                          value={values.products[index].unit_package}
                                          name={`products.${index}.unit_package`}
                                          className="custom-select"
                                          onChange={(event: any) => {
                                            setFieldValue(`products.${index}.unit_package`, event.currentTarget.value);
                                          }}
                                        >
                                          {
                                            isBusinessProductLoading ? (
                                              <option>Loading available packages...</option>
                                            )
                                              : errorMsg != '' ? (
                                                <option>Error: {errorMsg}</option>
                                              )
                                                : product.packages ? (
                                                  <>
                                                    <option value="">Select package</option>
                                                    {
                                                      product.packages.map((unit_package: IPackage, index) => (
                                                        <option key={index} value={unit_package.id}>{unit_package.package_name}</option>
                                                      ))
                                                    }
                                                  </>
                                                )
                                                  : (
                                                    <option>No package found</option>
                                                  )
                                          }
                                        </Input>

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.unit_package && errors.unit_package && (
                                      //   <MsgText
                                      //     text={errors.unit_package}
                                      //     textColor="danger"
                                      //   />
                                      // )
                                    }
                                  </Col>
                                  <Col xl="3">
                                    <FormGroup>
                                      <Label>Product Price</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`products.${index}.unit_price`}
                                          placeholder="Product Price"
                                          type="number"
                                          autoComplete="new-product-name"
                                          value={product.unit_price}
                                          onChange={(event: any) => {
                                            setFieldValue(`products.${index}.unit_price`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.unit_price && errors.unit_price && (
                                      //   <>
                                      //     <MsgText
                                      //       text={errors.unit_price}
                                      //       textColor="danger"
                                      //     />
                                      //     <br />
                                      //   </>
                                      // )
                                    }
                                  </Col>
                                  <Col xl="3">
                                    <FormGroup>
                                      <Label>Sale Qty</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`products.${index}.quantity`}
                                          placeholder="Sale Qty"
                                          type="number"
                                          autoComplete="new-product-name"
                                          value={product.quantity}
                                          onChange={(event: any) => {
                                            setFieldValue(`products.${index}.quantity`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.quantity && errors.quantity && (
                                      //   <>
                                      //     <MsgText
                                      //       text={errors.quantity}
                                      //       textColor="danger"
                                      //     />
                                      //     <br />
                                      //   </>
                                      // )
                                    }
                                  </Col>
                                </Row>
                              </>
                            ))
                          }
                          <button
                            type="button"
                            className="btn btn-sm text-white bg-success"
                            onClick={
                              () => arrayHelpers.push({
                                business_product_id: 0,
                                delivery_id: null,
                                unit_package: 0,
                                unit_price: 0,
                                quantity: 0,
                                product_discount: 0,
                                delivery_amount: 0,
                                packages: [
                                  {
                                    package_name: '',
                                    smallest_unit_conversion: 0
                                  }
                                ]
                              })
                            }
                          >
                            Add Product
                          </button>
                        </div>
                      )}
                    />
                    {/* {touched.products && errors.products && (
                      <MsgText
                        text="Add Image. atleast upload featured image of product"
                        textColor="danger"
                      />
                    )} */}

                    <div className="text-center">
                    </div>
                    <Row>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-success text-white" type="submit">
                          {
                            updatingSale ?
                              ("Loading...") :
                              ("Update Transaction")
                          }
                        </Button>
                      </Col>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-red text-white" color="secondary" onClick={() => toggleEditModal()}>Cancel</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            )
              : (null)
          }
        </ModalBody>
      </Modal>

      {/* Display products */}
      <Modal
        isOpen={viewSaleModal}
        toggle={() => toggleViewSaleModal()}
        centered={true}
        size="xl"
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
                <th>Actions</th>
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
                      <td>{sale_products.unit_price} RWF</td>
                      <td>{sale_products.quantity} {sale_products.package.package_name}</td>
                      <td>{sale_products.quantity * sale_products.unit_price} RWF</td>
                      <td>{sale_products.order_status}</td>
                      <td>
                        {sale_products.order_status == "success" && "No status change"}
                        {sale_products.order_status == "declined" && <button onClick={() => editStatus(sale_products, 'approved')} className='btn btn-sm btn-success'>Approve</button>}
                        {sale_products.order_status == "pending" && <button onClick={() => editStatus(sale_products, 'approved')} className=' btn btn-sm btn-success'>Approve</button>}
                        {sale_products.order_status == "pending" && <button onClick={() => editStatus(sale_products, 'declined')} className='btn btn-sm btn-success'>Decline</button>}
                        {sale_products.order_status == "approved" && <button onClick={() => editStatus(sale_products, 'declined')} className='btn btn-sm btn-success'>Decline</button>}
                        {sale_products.order_status == "approved" && <button onClick={() => { toggelDeliveryCode(); setIndividualProduct(sale_products) }} className='btn btn-sm btn-success'>Intransit</button>}
                        {sale_products.order_status == "approved" && <button onClick={() => { toggleBuyerCode(); setIndividualProduct(sale_products) }} className='btn btn-sm btn-success'>Success</button>}
                        {sale_products.order_status == "intransit" && <button onClick={() => { toggleBuyerCode(); setIndividualProduct(sale_products) }} className='btn btn-sm btn-success'>Success</button>}
                      </td>
                    </tr>
                  ))
                )
                  : (null)
              }
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={deliveryCode}
        toggle={() => toggelDeliveryCode()}
        centered={true}
        size="md"
      >
        <ModalHeader toggle={() => toggelDeliveryCode()}> Enter Delivery Code</ModalHeader>
        <ModalBody>
          <div className="input-group success mb-3">
            <span className="input-group-text text-dark" id="basic-addon1">Enter delivery code</span>
            <input type="number" className="form-control text-dark" onChange={(e) => setDeliveryCodeCheck(Number(e.target.value))} placeholder="Delivery code" aria-label="Delivery Code" aria-describedby="basic-addon1" />
            <button onClick={() => check_deliveryCode()} className='btn btn-success'>Submit</button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={buyerCode}
        toggle={() => toggleBuyerCode()}
        centered={true}
        size="md"
      >
        <ModalHeader toggle={() => toggleBuyerCode()}> Enter Buyer Code</ModalHeader>
        <ModalBody>
          <div className="input-group success mb-3">
            <span className="input-group-text text-dark" id="basic-addon1">Enter Buyer code</span>
            <input type="number" className="form-control text-dark" onChange={(e) => setBuyerCodeCheck(Number(e.target.value))} placeholder="Buyer code" aria-label="Buyer Code" aria-describedby="basic-addon1" />
            <button onClick={() => check_buyerCode()} className='btn btn-success'>Submit</button>
          </div>
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
}

Sales.layout = Vendor;

export default Sales;
