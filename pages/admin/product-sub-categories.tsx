
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { Formik } from 'formik';
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
  InputGroupText, Modal, ModalBody, ModalHeader, Row,
  Table
} from 'reactstrap';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import PageHeader from '../../components/Headers/PageHeader';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import { IProductCategory, IProductSubCategory } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { GetProductCategories } from '../api/product-categories';
import { AddProductSubCategories, GetProductSubCategories, UpdateProductSubCategories } from '../api/product-sub-categories';
// layout for this page

// core components
const ProductSubCategories = () => {

  let initialValues: IProductSubCategory = {
    category_id: 0,
    sub_category_name: '',
  };

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedProductSubCategory, setViewedProductSubCategory] = useState<IProductSubCategory>();

  const [updatingProductCategory, setUpdatingProductCategory] = useState(false);
  const [savingProductCategory, setSavingProductCategory] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);


  let get_payload = {
    paginate: true,
    page: page,
    dataSize: dataSize

  };
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["ProductSubCategories"],
    () => GetProductSubCategories(get_payload)
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

  const createMutation = useMutation(AddProductSubCategories);
  const updateMutation = useMutation(UpdateProductSubCategories);

  const addProductSubCategory = async (payload: IProductSubCategory) => {
    if (savingProductCategory) {
      return
    }
    setSavingProductCategory(true);
    setAddErrorMsg("");
    console.log(payload)
    const newProductCategorie = await createMutation.mutateAsync(payload);
    refetch();
    setSavingProductCategory(false);

    // Handle result from API
    console.log(newProductCategorie);

    // Close the add modal
    setAddModal(false);

    // Notify the user
    toast.success("Product Sub-Category added successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editProductCategory = async (payload: IProductSubCategory) => {
    console.log(payload);
    if (updatingProductCategory) {
      return
    }
    setUpdatingProductCategory(true);
    setEditErrorMsg("");
    const updateProductCategory = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingProductCategory(false);

    // Handle result from API
    console.log(updateProductCategory);

    //Close the edit modal
    setEditModal(false);

    // Notify the user
    toast.success("Product Sub-Category updated successfully", {
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

  useEffect(() => {
    // product_categories();
  }, [])

  const { isLoading: isProductCategoryLoading, isError: isProductCategoryError, error: productCategoryErrorMsg, isSuccess: isProductCategorySucces, data: productCategories }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["ProductCategories"],
    GetProductCategories
  );

  const FormValidationSchema = Yup.object().shape({
    category_id: Yup.number().required().min(0).label('Category'),
    sub_category_name: Yup.string().trim().required().label('Sub category name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (product_category: IProductSubCategory | undefined = undefined) => {
    if (product_category != undefined) {
      setViewedProductSubCategory(product_category);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Product sub categories" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products sub categories</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={() => toggleAddModal()}
                      size="sm"
                    >
                      ADD NEW SUB CATEGORY
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Category</th>
                    <th scope="col">Sub category</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (<td colSpan={4}>Loading available sub categories...</td>)
                      : isError ? (<td colSpan={4}>{error.message}</td>)
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((sub_category: IProductSubCategory, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{sub_category.category?.category_name}</td>
                              <td scope="row">{sub_category.sub_category_name}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(sub_category)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={4}>No Product Category Available</td>)
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

      {/* Add new product */}
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={toggleAddModal}>Add New Sub Product Category</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addProductSubCategory}
            validationSchema={FormValidationSchema}
          >
            {({
              values,
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
                      <i className="fas fa-table" />
                    </InputGroupText>

                    <select
                      className="custom-select"
                      value={values.category_id}
                      onChange={handleChange('category_id')}
                      onBlur={handleBlur('category_id')}
                    >
                      <option value="">Select category</option>
                      {
                        isLoading ? (<option>Loading available categories...</option>)
                          : isError ? (<option>{error.message}</option>)
                            : isSuccess && productCategories.length > 0 ? (
                              productCategories.map((category: IProductCategory, index: number) => (
                                <option key={index} value={category.id}>{category.category_name}</option>
                              ))
                            )
                              : (null)
                      }
                    </select>

                  </InputGroup>
                </FormGroup>
                {touched.category_id && errors.category_id && (
                  <MsgText
                    text={errors.category_id}
                    textColor="danger"
                  />
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Sub category name"
                      type="text"
                      autoComplete="new-sub_category_name"
                      value={values.sub_category_name}
                      onChange={handleChange('sub_category_name')}
                      onBlur={handleBlur('sub_category_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.sub_category_name && errors.sub_category_name && (
                  <>
                    <MsgText
                      text={errors.sub_category_name}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {
                      savingProductCategory ?
                        ("Loading...") :
                        ("Save Sub Category")
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
        size="sm"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit Product Category {viewedProductSubCategory?.sub_category_name}</ModalHeader>
        <ModalBody>
          {
            viewedProductSubCategory ? (
              <Formik
                enableReinitialize
                initialValues={viewedProductSubCategory}
                onSubmit={editProductCategory}
                validationSchema={FormValidationSchema}
              >
                {({
                  values,
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
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <select
                          className="custom-select"
                          value={values.category_id}
                          onChange={handleChange('category_id')}
                          onBlur={handleBlur('category_id')}
                        >
                          {
                            isLoading ? (<option>Loading available categories...</option>)
                              : isError ? (<option>{error.message}</option>)
                                : isSuccess && productCategories.length > 0 ? (
                                  productCategories.map((category: IProductCategory, index: number) => (
                                    <option key={index} value={category.id}>{category.category_name}</option>
                                  ))
                                )
                                  : (null)
                          }
                        </select>

                      </InputGroup>
                    </FormGroup>
                    {touched.category_id && errors.category_id && (
                      <MsgText
                        text={errors.category_id}
                        textColor="danger"
                      />
                    )}
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Category name"
                          type="text"
                          autoComplete="new-category-name"
                          value={values.sub_category_name}
                          onChange={handleChange('sub_category_name')}
                          onBlur={handleBlur('sub_category_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.sub_category_name && errors.sub_category_name && (
                      <>
                        <MsgText
                          text={errors.sub_category_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingProductCategory ?
                            ("Loading...") :
                            ("Update Sub Category")
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
    </>
  );
};

ProductSubCategories.layout = Admin;

export default ProductSubCategories;
