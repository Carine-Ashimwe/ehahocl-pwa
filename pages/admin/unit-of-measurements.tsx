import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { FieldArray, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card, CardHeader, Col,
  Container, Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText, Label, Modal, ModalBody, ModalHeader, Row,
  Table
} from 'reactstrap';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import PageHeader from '../../components/Headers/PageHeader';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import { IPackage, IUnit } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddUnitOfMeasurements, GetUnitOfMeasurements, UpdateUnitOfMeasurements } from '../api/unit-of-measurements';
// layout for this page

// core components


const UnitOfMeasurements = () => {

  let initialValues: IUnit = {
    unit_name: '',
    packages: [
      {
        package_name: '',
        smallest_unit_conversion: 1
      }
    ]
  };

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewPackagesModal, setViewPackagesModal] = useState(false);
  const [viewedUnitOfMeasurement, setViewedUnitOfMeasurement] = useState<IUnit>();

  const [updatingUnitOfMeasurement, setUpdatingUnitOfMeasurement] = useState(false);
  const [savingUnitOfMeasurement, setSavingUnitOfMeasurement] = useState(false);

  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  let get_payload = {
    paginate: true,
    page: page,
    dataSize: dataSize

  }
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["UnitOfMeasurements"],
    () => GetUnitOfMeasurements(get_payload)
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


  const createMutation = useMutation(AddUnitOfMeasurements);
  const updateMutation = useMutation(UpdateUnitOfMeasurements);

  const addUnitOfMeasurement = async (payload: IUnit) => {
    if (savingUnitOfMeasurement) {
      return
    }
    setSavingUnitOfMeasurement(true);
    setAddErrorMsg("");
    const newUnitOfMeasurement = await createMutation.mutateAsync(payload);
    refetch();
    setSavingUnitOfMeasurement(false);

    // Handle result from API
    console.log(newUnitOfMeasurement);

    setAddModal(false);

    // Notify the user
    toast.success("Unit added successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
    // setSavingProductCategorie(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editUnitOfMeasurement = async (payload: IUnit) => {
    console.log(payload);
    if (updatingUnitOfMeasurement) {
      return
    }
    setUpdatingUnitOfMeasurement(true);
    setEditErrorMsg("");
    const updateUnitOfMeasurement = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingUnitOfMeasurement(false);

    // Handle result from API
    console.log(updateUnitOfMeasurement);

    setEditModal(false);

    // Notify the user
    toast.success("Unit updated successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
    // setSavingProductCategorie(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
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
    // if (msg_type === 'success') {
    //   toast.success(successMsg, {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: 'light'
    //   });
    // }
  }

  // useEffect(() => {
  //   if (successMsg) {
  //     notify('success')
  //   }
  // }, [successMsg])

  useEffect(() => {
    if (isError) {
      notify('error')
    }
  }, [isError])

  const FormValidationSchema = Yup.object().shape({
    unit_name: Yup.string().trim().required().label('Unit name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (product_unit: IUnit | undefined = undefined) => {
    if (product_unit != undefined) {
      setViewedUnitOfMeasurement(product_unit);
    }
    setEditModal(!editModal);
  }

  const toggleViewPackagesModal = (product_unit: IUnit | undefined = undefined) => {
    if (product_unit != undefined) {
      setViewedUnitOfMeasurement(product_unit);
    }
    setViewPackagesModal(!viewPackagesModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Product Units" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products  Units</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW UNIT
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Unit Name</th>
                    <th scope="col">Packages</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (<td colSpan={3}>Loading available Units...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((unit: IUnit, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{unit.unit_name}</td>
                              <td scope="row">
                                <Button
                                  className='bg-success text-white'
                                  size="sm"
                                  onClick={() => toggleViewPackagesModal(unit)}
                                >
                                  {unit.packages.length} Packages
                                </Button>
                              </td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(unit)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No Product Unit Available</td>)
                  }
                </tbody>
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


      {/* Add new package */}
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="md"
      >
        <ModalHeader toggle={toggleAddModal}>Add New Product Unit</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addUnitOfMeasurement}
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
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Unit name"
                      type="text"
                      autoComplete="new-group-name"
                      value={values.unit_name}
                      onChange={handleChange('unit_name')}
                      onBlur={handleBlur('unit_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.unit_name && errors.unit_name && (
                  <>
                    <MsgText
                      text={errors.unit_name}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FieldArray
                  name="packages"
                  render={arrayHelpers => (
                    <div className='m-b-3'>
                      {
                        values.packages.map((product: IPackage, index: number) => (
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
                              <Col xl="6">
                                <FormGroup>
                                  <Label>Package Name</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`packages.${index}.package_name`}
                                      placeholder="Package Name"
                                      type="text"
                                      autoComplete="new-product-name"
                                      value={values.packages[index].package_name}
                                      onChange={(event: any) => {
                                        setFieldValue(`packages.${index}.package_name`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.package_name && errors.package_name && (
                                  //   <>
                                  //     <MsgText
                                  //       text={errors.package_name}
                                  //       textColor="danger"
                                  //     />
                                  //     <br />
                                  //   </>
                                  // )
                                }
                              </Col>
                              <Col xl="6">
                                <FormGroup>
                                  <Label>Qty in smallest unit ()</Label>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupText>
                                      <i className="ni ni-collection" />
                                    </InputGroupText>
                                    <Input
                                      name={`packages.${index}.smallest_unit_conversion`}
                                      placeholder="Quantity in"
                                      type="number"
                                      autoComplete="new-smallest-conversion"
                                      value={values.packages[index].smallest_unit_conversion}
                                      onChange={(event: any) => {
                                        setFieldValue(`packages.${index}.smallest_unit_conversion`, event.currentTarget.value);
                                      }}
                                    />

                                  </InputGroup>
                                </FormGroup>
                                {
                                  // touched.smallest_unit_conversion && errors.smallest_unit_conversion && (
                                  //   <>
                                  //     <MsgText
                                  //       text={errors.smallest_unit_conversion}
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
                            package_name: '',
                            smallest_unit_conversion: 0
                          })
                        }
                      >
                        Add Package
                      </button>
                    </div>
                  )}
                />
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {
                      savingUnitOfMeasurement ?
                        ("Loading...") :
                        ("Save Unit")
                    }
                  </Button>
                </div>
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
        size="md"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit Product Unit {viewedUnitOfMeasurement?.unit_name}</ModalHeader>
        <ModalBody>
          {
            viewedUnitOfMeasurement ? (
              <Formik
                enableReinitialize
                initialValues={viewedUnitOfMeasurement}
                onSubmit={editUnitOfMeasurement}
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
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Unit name"
                          type="text"
                          autoComplete="new-group-name"
                          value={values.unit_name}
                          onChange={handleChange('unit_name')}
                          onBlur={handleBlur('unit_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.unit_name && errors.unit_name && (
                      <>
                        <MsgText
                          text={errors.unit_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                    <FieldArray
                      name="packages"
                      render={arrayHelpers => (
                        <div className='m-b-3'>
                          {
                            values.packages.map((product: IPackage, index: number) => (
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
                                  <Col xl="6">
                                    <FormGroup>
                                      <Label>Package Name</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.package_name`}
                                          placeholder="Package Name"
                                          type="text"
                                          autoComplete="new-product-name"
                                          value={values.packages[index].package_name}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.package_name`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.package_name && errors.package_name && (
                                      //   <>
                                      //     <MsgText
                                      //       text={errors.package_name}
                                      //       textColor="danger"
                                      //     />
                                      //     <br />
                                      //   </>
                                      // )
                                    }
                                  </Col>
                                  <Col xl="6">
                                    <FormGroup>
                                      <Label>Qty in smallest unit ()</Label>
                                      <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                          <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                          name={`packages.${index}.smallest_unit_conversion`}
                                          placeholder="Quantity in"
                                          type="number"
                                          autoComplete="new-smallest-conversion"
                                          value={values.packages[index].smallest_unit_conversion}
                                          onChange={(event: any) => {
                                            setFieldValue(`packages.${index}.smallest_unit_conversion`, event.currentTarget.value);
                                          }}
                                        />

                                      </InputGroup>
                                    </FormGroup>
                                    {
                                      // touched.smallest_unit_conversion && errors.smallest_unit_conversion && (
                                      //   <>
                                      //     <MsgText
                                      //       text={errors.smallest_unit_conversion}
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
                                package_name: '',
                                smallest_unit_conversion: 0
                              })
                            }
                          >
                            Add Package
                          </button>
                        </div>
                      )}
                    />
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingUnitOfMeasurement ?
                            ("Loading...") :
                            ("Update Unit")
                        }
                      </Button>
                    </div>
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
        isOpen={viewPackagesModal}
        toggle={() => toggleViewPackagesModal()}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={() => toggleViewPackagesModal()}> Packages of {viewedUnitOfMeasurement?.unit_name} </ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Packages name</th>
                <th>Conversion Quantiy</th>
              </tr>
            </thead>
            <tbody>
              {
                viewedUnitOfMeasurement?.packages ? (
                  viewedUnitOfMeasurement?.packages.map((unit_package: IPackage, index: number) => (
                    <tr key={index}>
                      <td>{(index + 1)}</td>
                      <td>{unit_package.package_name}</td>
                      <td>{unit_package.smallest_unit_conversion} {viewedUnitOfMeasurement.packages[0].package_name}</td>
                    </tr>
                  ))
                )
                  : (null)
              }
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
};

UnitOfMeasurements.layout = Admin;

export default UnitOfMeasurements;