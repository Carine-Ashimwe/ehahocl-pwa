// reactstrap components
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Col,
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
import { IBusinessProduct, IDonePurchase, IDonePurchaseProduct, IPackage, IPurchase, IPurchaseProduct, IShop } from '../../interfaces';
import Vendor from '../../layouts/Vendor';
import { AddPurchases, GetPurchases, UpdatePurchases } from '../api/purchases';
const Purchases = () => {

  let initialValues: IPurchase = {
    business_id: 0,
    supplier_id: 0,
    purchase_paid_amount: 0,
    payment_status: '',
    purchase_status: '',
    payment_method: '',
    purchase_channel: '',
    purchase_platform: '',
    purchase_date: '',
    purchase_products: [
      {
        business_product_id: 0,
        unit_package: 0,
        unit_price: 0,
        quantity: 0,
        product_discount: 0,
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
  const [editModal, setEditModal] = useState(false);
  const [viewPurchaseModal, setViewPurchaseModal] = useState(false);
  const [viewClientModal, setViewClientModal] = useState(false);
  const [viewedPurchase, setViewedPurchase] = useState<IDonePurchase>();

  const [business_products, setBusinessProducts] = useState([]);
  const [isBusinessProductLoading, setIsBusinessProductLoading] = useState(false);

  const [updatingPurchase, setUpdatingPurchase] = useState(false);
  const [savingPurchase, setSavingPurchase] = useState(false);

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
          business_id: JSON.parse(active_shop).id,
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

  const createMutation = useMutation(AddPurchases);
  const updateMutation = useMutation(UpdatePurchases);

  const addPurchase = async (payload: IPurchase) => {
    if (savingPurchase) {
      return
    }
    setSavingPurchase(true);
    setErrorMsg("");
    if (activeShop && activeShop.id != undefined) {
      payload.business_id = activeShop?.id;
    }
    payload.supplier_id = 1;
    payload.purchase_paid_amount = calc_purchase_paid_amount(payload);
    payload.payment_status = 'success';
    payload.purchase_channel = 'Offline';
    payload.purchase_platform = 'Web';
    const newPurchase = await createMutation.mutateAsync(payload);
    refetch();
    setSavingPurchase(false);

    // Handle result from API
    console.log(newPurchase);
    // setSavingPurchase(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editPurchase = async (payload: IDonePurchase) => {
    if (updatingPurchase) {
      return
    }
    payload.purchase_paid_amount = calc_done_purchase_paid_amount(payload);
    setUpdatingPurchase(true);
    setErrorMsg("");
    const updatePurchase = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingPurchase(false);

    // Handle result from API
    console.log(updatePurchase);
    // setSavingPurchase(false);
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
    ["purchase"],
    () => GetPurchases(get_payload),
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
        console.log(res.data)
        setBusinessProducts(res.data);
      })
      .catch((error) => {
        setIsBusinessProductLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  // Get the data for the current page

  const FormValidationSchema = Yup.object().shape({
    // business_product_id: Yup.string().trim().required().label('Product'),
    // unit_price: Yup.string().trim().required().label('Purchase Price'),
    // unit_package: Yup.string().trim().required().label('Purchase price'),
    // quantity: Yup.string().trim().required().label('Purchase quantity'),
    payment_method: Yup.string().trim().required().label('Payment method'),
    purchase_date: Yup.string().trim().required().label('Purchase Date'),
    // images: Yup.array().min(1),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (purchase: IDonePurchase | undefined = undefined) => {
    if (purchase != undefined) {
      setViewedPurchase(purchase);
    }
    setEditModal(!editModal);
  }

  const toggleViewPurchaseModal = (purchase: IDonePurchase | undefined = undefined) => {
    if (purchase != undefined) {
      setViewedPurchase(purchase);
    }
    setViewPurchaseModal(!viewPurchaseModal);
  }

  const toggleViewClientModal = (purchase: IDonePurchase | undefined = undefined) => {
    if (purchase != undefined) {
      setViewedPurchase(purchase);
    }
    setViewClientModal(!viewClientModal);
  }

  const calc_purchase_paid_amount = (payload: IPurchase) => {
    let tot = 0;
    payload.purchase_products.forEach((value: IPurchaseProduct, index) => {
      tot = Number(tot) + Number(Number(value.unit_price) * Number(value.quantity));
    });
    return tot;
  }
  const calc_done_purchase_paid_amount = (payload: IDonePurchase) => {
    let tot = 0;
    payload.products.forEach((value: IDonePurchaseProduct, index: number) => {
      tot = Number(tot) + Number(Number(value.unit_price) * Number(value.quantity));
    });
    return tot;
  }

  const setProductSelected = (index: number, values: IPurchase, event: any) => {
    let product_id = event.currentTarget.value;
    let product_index = business_products.findIndex((x: IBusinessProduct) => x.id == product_id);
    let product: IBusinessProduct = business_products[product_index];
    if (product.product?.unit?.packages) {
      values.purchase_products[index].packages = product.product?.unit?.packages;
    }
  }

  const setProductSelectedToEdit = (index: number, values: IDonePurchase, event: any) => {
    let product_id = event.currentTarget.value;
    let product_index = business_products.findIndex((x: IBusinessProduct) => x.id == product_id);
    let product: IBusinessProduct = business_products[product_index];
    values.products[index].packages = product.product?.unit?.packages;
  }


  return (
    <>
      <PageHeader page="Purchases" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Purchases List</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW PURCHASE
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
                    <th className="no-wrap">Purchase invoice</th>
                    <th className="no-wrap">Supplier</th>
                    <th className="no-wrap">Purchase channel</th>
                    <th className="no-wrap">Purchase date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (
                      <td colSpan={10}>Loading available purchases...</td>
                    )
                      : isError ? (
                        <td colSpan={10}>Error: {error.message}</td>
                      )
                        : isSuccess && data[0]?.length > 0 ? (
                          data[0]?.map((purchase: IDonePurchase, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1)}</td>
                              <td>
                                <Button
                                  className='bg-success text-white'
                                  size="sm"
                                  onClick={() => toggleViewPurchaseModal(purchase)}
                                >
                                  {purchase.products.length} products
                                </Button>

                              </td>
                              <td className="no-wrap">{purchase.purchase_paid_amount} RWF</td>
                              <td className="no-wrap">{purchase.payment_method}</td>
                              <td className="no-wrap">{purchase.payment_status}</td>
                              <td className="no-wrap">{purchase.receipt_number}</td>
                              <td className="no-wrap">
                                {
                                  <Button
                                    className="bg-success text-white"
                                    size="sm"
                                    onClick={() => toggleViewClientModal(purchase)}
                                  >View Supplier
                                  </Button>
                                }
                              </td>
                              <td>{purchase.purchase_channel}</td>
                              <td>{purchase.purchase_date}</td>
                              <td>
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(purchase)}
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
                            <td colSpan={10}>No purchase found</td>
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
                    <th className="no-wrap">Purchase invoice</th>
                    <th className="no-wrap">Supplier</th>
                    <th className="no-wrap">Purchase channel</th>
                    <th className="no-wrap">Purchase date</th>
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
        <ModalHeader toggle={toggleAddModal}>Add New Purchase</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addPurchase}
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
                      <Label>Purchase Date</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Purchase Date"
                          type="date"
                          autoComplete="new-product-name"
                          value={values.purchase_date}
                          onChange={handleChange('purchase_date')}
                          onBlur={handleBlur('purchase_date')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.purchase_date && errors.purchase_date && (
                      <>
                        <MsgText
                          text={errors.purchase_date}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                </Row>
                <FieldArray
                  name="purchase_products"
                  render={arrayHelpers => (
                    <div className='m-b-3'>
                      {
                        values.purchase_products.map((product: IPurchaseProduct, index: number) => (
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
                                      value={values.purchase_products[index].business_product_id}
                                      name={`purchase_products.${index}.business_product_id`}
                                      className="custom-select"
                                      onChange={(event: any) => {
                                        setFieldValue(`purchase_products.${index}.business_product_id`, event.currentTarget.value);
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
                                      name={`purchase_products.${index}.unit_package`}
                                      className="custom-select"
                                      onChange={(event: any) => {
                                        setFieldValue(`purchase_products.${index}.unit_package`, event.currentTarget.value);
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
                                      name={`purchase_products.${index}.unit_price`}
                                      placeholder="Product Price"
                                      type="number"
                                      autoComplete="new-product-name"
                                      value={product.unit_price}
                                      onChange={(event: any) => {
                                        setFieldValue(`purchase_products.${index}.unit_price`, event.currentTarget.value);
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
                                  <Label>Purchase Qty</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`purchase_products.${index}.quantity`}
                                      placeholder="Purchase Qty"
                                      type="number"
                                      autoComplete="new-product-name"
                                      value={product.quantity}
                                      onChange={(event: any) => {
                                        setFieldValue(`purchase_products.${index}.quantity`, event.currentTarget.value);
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
                            unit_package: 0,
                            unit_price: 0,
                            quantity: 0,
                            product_discount: 0,
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
                {touched.purchase_products && errors.purchase_products && (
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
                        savingPurchase ?
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
        <ModalHeader toggle={() => toggleEditModal()}>Edit Purchase {viewedPurchase?.purchase_date}</ModalHeader>
        <ModalBody>
          {
            viewedPurchase ? (
              <Formik
                enableReinitialize
                initialValues={viewedPurchase}
                onSubmit={editPurchase}
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
                              value={values.purchase_date}
                              onChange={handleChange('purchase_date')}
                              onBlur={handleBlur('purchase_date')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.purchase_date && errors.purchase_date && (
                            <>
                              <MsgText
                                text={errors.purchase_date}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                    </Row>
                    <FieldArray
                      name="products"
                      render={arrayHelpers => (
                        <div className='m-b-3'>
                          {
                            values.products.map((product: IDonePurchaseProduct, index: number) => (
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
                                                      product.packages.map((unit_package: IPackage, index: number) => (
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
                            updatingPurchase ?
                              ("Updating...") :
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
        isOpen={viewPurchaseModal}
        toggle={() => toggleViewPurchaseModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleViewPurchaseModal()}> Purchase&#39;s products on {viewedPurchase?.purchase_date} </ModalHeader>
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
              </tr>
            </thead>
            <tbody>
              {
                viewedPurchase?.products ? (
                  viewedPurchase?.products.map((purchase_product: IDonePurchaseProduct, index: number) => (
                    <tr key={index}>
                      <td>{(index + 1)}</td>
                      <td>
                        <img src={(purchase_product.business_product.business_images && purchase_product.business_product.business_images.length > 0 && purchase_product.business_product.business_images[0].image_path) || (purchase_product.business_product.product?.images && purchase_product.business_product.product?.images.length > 0 && purchase_product.business_product.product?.images[0].image_path) || ''} alt={purchase_product.business_product.product?.product_name} width={50} />
                      </td>
                      <td>{purchase_product.business_product.product?.product_name}</td>
                      <td>{purchase_product.unit_price} RWF</td>
                      <td>{purchase_product.quantity} {purchase_product.package.package_name}</td>
                      <td>{purchase_product.quantity * purchase_product.unit_price} RWF</td>
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
        <ModalHeader toggle={() => toggleViewClientModal()}> Purchase&#39;s supplier on {viewedPurchase?.purchase_date} </ModalHeader>
        <ModalBody>
          <table>
            <tbody>
              <tr>
                <th>Names</th>
                <td>: {viewedPurchase?.supplier?.profile.first_name} {viewedPurchase?.supplier?.profile.last_name}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>: {viewedPurchase?.supplier?.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>: {viewedPurchase?.supplier?.email}</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </>
  );
}

Purchases.layout = Vendor;

export default Purchases;
