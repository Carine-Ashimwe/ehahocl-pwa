// reactstrap components
import { useEffect, useState } from 'react';
import {
  Button,
  Card, CardHeader, Col,
  Container, Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader, Row,
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
import { IBusinessDeliveryRoute, IDeliveryRoute, IDeliveryRoutePackage, ILocation, IShop } from '../../interfaces';
import Delivery from '../../layouts/Delivery';
import { AddBusinessDeliveryRoutes, AddRoutePackages, DeleteBusinessDelivery, DeletRoutePackage, GetBusinessDeliveryRoutes, UpdateBusinessDeliveryRoutes, UpdateDeliveryPackages } from '../../pages/api/delivery_routes';
const DeliveryRoutes = () => {

  let initialValues: IBusinessDeliveryRoute = {
    from: 0,
    route_id: 0,
    estimated_days: 0,
    estimated_hours: 0,
    estimated_minutes: 0,
    packages: [
      {
        minimum_quantity: 0,
        maximum_quantity: 0,
        delivery_fees: 0
      }
    ]
  };

  // let packagesInitialValues:IDeliveryRoutePackage = {
  // };

  const [activeShop, setActiveShop] = useState<IShop>();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addPackagesModal, setAddPackagesModal] = useState(false);
  const [packagesModal, setViewPackagesModal] = useState(false);
  const [viewedBusinessDeliveryRoute, setViewedBusinessDeliveryRoute] = useState<IBusinessDeliveryRoute>();

  const [delivery_routes, setDeliveryRoutes] = useState([]);
  const [isDeliveryRoutesLoading, setIsDeliveryRoutesLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);

  const [updatingBusinessDeliveryRoute, setUpdatingBusinessDeliveryRoute] = useState(false);
  const [savingBusinessDeliveryRoute, setSavingBusinessDeliveryRoute] = useState(false);
  const [savingRoutePackages, setSavingRoutePackages] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

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

  useEffect(() => {
    get_districts();
    const active_shop = localStorage.getItem('active_shop');
    if (active_shop) {
      setActiveShop(JSON.parse(active_shop));
    }
  }, [])

  let get_payload = {
    business_id: activeShop && activeShop.id != undefined ? (activeShop?.id) : (undefined),
    page: page,
    paginate: true,
    dataSize: dataSize
  };
  const { isLoading, isError, error, isSuccess, data, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["BusinessDeliveryRoutes"],
    () => GetBusinessDeliveryRoutes(get_payload)
  );
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data[1] / dataSize));
    }
  }, [data]);

  useEffect(() => {
    'business_id' in get_payload && refetch();
  }, [dataSize])


  const handlePageClick = async (newPage: number) => {
    await new Promise<void>((resolve) => {
      setPage(newPage)
      resolve();
    });

    refetch();
  }

  const get_delivery_routes = (from: number) => {
    // Get products
    if (isDeliveryRoutesLoading) {
      return
    }
    setErrorMsg("");
    setIsDeliveryRoutesLoading(true);
    axios.get('/delivery_routes', { params: { from: from } })
      .then((res) => {
        setIsDeliveryRoutesLoading(false);
        setErrorMsg("");
        setDeliveryRoutes(res.data);
      })
      .catch((error) => {
        setIsDeliveryRoutesLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  const get_districts = () => {
    // Get products
    setIsDistrictsLoading(true);
    axios.post('/locations', { model: "District", parent_id: null })
      .then((res) => {
        setIsDistrictsLoading(false);
        setErrorMsg("");
        setDistricts(res.data.message);
      })
      .catch((error) => {
        setIsDistrictsLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  const createMutation = useMutation(AddBusinessDeliveryRoutes);
  const addPackagesMutation = useMutation(AddRoutePackages);
  const deleteRoutePackageMutation = useMutation(DeletRoutePackage);
  const deleteRouteMutation = useMutation(DeleteBusinessDelivery);
  const updateMutation = useMutation(UpdateBusinessDeliveryRoutes);
  const updateRoutePackageMutation = useMutation(UpdateDeliveryPackages);

  const addBusinessDeliveryRoute = async (payload: IBusinessDeliveryRoute) => {
    if (savingBusinessDeliveryRoute) {
      return
    }
    if (activeShop && activeShop.id != undefined) {
      payload.business_id = activeShop.id;
    }
    setSavingBusinessDeliveryRoute(true);
    setErrorMsg("");
    const newBusinessDeliveryRoute = await createMutation.mutateAsync(payload);
    if (newBusinessDeliveryRoute) {
      payload.packages?.forEach(route_package => {
        if (route_package.minimum_quantity > route_package.maximum_quantity) {
          setErrorMsg("Minimum quantity cannot be greater than maximum quantity")
          setSavingBusinessDeliveryRoute(false)
        }
        route_package.business_route_id = newBusinessDeliveryRoute?.message?.id;
      });
      const newRoutePackages = await addPackagesMutation.mutateAsync(payload);
      setSavingBusinessDeliveryRoute(false);
      refetch()
    }

    // Handle result from API
    // setSavingBusinessDeliveryRoute(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }
  const deleteBusinessDeliveryRoute = async (payload: IBusinessDeliveryRoute) => {
    setErrorMsg("");
    if (payload.packages && payload.packages.length > 0) {

      // Use for...of loop to handle async operations sequentially
      for (const route_package of payload.packages) {
        const packageId = route_package.id ?? 0; // Provide a default value of 0 if route_package.id is undefined
        await deleteRoutePackageMutation.mutateAsync(packageId);
      }
      await deleteRouteMutation.mutateAsync(payload.id ?? 0)
      refetch()

    } else {
      await deleteRouteMutation.mutateAsync(payload.id ?? 0)
      refetch()
    }
  };
  const addRoutePackages = async (payload: IBusinessDeliveryRoute) => {
    if (savingBusinessDeliveryRoute) {
      return
    }
    payload.packages?.forEach(route_package => {
      if (route_package.minimum_quantity > route_package.maximum_quantity) {
        setErrorMsg("Minimum quantity cannot be greater than maximum quantity")
      }
      route_package.business_route_id = viewedBusinessDeliveryRoute?.id;
    });
    setSavingRoutePackages(true);
    setErrorMsg("");
    const newRoutePackages = await addPackagesMutation.mutateAsync(payload);
    setSavingRoutePackages(false);
    refetch()
    // Handle result from API
    // setSavingRoutePackages(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editBusinessDeliveryRoute = async (payload: IBusinessDeliveryRoute) => {
    if (updatingBusinessDeliveryRoute) {
      // return
    }
    console.log(payload)
    setUpdatingBusinessDeliveryRoute(true);
    setErrorMsg("");
    const updateBusinessDeliveryRoute = await updateMutation.mutateAsync(payload);
    if (payload.packages) {
      for (const packageItem of payload.packages) {
        if (packageItem.id != undefined) {
          await updateRoutePackageMutation.mutateAsync(packageItem);
          payload.packages.filter(item => item.id !== packageItem.id);
        } else {
          packageItem.business_route_id = payload.id
        }
      }
      await addPackagesMutation.mutateAsync(payload);
    }
    setUpdatingBusinessDeliveryRoute(false);
    refetch()

    // Handle result from API
    console.log('result  ', updateBusinessDeliveryRoute);
    // setSavingBusinessDeliveryRoute(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const changeStatus = async (payload: IBusinessDeliveryRoute) => {
    if (payload.active == 'Yes') {
      payload.active = 'No'
    } else {
      payload.active = 'Yes'
    }
    await updateMutation.mutateAsync(payload)
  }

  const FormValidationSchema = Yup.object().shape({
    route_id: Yup.number().required().label('Delivery Route'),
    estimated_days: Yup.number().required().label('Estimated days'),
    estimated_hours: Yup.number().required().label('Estimated Hours'),
    // estimated_minutes: Yup.number().required().label('Estimated Minutes'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (BusinessDeliveryRoute: IBusinessDeliveryRoute | undefined = undefined) => {
    if (BusinessDeliveryRoute != undefined) {
      setViewedBusinessDeliveryRoute(BusinessDeliveryRoute);
      getRoutes(BusinessDeliveryRoute, BusinessDeliveryRoute?.route?.from.id)
    }
    setEditModal(!editModal);
  }

  const toggleViewPackagesModal = (BusinessDeliveryRoute: IBusinessDeliveryRoute | undefined = undefined) => {
    if (BusinessDeliveryRoute != undefined) {
      setViewedBusinessDeliveryRoute(BusinessDeliveryRoute);
    }
    setViewPackagesModal(!packagesModal);
  }

  const toggleAddPackagesModal = (BusinessDeliveryRoute: IBusinessDeliveryRoute | undefined = undefined) => {
    if (BusinessDeliveryRoute != undefined) {
      setViewedBusinessDeliveryRoute(BusinessDeliveryRoute);
    }
    setAddPackagesModal(!addPackagesModal);
  }

  const getRoutes = (values: IBusinessDeliveryRoute, id: any) => {
    let district_id = id;
    get_delivery_routes(district_id);
  }



  return (
    <>
      <PageHeader page="Delivery Routes" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Delivery Routes List</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW ROUTE
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">From</th>
                    <th className="no-wrap">To</th>
                    <th>Packages</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (
                      <td colSpan={6}>Loading available Delivery Routes...</td>
                    )
                      : isError ? (
                        <td colSpan={6}>Error: {error.message}</td>
                      )
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((BusinessDeliveryRoute: IBusinessDeliveryRoute, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1)}</td>
                              <td className="no-wrap">{BusinessDeliveryRoute.route?.from.name}</td>
                              <td className="no-wrap">{BusinessDeliveryRoute.route?.to.name}</td>
                              <td className="no-wrap">
                                <a
                                  href={void (0)}
                                  onClick={() => toggleViewPackagesModal(BusinessDeliveryRoute)}
                                >
                                  {BusinessDeliveryRoute.packages?.length} {BusinessDeliveryRoute.packages?.length == 1 ? "Package" : "Packages"}
                                </a>
                              </td>
                              <td>
                                <div className=" btn-actions">
                                  {/* <a
                                    href={void (0)}
                                    onClick={() => toggleAddPackagesModal(BusinessDeliveryRoute)}
                                  >
                                    <i className="fas fa-truck text-info mr-1 ml-1"></i>
                                  </a> */}
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(BusinessDeliveryRoute)}
                                  >
                                    <i style={{ cursor: "pointer" }} className="fas fa-edit text-primary mr-1 ml-1"></i>
                                  </a>
                                  {BusinessDeliveryRoute?.active == 'No' ? (
                                    <a
                                      href={void (0)}
                                      onClick={() => changeStatus(BusinessDeliveryRoute)}
                                      title='enable'
                                    >
                                      <i style={{ cursor: "pointer" }} className="fas fa-check text-success mr-1 ml-1"></i>
                                    </a>
                                  ) : (
                                    <a
                                      href={void (0)}
                                      onClick={() => changeStatus(BusinessDeliveryRoute)}
                                      title='disable'
                                    >
                                      <i style={{ cursor: "pointer" }} className="fas fa-times text-danger mr-1 ml-1"></i>
                                    </a>
                                  )}
                                  <a href={void (0)} onClick={() => deleteBusinessDeliveryRoute(BusinessDeliveryRoute)}><i style={{ cursor: "pointer" }} className="fas fa-trash text-danger mr-1 ml-1"></i></a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (
                            <td colSpan={6}>No Business Delivery Route found</td>
                          )
                  }
                </tbody>
              </Table>
              {
                isLoading ? (
                  <td colSpan={10}>Loading available pages...</td>
                )
                  : isError ? (
                    <td colSpan={10}>Error: {error.message}</td>
                  ) : (
                    <TablePagination
                      isLoading={isLoading}
                      isError={isError}
                      error={error}
                      page={page}
                      totalPages={totalPages}
                      handlePageClick={handlePageClick}
                    />
                  )
              }
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
        <ModalHeader toggle={toggleAddModal}>Add New DeliveryRoute</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addBusinessDeliveryRoute}
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
                      <Label>Select Point From</Label>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <Input
                          type="select"
                          value={values.from}
                          name={`values.from`}
                          className="custom-select"
                          onChange={(event: any) => {
                            setFieldValue(`from`, event.currentTarget.value);
                            getRoutes(values, event.currentTarget.value);
                          }}
                        >
                          {
                            isDistrictsLoading ? (
                              <option>Loading place from...</option>
                            )
                              : districts.length > 0 ? (
                                <>
                                  <option value="">Select District From</option>
                                  {
                                    districts.map((district: ILocation, index: number) => (
                                      <option key={index} value={district.id}>{district.name}</option>
                                    ))
                                  }
                                </>
                              )
                                : (
                                  <option>No district found {districts.length}</option>
                                )
                          }
                        </Input>

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.from && errors.from && (
                        <MsgText
                          text={errors.from}
                          textColor="danger"
                        />
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup className="mb-3">
                      <Label>Select Delivery Route</Label>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <Input
                          type="select"
                          value={values.route_id}
                          name={`values.route_id`}
                          className="custom-select"
                          onChange={handleChange('route_id')}
                          onBlur={handleBlur('route_id')}
                        >
                          {
                            isDeliveryRoutesLoading ? (
                              <option>Loading available routes...</option>
                            )
                              : delivery_routes ? (
                                <>
                                  <option value="">Select routes</option>
                                  {
                                    delivery_routes.map((route: IDeliveryRoute, index: number) => (
                                      <option key={index} value={route.id}>{route.from.name} - {route.to.name}</option>
                                    ))
                                  }
                                </>
                              )
                                : (
                                  <option>No route found</option>
                                )
                          }
                        </Input>

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.route_id && errors.route_id && (
                        <MsgText
                          text={errors.route_id}
                          textColor="danger"
                        />
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Estimated Days</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Estimated Days"
                          type="number"
                          autoComplete="new-product-name"
                          value={values.estimated_days}
                          onChange={handleChange('estimated_days')}
                          onBlur={handleBlur('estimated_days')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.estimated_days && errors.estimated_days && (
                        <>
                          <MsgText
                            text={errors.estimated_days}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Estimated Hours</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Estimated Hours"
                          type="number"
                          autoComplete="new-product-name"
                          value={values.estimated_hours}
                          onChange={handleChange('estimated_hours')}
                          onBlur={handleBlur('estimated_hours')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.estimated_hours && errors.estimated_hours && (
                        <>
                          <MsgText
                            text={errors.estimated_hours}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                </Row>
                <FieldArray
                  name="packages"
                  render={arrayHelpers => (
                    <div className='m-b-3'>
                      {
                        values?.packages?.map((route_package: IDeliveryRoutePackage, index: number) => (
                          <>
                            <h5>
                              Package {(index + 1)}
                              <button
                                type="button"
                                className="btn btn-sm text-white bg-red"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </button>
                            </h5>
                            <Row>
                              <Col xl="4">
                                <FormGroup>
                                  <Label>Package minimum quantity</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`packages.${index}.minimum_quantity`}
                                      placeholder="Package minimum quantity"
                                      type="number"
                                      autoComplete="new-minimum"
                                      value={route_package.minimum_quantity}
                                      onChange={(event: any) => {
                                        setFieldValue(`packages.${index}.minimum_quantity`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.minimum_quantity && errors.minimum_quantity && (
                                  // <>
                                  //     <MsgText
                                  //     text={errors.minimum_quantity}
                                  //     textColor="danger"
                                  //     />
                                  //     <br />
                                  // </>
                                  // )
                                }
                              </Col>
                              <Col xl="4">
                                <FormGroup>
                                  <Label>Package maximum quantity</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`packages.${index}.maximum_quantity`}
                                      placeholder="Package maximum quantity"
                                      type="number"
                                      autoComplete="new-maximum"
                                      value={route_package.maximum_quantity}
                                      onChange={(event: any) => {
                                        setFieldValue(`packages.${index}.maximum_quantity`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.maximum_quantity && errors.maximum_quantity && (
                                  // <>
                                  //     <MsgText
                                  //     text={errors.maximum_quantity}
                                  //     textColor="danger"
                                  //     />
                                  //     <br />
                                  // </>
                                  // )
                                }
                              </Col>
                              <Col xl="4">
                                <FormGroup>
                                  <Label>Package delivery fees</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`packages.${index}.delivery_fees`}
                                      placeholder="Package Delivery fees"
                                      type="number"
                                      autoComplete="new-delivery-fees"
                                      value={route_package.delivery_fees}
                                      onChange={(event: any) => {
                                        setFieldValue(`packages.${index}.delivery_fees`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.delivery_fees && errors.delivery_fees && (
                                  // <>
                                  //     <MsgText
                                  //     text={errors.delivery_fees}
                                  //     textColor="danger"
                                  //     />
                                  //     <br />
                                  // </>
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
                            minimum_quantity: 0,
                            maximum_quantity: 0,
                            delivery_fees: 0
                          })
                        }
                      >
                        Add Packages
                      </button>
                    </div>
                  )}
                />
                <Row>
                  <Col xl="6">
                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                      {
                        savingBusinessDeliveryRoute ?
                          ("Saving...") :
                          ("Save Delivery Route")
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


      {/* View route packages */}
      <Modal
        isOpen={packagesModal}
        toggle={() => toggleViewPackagesModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleViewPackagesModal()}>Packages of Route {viewedBusinessDeliveryRoute?.route?.from.name} - {viewedBusinessDeliveryRoute?.route?.to.name}</ModalHeader>
        <ModalBody>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th className="no-wrap">Minimum Qty</th>
                <th className="no-wrap">Maximum Qty</th>
                <th className="no-wrap">Delivery Fees</th>
              </tr>
            </thead>
            <tbody>
              {
                viewedBusinessDeliveryRoute?.packages && viewedBusinessDeliveryRoute?.packages?.length > 0 ? (
                  viewedBusinessDeliveryRoute?.packages?.map((RoutePackage: IDeliveryRoutePackage, index: number) => (
                    <tr key={index}>
                      <td>{(index + 1)}</td>
                      <td className="no-wrap">{RoutePackage.minimum_quantity} KG</td>
                      <td className="no-wrap">{RoutePackage.maximum_quantity} KG</td>
                      <td className="no-wrap">{RoutePackage.delivery_fees} RWF</td>
                    </tr>
                  ))
                )
                  : (
                    <td colSpan={6}>No Package found</td>
                  )
              }
            </tbody>
            <tfoot>
              <tr>
                <th>ID</th>
                <th className="no-wrap">Minimum Qty</th>
                <th className="no-wrap">Maximum Qty</th>
                <th className="no-wrap">Delivery Fees</th>
              </tr>
            </tfoot>
          </Table>
          <Row>
            <Col xl="3">
            </Col>
            <Col xl="6">
              <Button className="my-4 w-100 bg-success text-white" color="secondary" onClick={() => toggleViewPackagesModal()}>Close</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>


      {/* Edit route */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit Route {viewedBusinessDeliveryRoute?.route?.from.name} - {viewedBusinessDeliveryRoute?.route?.to.name}</ModalHeader>
        <ModalBody>
          {
            viewedBusinessDeliveryRoute ? (
              <Formik
                enableReinitialize
                initialValues={viewedBusinessDeliveryRoute}
                onSubmit={editBusinessDeliveryRoute}
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
                          <Label>Select Point From</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.route?.from.id}
                              name={`values.from`}
                              className="custom-select"
                              onChange={(event: any) => {
                                setFieldValue(`from`, event.currentTarget.value);
                                getRoutes(values, event.currentTarget.value);
                              }}
                            >
                              {
                                isDistrictsLoading ? (
                                  <option>Loading place from...</option>
                                )
                                  : districts.length > 0 ? (
                                    <>
                                      <option value="">Select District From</option>
                                      {
                                        districts.map((district: ILocation, index: number) => (
                                          <option key={index} value={district.id}>{district.name}</option>
                                        ))
                                      }
                                    </>
                                  )
                                    : (
                                      <option>No district found {districts.length}</option>
                                    )
                              }
                            </Input>

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.from && errors.from && (
                            <MsgText
                              text={errors.from}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <Label>Select Delivery Route</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.route_id}
                              name={`values.route_id`}
                              className="custom-select"
                              onChange={handleChange('route_id')}
                              onBlur={handleBlur('route_id')}
                            >
                              {
                                isDeliveryRoutesLoading ? (
                                  <option>Loading available routes...</option>
                                )
                                  : delivery_routes ? (
                                    <>
                                      <option value="">Select routes</option>
                                      {
                                        delivery_routes.map((route: IDeliveryRoute, index: number) => (
                                          <option key={index} value={route.id}>{route.from.name} - {route.to.name}</option>
                                        ))
                                      }
                                    </>
                                  )
                                    : (
                                      <option>No route found</option>
                                    )
                              }
                            </Input>

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.route_id && errors.route_id && (
                            <MsgText
                              text={errors.route_id}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Estimated Days</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Estimated Days"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.estimated_days}
                              onChange={handleChange('estimated_days')}
                              onBlur={handleBlur('estimated_days')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.estimated_days && errors.estimated_days && (
                            <>
                              <MsgText
                                text={errors.estimated_days}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Estimated Hours</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Estimated Hours"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.estimated_hours}
                              onChange={handleChange('estimated_hours')}
                              onBlur={handleBlur('estimated_hours')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.estimated_hours && errors.estimated_hours && (
                            <>
                              <MsgText
                                text={errors.estimated_hours}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Estimated Minutes</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Estimated Minutes"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.estimated_minutes}
                              onChange={handleChange('estimated_minutes')}
                              onBlur={handleBlur('estimated_minutes')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.estimated_minutes && errors.estimated_minutes && (
                            <>
                              <MsgText
                                text={errors.estimated_minutes}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                    </Row>
                    <FieldArray
                      name="packages"
                      render={arrayHelpers => (
                        <div className='m-b-3'>
                          {
                            values?.packages?.map((route_package: IDeliveryRoutePackage, index: number) => (
                              <>
                                <h5>
                                  Package {(index + 1)}
                                  <button
                                    type="button"
                                    className="btn btn-sm text-white bg-red"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </button>
                                </h5>
                                <Row>
                                  <Col xl="4">
                                    <FormGroup>
                                      <Label>Package minimum quantity</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.minimum_quantity`}
                                          placeholder="Package minimum quantity"
                                          type="number"
                                          autoComplete="new-minimum"
                                          value={route_package.minimum_quantity}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.minimum_quantity`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.minimum_quantity && errors.minimum_quantity && (
                                      // <>
                                      //     <MsgText
                                      //     text={errors.minimum_quantity}
                                      //     textColor="danger"
                                      //     />
                                      //     <br />
                                      // </>
                                      // )
                                    }
                                  </Col>
                                  <Col xl="4">
                                    <FormGroup>
                                      <Label>Package maximum quantity</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.maximum_quantity`}
                                          placeholder="Package maximum quantity"
                                          type="number"
                                          autoComplete="new-maximum"
                                          value={route_package.maximum_quantity}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.maximum_quantity`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.maximum_quantity && errors.maximum_quantity && (
                                      // <>
                                      //     <MsgText
                                      //     text={errors.maximum_quantity}
                                      //     textColor="danger"
                                      //     />
                                      //     <br />
                                      // </>
                                      // )
                                    }
                                  </Col>
                                  <Col xl="4">
                                    <FormGroup>
                                      <Label>Package delivery fees</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.delivery_fees`}
                                          placeholder="Package Delivery fees"
                                          type="number"
                                          autoComplete="new-delivery-fees"
                                          value={route_package.delivery_fees}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.delivery_fees`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.delivery_fees && errors.delivery_fees && (
                                      // <>
                                      //     <MsgText
                                      //     text={errors.delivery_fees}
                                      //     textColor="danger"
                                      //     />
                                      //     <br />
                                      // </>
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
                                minimum_quantity: 0,
                                maximum_quantity: 0,
                                delivery_fees: 0
                              })
                            }
                          >
                            Add Packages
                          </button>
                        </div>
                      )}
                    />
                    <Row>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-success text-white" type="submit">
                          {
                            updatingBusinessDeliveryRoute ?
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


      {/* Add Packages */}
      <Modal
        isOpen={addPackagesModal}
        toggle={() => toggleAddPackagesModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleAddPackagesModal()}>Add Packages to Route {viewedBusinessDeliveryRoute?.route?.from.name} - {viewedBusinessDeliveryRoute?.route?.to.name}</ModalHeader>
        <ModalBody>
          {
            viewedBusinessDeliveryRoute ? (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={addRoutePackages}
              //   validationSchema={FormValidationSchema}
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
                          <Label>Select Point From</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.route?.from.id}
                              name={`values.from`}
                              className="custom-select"
                              onChange={(event: any) => {
                                setFieldValue(`from`, event.currentTarget.value);
                                getRoutes(values, event.currentTarget.value);
                              }}
                            >
                              {
                                isDistrictsLoading ? (
                                  <option>Loading place from...</option>
                                )
                                  : districts.length > 0 ? (
                                    <>
                                      <option value="">Select District From</option>
                                      {
                                        districts.map((district: ILocation, index: number) => (
                                          <option key={index} value={district.id}>{district.name}</option>
                                        ))
                                      }
                                    </>
                                  )
                                    : (
                                      <option>No district found {districts.length}</option>
                                    )
                              }
                            </Input>

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.from && errors.from && (
                            <MsgText
                              text={errors.from}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <Label>Select Delivery Route</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.route_id}
                              name={`values.route_id`}
                              className="custom-select"
                              onChange={handleChange('route_id')}
                              onBlur={handleBlur('route_id')}
                            >
                              {
                                isDeliveryRoutesLoading ? (
                                  <option>Loading available routes...</option>
                                )
                                  : delivery_routes ? (
                                    <>
                                      <option value="">Select routes</option>
                                      {
                                        delivery_routes.map((route: IDeliveryRoute, index: number) => (
                                          <option key={index} value={route.id}>{route.from.name} - {route.to.name}</option>
                                        ))
                                      }
                                    </>
                                  )
                                    : (
                                      <option>No route found</option>
                                    )
                              }
                            </Input>

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.route_id && errors.route_id && (
                            <MsgText
                              text={errors.route_id}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Estimated Days</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Estimated Days"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.estimated_days}
                              onChange={handleChange('estimated_days')}
                              onBlur={handleBlur('estimated_days')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.estimated_days && errors.estimated_days && (
                            <>
                              <MsgText
                                text={errors.estimated_days}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Estimated Hours</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Estimated Hours"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.estimated_hours}
                              onChange={handleChange('estimated_hours')}
                              onBlur={handleBlur('estimated_hours')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.estimated_hours && errors.estimated_hours && (
                            <>
                              <MsgText
                                text={errors.estimated_hours}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Estimated Minutes</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Estimated Minutes"
                              type="number"
                              autoComplete="new-product-name"
                              value={values.estimated_minutes}
                              onChange={handleChange('estimated_minutes')}
                              onBlur={handleBlur('estimated_minutes')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.estimated_minutes && errors.estimated_minutes && (
                            <>
                              <MsgText
                                text={errors.estimated_minutes}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                    </Row>
                    {/* <FieldArray
                      name="packages"
                      render={arrayHelpers => (
                        <div className='m-b-3'>
                          {
                            values?.packages?.map((route_package: IDeliveryRoutePackage, index: number) => (
                              <>
                                <h5>
                                  Package {(index + 1)}
                                  <button
                                    type="button"
                                    className="btn btn-sm text-white bg-red"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </button>
                                </h5>
                                <Row>
                                  <Col xl="4">
                                    <FormGroup>
                                      <Label>Package minimum quantity</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.minimum_quantity`}
                                          placeholder="Package minimum quantity"
                                          type="number"
                                          autoComplete="new-minimum"
                                          value={route_package.minimum_quantity}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.minimum_quantity`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.minimum_quantity && errors.minimum_quantity && (
                                      // <>
                                      //     <MsgText
                                      //     text={errors.minimum_quantity}
                                      //     textColor="danger"
                                      //     />
                                      //     <br />
                                      // </>
                                      // )
                                    }
                                  </Col>
                                  <Col xl="4">
                                    <FormGroup>
                                      <Label>Package maximum quantity</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.maximum_quantity`}
                                          placeholder="Package maximum quantity"
                                          type="number"
                                          autoComplete="new-maximum"
                                          value={route_package.maximum_quantity}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.maximum_quantity`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.maximum_quantity && errors.maximum_quantity && (
                                      // <>
                                      //     <MsgText
                                      //     text={errors.maximum_quantity}
                                      //     textColor="danger"
                                      //     />
                                      //     <br />
                                      // </>
                                      // )
                                    }
                                  </Col>
                                  <Col xl="4">
                                    <FormGroup>
                                      <Label>Package delivery fees</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.delivery_fees`}
                                          placeholder="Package Delivery fees"
                                          type="number"
                                          autoComplete="new-delivery-fees"
                                          value={route_package.delivery_fees}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.delivery_fees`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.delivery_fees && errors.delivery_fees && (
                                      // <>
                                      //     <MsgText
                                      //     text={errors.delivery_fees}
                                      //     textColor="danger"
                                      //     />
                                      //     <br />
                                      // </>
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
                                minimum_quantity: 0,
                                maximum_quantity: 0,
                                delivery_fees: 0
                              })
                            }
                          >
                            Add Packages
                          </button>
                        </div>
                      )}
                    /> */}
                    <Row>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-success text-white" type="submit">
                          {
                            savingRoutePackages ?
                              ("Loading...") :
                              ("Save Packages")
                          }
                        </Button>
                      </Col>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-red text-white" color="secondary" onClick={() => toggleAddPackagesModal()}>Cancel</Button>
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

DeliveryRoutes.layout = Delivery;

export default DeliveryRoutes;
