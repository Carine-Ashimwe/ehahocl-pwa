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
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import axios from '../../helpers/axios';
import { IBusinessProduct, IDamage, IPackage, IShop } from '../../interfaces';
import Vendor from '../../layouts/Vendor';
import { AddDamages, GetDamages, UpdateDamages } from '../api/damages';
const Damages = () => {

  let initialValues: IDamage = {
    business_product_id: 0,
    unit_package: 0,
    quantity: 0,
    damage_date: '',
    packages: [
      {
        package_name: '',
        smallest_unit_conversion: 0
      }
    ]
  };

  const [activeShop, setActiveShop] = useState<IShop | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedDamage, setViewedDamage] = useState<IDamage>();

  const [business_products, setBusinessProducts] = useState([]);
  const [isBusinessProductLoading, setIsBusinessProductLoading] = useState(false);

  const [updatingDamage, setUpdatingDamage] = useState(false);
  const [savingDamage, setSavingDamage] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<IBusinessProduct>();


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

  const createMutation = useMutation(AddDamages);
  const updateMutation = useMutation(UpdateDamages);

  const addDamage = async (payload: IDamage) => {
    if (savingDamage) {
      return
    }
    setSavingDamage(true);
    setErrorMsg("");
    const newDamage = await createMutation.mutateAsync(payload);
    refetch();
    setSavingDamage(false);

    // Handle result from API
    console.log(newDamage);
    // setSavingDamage(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editDamage = async (payload: IDamage) => {
    console.log(payload);
    if (updatingDamage) {
      // return
    }
    setUpdatingDamage(true);
    setErrorMsg("");
    const updateDamage = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingDamage(false);

    // Handle result from API
    console.log(updateDamage);
    // setSavingDamage(false);
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
    ["Damages"],
    () => GetDamages(get_payload),
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
        console.log(res.data);
        setBusinessProducts(res.data);
      })
      .catch((error) => {
        setIsBusinessProductLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  const FormValidationSchema = Yup.object().shape({
    business_product_id: Yup.string().trim().required().label('Product'),
    unit_package: Yup.string().trim().required().label('Damage price'),
    quantity: Yup.string().trim().required().min(1).label('Damage quantity'),
    damage_date: Yup.string().trim().required().label('Damage Date'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (damage: IDamage | undefined = undefined) => {
    if (damage != undefined) {
      setViewedDamage(damage);
    }
    setEditModal(!editModal);
  }

  useEffect(() => {
    console.log("Being viewed:", viewedDamage);
  }, [viewedDamage]);

  const setProductSelected = (values: IDamage, event: any) => {
    let product_id = event.currentTarget.value;
    let product_index = business_products.findIndex((x: IBusinessProduct) => x.id == product_id);
    let product: IBusinessProduct = business_products[product_index];
    setSelectedProduct(product);
    if (product.product?.unit?.packages) {
      values.packages = product.product?.unit?.packages;
    }
    console.log("Data", values);
    console.log("Product", selectedProduct);
    
    
  }

  return (
    <>
      <PageHeader page="Damages" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Damages List</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW DAMAGE
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
                    <th>Quantity</th>
                    <th className="no-wrap">Damage date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (
                      <td colSpan={6}>Loading available damages...</td>
                    )
                      : isError ? (
                        <td colSpan={6}>Error: {error.message}</td>
                      )
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((damage: IDamage, index: number) => (
                            <tr key={index}>
                              <td>{(index + 1)}</td>
                              <td>
                                <img src={(damage.business_product?.business_images && damage.business_product?.business_images.length > 0 && damage.business_product?.business_images[0].image_path) || (damage.business_product?.product?.images && damage.business_product?.product?.images.length > 0 && damage.business_product?.product?.images[0].image_path) || ''} alt={damage.business_product?.product?.product_name} width={50} />
                              </td>
                              <td className="no-wrap">{damage.business_product?.product?.product_name}</td>
                              <td className="no-wrap">{damage.quantity} {damage.package?.package_name}</td>
                              <td>{damage.damage_date}</td>
                              <td>
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(damage)}
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
                            <td colSpan={6}>No damage found</td>
                          )
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>ID</th>
                    <th className="no-wrap">Product Image</th>
                    <th className="no-wrap">Product Name</th>
                    <th>Quantity</th>
                    <th className="no-wrap">Damage date</th>
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
        <ModalHeader toggle={toggleAddModal}>Add New Damage</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addDamage}
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
                          value={values.business_product_id}
                          name={`values.business_product_id`}
                          className="custom-select"
                          onChange={(event: any) => {
                            setFieldValue(`business_product_id`, event.currentTarget.value);
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
                      touched.business_product_id && errors.business_product_id && (
                        <MsgText
                          text={errors.business_product_id}
                          textColor="danger"
                        />
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup className="mb-3">
                      <Label>Select Default Package</Label>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <Input
                          type="select"
                          value={values.unit_package}
                          name={`values.unit_package`}
                          className="custom-select"
                          onChange={handleChange('unit_package')}
                          onBlur={handleBlur('unit_package')}
                        >
                          {isBusinessProductLoading ? (
                            <option>Loading available packages...</option>
                          ) : errorMsg !== '' ? (
                            <option>Error: {errorMsg}</option>
                          ) : values.packages && selectedProduct && selectedProduct.default_package ? (
                            <>
                              <option value="">Select package</option>
                              <option value={selectedProduct.default_package.id}>
                                {selectedProduct.default_package.package_name}
                              </option>
                            </>
                          ) : (
                            <option>No package found</option>
                          )}
                        </Input>

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.unit_package && errors.unit_package && (
                        <MsgText
                          text={errors.unit_package}
                          textColor="danger"
                        />
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Damage Qty</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Damage Qty"
                          type="number"
                          autoComplete="new-product-name"
                          value={values.quantity}
                          onChange={handleChange('quantity')}
                          onBlur={handleBlur('quantity')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.quantity && errors.quantity && (
                        <>
                          <MsgText
                            text={errors.quantity}
                            textColor="danger"
                          />
                          <br />
                        </>
                      )
                    }
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Damage Date</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Damage Date"
                          type="date"
                          autoComplete="new-product-name"
                          value={values.damage_date}
                          onChange={handleChange('damage_date')}
                          onBlur={handleBlur('damage_date')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {
                      touched.damage_date && errors.damage_date && (
                        <>
                          <MsgText
                            text={errors.damage_date}
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
                        savingDamage ?
                          ("Loading...") :
                          ("Save Damages")
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
        <ModalHeader toggle={() => toggleEditModal()}>Edit Damage {viewedDamage?.damage_date}</ModalHeader>
        <ModalBody>
          {
            viewedDamage ? (
              <Formik
                enableReinitialize
                initialValues={viewedDamage}
                onSubmit={editDamage}
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
                              value={values.business_product_id}
                              name={`values.business_product_id`}
                              className="custom-select"
                              onChange={(event: any) => {
                                setFieldValue(`values.business_product_id`, event.currentTarget.value);
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
                          touched.business_product_id && errors.business_product_id && (
                            <MsgText
                              text={errors.business_product_id}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <Label>Select Default Package</Label>
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <Input
                              type="select"
                              value={values.unit_package}
                              name={`values.unit_package`}
                              className="custom-select"
                              onChange={(event: any) => {
                                setFieldValue(`values.unit_package`, event.currentTarget.value);
                              }}
                            >
                              {
                                isBusinessProductLoading ? (
                                  <option>Loading available packages...</option>
                                )
                                  : errorMsg != '' ? (
                                    <option>Error: {errorMsg}</option>
                                  )
                                    : values.packages ? (
                                      <>
                                        <option value="">Select package</option>
                                        {
                                          values.packages.map((unit_package: IPackage, index) => (
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
                          touched.unit_package && errors.unit_package && (
                            <MsgText
                              text={errors.unit_package}
                              textColor="danger"
                            />
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Damage Qty</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Damage Qty"
                              type="number"
                              autoComplete="new-damage-qty"
                              value={values.quantity}
                              onChange={handleChange('quantity')}
                              onBlur={handleBlur('quantity')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.quantity && errors.quantity && (
                            <>
                              <MsgText
                                text={errors.quantity}
                                textColor="danger"
                              />
                              <br />
                            </>
                          )
                        }
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <Label>Damage Date</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Damage Date"
                              type="date"
                              autoComplete="new-product-name"
                              value={values.damage_date}
                              onChange={handleChange('damage_date')}
                              onBlur={handleBlur('damage_date')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {
                          touched.damage_date && errors.damage_date && (
                            <>
                              <MsgText
                                text={errors.damage_date}
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
                            updatingDamage ?
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
    </>
  );
}

Damages.layout = Vendor;

export default Damages;
