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
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import axios from '../../helpers/axios';
import { IImage, IPackage, IPreHarvest, IProduct, IShop } from '../../interfaces';
import Farmer from '../../layouts/Farmer';
import { AddPreHarvests, GetPreHarvests, UpdatePreHarvests } from '../api/pre-harvests';
const PreHarvest = () => {

  let initialValues: IPreHarvest = {
    product_id: 0,
    business_id: 0,
    harvest_quantity: 0,
    harvest_package: 0,
    harvest_frequency: 'seasonal',
    harvest_details: '',
    harvest_date: '',
    packages: [
      {
        package_name: '',
        smallest_unit_conversion: 0
      }
    ]
  };

  const [activeShop, setActiveShop] = useState<IShop>();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedPreHarvest, setViewedPreHarvest] = useState<IPreHarvest>();

  const [products, setProducts] = useState([]);
  const [isBusinessProductLoading, setIsBusinessProductLoading] = useState(false);

  const [updatingPreHarvest, setUpdatingPreHarvest] = useState(false);
  const [savingPreHarvest, setSavingPreHarvest] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();


  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
        let get_payload: any = {
          category_id: JSON.parse(active_shop).user_sector.sector_id
        }
        get_products(get_payload);
      }
    }
  }, [])

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

  const createMutation = useMutation(AddPreHarvests);
  const updateMutation = useMutation(UpdatePreHarvests);

  const addPreHarvest = async (payload: IPreHarvest) => {
    if (savingPreHarvest) {
      return
    }
    if (activeShop?.id) {
      payload.business_id = activeShop?.id;
    }
    else {
      setErrorMsg("Can't find business");
      setSavingPreHarvest(false);
      return;
    }
    setSavingPreHarvest(true);
    setErrorMsg("");
    const newPreHarvest = await createMutation.mutateAsync(payload);
    refetch();
    setSavingPreHarvest(false);

    // Handle result from API
    console.log(newPreHarvest);
    // setSavingPreHarvest(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editPreHarvest = async (payload: IPreHarvest) => {
    console.log(payload);
    if (updatingPreHarvest) {
      // return
    }
    if (activeShop?.id) {
      payload.business_id = activeShop?.id;
    }
    else {
      setErrorMsg("Can't find business");
      setSavingPreHarvest(false);
      return;
    }
    setUpdatingPreHarvest(true);
    setErrorMsg("");
    const updatePreHarvest = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingPreHarvest(false);

    // Handle result from API
    console.log(updatePreHarvest);
    // setSavingPreHarvest(false);
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
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch } = useQuery<any, Error>(
    ["PreHarvests"],
    () => GetPreHarvests(get_payload),
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
  const get_products = (payload: any) => {
    // Get products
    if (isBusinessProductLoading) {
      return
    }
    setErrorMsg("");
    setIsBusinessProductLoading(true);
    axios.get('/products', { params: payload })
      .then((res) => {
        setIsBusinessProductLoading(false);
        setErrorMsg("");
        console.log(res.data);
        
        setProducts(res.data);
      })
      .catch((error) => {
        setIsBusinessProductLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  const FormValidationSchema = Yup.object().shape({
    product_id: Yup.string().trim().required().label('Product'),
    harvest_quantity: Yup.string().trim().required().min(1).label('Pre Harvest quantity'),
    harvest_package: Yup.string().trim().required().label('Pre Harvest package'),
    harvest_date: Yup.string().trim().required().label('Pre Harvest Date'),
    harvest_frequency: Yup.string().trim().required().label('Pre Harvest Frequency'),
    // harvest_details: Yup.string().trim().required().label('Pre Harvest Details'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (pre_harvest: IPreHarvest | undefined = undefined) => {
    if (pre_harvest != undefined) {
      setViewedPreHarvest(pre_harvest);
    }
    setEditModal(!editModal);
  }

  const setProductSelected = (values: IPreHarvest, event: any) => {
    let product_id = event.currentTarget.value;
    let product_index = products.findIndex((x: IProduct) => x.id == product_id);
    let product: IProduct = products[product_index];
    setSelectedProduct(product);
    if (product.unit?.packages) {
      values.packages = product.unit.packages;
    }
    // console.log("Data", values);
    // console.log("Packages:", values.packages);
  }  

  return (
    <>
      <PageHeader page="Pre harvest" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Pre harvest List</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW PRE HARVEST
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Product Image</th>
                    <th className="no-wrap">Product Name</th>
                    <th className="no-wrap">Harvest Quantity</th>
                    <th className="no-wrap">Harvest date</th>
                    <th className="no-wrap">Harvest Frequency</th>
                    <th className="no-wrap">Harvest Details</th>
                    <th className="no-wrap">Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (
                      <td colSpan={6}>Loading available pre harvest...</td>
                    )
                      : isError ? (
                        <td colSpan={6}>Error: {error.message}</td>
                      )
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((preharvest: IPreHarvest, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1)}</td>
                              <td>
                                <img src={(preharvest.pre_harvest_images && preharvest.pre_harvest_images.length > 0 && (preharvest.pre_harvest_images[0] as IImage).image_path) || (preharvest.product?.images && preharvest.product?.images.length > 0 && preharvest.product?.images[0].image_path) || ''} alt={preharvest.product?.product_name} width={50} />
                              </td>
                              <td className="no-wrap">{preharvest.product?.product_name}</td>
                              <td className="no-wrap">{preharvest.harvest_quantity} {preharvest.package?.package_name}</td>
                              <td>{preharvest.harvest_date}</td>
                              <td>{preharvest.harvest_frequency}</td>
                              <td>{preharvest.harvest_details}</td>
                              <td>{preharvest.created_at}</td>
                              <td>
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(preharvest)}
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
                            <td colSpan={6}>No pre harvest found</td>
                          )
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Product Image</th>
                    <th className="no-wrap">Product Name</th>
                    <th>Harvest Quantity</th>
                    <th className="no-wrap">Harvest date</th>
                    <th className="no-wrap">Harvest Frequency</th>
                    <th className="no-wrap">Harvest Details</th>
                    <th className="no-wrap">Date</th>
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
        <ModalHeader toggle={toggleAddModal}>Add New Pre harvest</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addPreHarvest}
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
                    <FormGroup className="mb-3">
                      <Label>Select Product</Label>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <Input
                          type="select"
                          value={values.product_id}
                          name={`values.product_id`}
                          className="custom-select"
                          onChange={(event: any) => {
                            const updatedProduct = { ...values, product_id: event.currentTarget.value };
                            setProductSelected(updatedProduct, event);
                            setFieldValue(`product_id`, event.currentTarget.value);
                          }}
                        >
                          {
                            isBusinessProductLoading ? (
                              <option>Loading available products...</option>
                            )
                              : errorMsg != '' ? (
                                <option>Error: {errorMsg}</option>
                              )
                                : products.length > 0 ? (
                                  <>
                                    <option value="">Select existing product</option>
                                    {
                                      products.map((product: IProduct, index) => (
                                        <option key={index} value={product.id}>{product.product_name}</option>
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
                      touched.product_id && errors.product_id && (
                        <MsgText
                          text={errors.product_id}
                          textColor="danger"
                        />
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup className="mb-3">
                      <Label>Select Package</Label>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <Input
                          type="select"
                          value={values.harvest_package}
                          name={`values.harvest_package`}
                          className="custom-select"
                          onChange={handleChange('harvest_package')}
                          onBlur={handleBlur('harvest_package')}
                        >
                          {
                            isBusinessProductLoading ? (
                              <option>Loading available packages...</option>
                            )
                              : errorMsg != '' ? (
                                <option>Error: {errorMsg}</option>
                              )
                                : values.packages && values.packages.length > 0 ? (
                                  <>
                                    <option value="">Select package</option>
                                    {
                                      selectedProduct?.unit?.packages?.map((unit_package: IPackage, index: number) => (
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
                      touched.harvest_package && errors.harvest_package && (
                        <MsgText
                          text={errors.harvest_package}
                          textColor="danger"
                        />
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Harvest Qty</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="PreHarvest Qty"
                          type="number"
                          autoComplete="new-product-name"
                          value={values.harvest_quantity}
                          onChange={handleChange('harvest_quantity')}
                          onBlur={handleBlur('harvest_quantity')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.harvest_quantity && errors.harvest_quantity && (
                        <>
                          <MsgText
                            text={errors.harvest_quantity}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Harvest Frequency</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          type="select"
                          className="custom-select"
                          value={values.harvest_frequency}
                          onChange={handleChange('harvest_frequency')}
                          onBlur={handleBlur('harvest_frequency')}
                        >
                          <option value="seasonal">Seasonal</option>
                          <option value="monthly">Monthly</option>
                          <option value="bi-weekly'">Bi-weekly</option>
                          <option value="weekly">Weekly</option>
                          <option value="daily">Daily</option>
                          <option value="other">Other</option>
                        </Input>

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.harvest_frequency && errors.harvest_frequency && (
                        <>
                          <MsgText
                            text={errors.harvest_frequency}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Harvest Date</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="harvest Date"
                          type="date"
                          autoComplete="new-product-name"
                          value={values.harvest_date}
                          onChange={handleChange('harvest_date')}
                          onBlur={handleBlur('harvest_date')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.harvest_date && errors.harvest_date && (
                        <>
                          <MsgText
                            text={errors.harvest_date}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                  <Col xl="12">
                    <FormGroup>
                      <Label>Harvest Details</Label>
                      <InputGroup className="input-group-alternative">
                        <Input
                          placeholder="harvest Details"
                          type="textarea"
                          value={values.harvest_details}
                          onChange={handleChange('harvest_details')}
                          onBlur={handleBlur('harvest_details')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.harvest_details && errors.harvest_details && (
                        <>
                          <MsgText
                            text={errors.harvest_details}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                </Row>

                <Row>
                  <Col xl="6">
                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                      {
                        savingPreHarvest ?
                          ("Loading...") :
                          ("Save Pre Harvest")
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

      {/* Edit existing product */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit PreHarvest of {viewedPreHarvest?.product?.product_name}</ModalHeader>
        <ModalBody>
          {
            viewedPreHarvest ? (
              <Formik
                enableReinitialize
                initialValues={viewedPreHarvest}
                onSubmit={editPreHarvest}
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
                        <FormGroup className="mb-3">
                          <Label>Select Product</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.product_id}
                              name={`values.product_id`}
                              className="custom-select"
                              onChange={(event: any) => {
                                setFieldValue(`product_id`, event.currentTarget.value);
                                setProductSelected(values, event);
                              }}
                            >
                              {
                                isBusinessProductLoading ? (
                                  <option>Loading available products...</option>
                                )
                                  : errorMsg != '' ? (
                                    <option>Error: {errorMsg}</option>
                                  )
                                    : products.length > 0 ? (
                                      <>
                                        <option value="">Select existing product</option>
                                        {
                                          products.map((product: IProduct, index) => (
                                            <option key={index} value={product.id}>{product.product_name}</option>
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
                          touched.product_id && errors.product_id && (
                            <MsgText
                              text={errors.product_id}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <Label>Select Package</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.harvest_package}
                              name={`values.harvest_package`}
                              className="custom-select"
                              onChange={handleChange('harvest_package')}
                              onBlur={handleBlur('harvest_package')}
                            >
                              {
                                isBusinessProductLoading ? (
                                  <option>Loading available packages...</option>
                                )
                                  : errorMsg != '' ? (
                                    <option>Error: {errorMsg}</option>
                                  )
                                    : values.product?.unit?.packages ? (
                                      <>
                                        <option value="">Select package</option>
                                        {
                                          values.product?.unit?.packages.map((unit_package: IPackage, index: number) => (
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
                          touched.harvest_package && errors.harvest_package && (
                            <MsgText
                              text={errors.harvest_package}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Harvest Qty</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="PreHarvest Qty"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.harvest_quantity}
                              onChange={handleChange('harvest_quantity')}
                              onBlur={handleBlur('harvest_quantity')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.harvest_quantity && errors.harvest_quantity && (
                            <>
                              <MsgText
                                text={errors.harvest_quantity}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Harvest Frequency</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              type="select"
                              className="custom-select"
                              value={values.harvest_frequency}
                              onChange={handleChange('harvest_frequency')}
                              onBlur={handleBlur('harvest_frequency')}
                            >
                              <option value="seasonal">Seasonal</option>
                              <option value="monthly">Monthly</option>
                              <option value="bi-weekly'">Bi-weekly</option>
                              <option value="weekly">Weekly</option>
                              <option value="daily">Daily</option>
                              <option value="other">Other</option>
                            </Input>

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.harvest_frequency && errors.harvest_frequency && (
                            <>
                              <MsgText
                                text={errors.harvest_frequency}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Harvest Date</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="harvest Date"
                              type="date"
                              autoComplete="new-product-name"
                              value={values.harvest_date}
                              onChange={handleChange('harvest_date')}
                              onBlur={handleBlur('harvest_date')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.harvest_date && errors.harvest_date && (
                            <>
                              <MsgText
                                text={errors.harvest_date}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="12">
                        <FormGroup>
                          <Label>Harvest Details</Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="harvest Details"
                              type="textarea"
                              value={values.harvest_details}
                              onChange={handleChange('harvest_details')}
                              onBlur={handleBlur('harvest_details')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.harvest_details && errors.harvest_details && (
                            <>
                              <MsgText
                                text={errors.harvest_details}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                    </Row>

                    <Row>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-success text-white" type="submit">
                          {
                            updatingPreHarvest ?
                              ("Updating...") :
                              ("Update Pre Harvest")
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
    </>
  );
}

PreHarvest.layout = Farmer;

export default PreHarvest;
