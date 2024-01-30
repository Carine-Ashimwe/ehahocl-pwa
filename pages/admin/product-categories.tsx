
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
import { IProductCategory } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddProductCategories, GetProductCategories, UpdateProductCategories } from '../api/product-categories';
// layout for this page

// core components


const ProductCategories = () => {

  let initialValues = {
    category_name: '',
  };

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedProductCategory, setViewedProductCategory] = useState<IProductCategory>();

  const [updatingProductCategory, setUpdatingProductCategory] = useState(false);
  const [savingProductCategory, setSavingProductCategory] = useState(false);

  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["ProductCategories"],
    GetProductCategories
  );


  const createMutation = useMutation(AddProductCategories);
  const updateMutation = useMutation(UpdateProductCategories);

  const addProductCategory = async (payload: IProductCategory) => {
    if (savingProductCategory) {
      return
    }
    setSavingProductCategory(true);
    setAddErrorMsg("");
    const newProductCategory = await createMutation.mutateAsync(payload);
    refetch();
    setSavingProductCategory(false);

    // Handle result from API
    console.log(newProductCategory);

    // Close the add modal
    setAddModal(false);

    // Notify the user
    toast.success("Product category added successfully", {
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


  const editProductCategory = async (payload: IProductCategory) => {
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
    toast.success("Product category updated successfully", {
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

  // const handleDisable = async (category: IProductCategory): Promise<void> => {
  //   const { id } = category;
  //   const updatedCategory = { ...category, enabled: false };

  //   try {
  //     await updateMutation.mutateAsync(updatedCategory);
  //     refetch();
  //     toast.success("Category disabled successfully", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to disable category", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };


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
    category_name: Yup.string().trim().required().label('Category name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (product_category: IProductCategory | undefined = undefined) => {
    if (product_category != undefined) {
      setViewedProductCategory(product_category);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Product  categories" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products  categories</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD PRODUCT CATEGORY
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (<td colSpan={3}>Loading available categories...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data.length > 0 ? (
                          data.map((category: IProductCategory, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{category.category_name}</td>
                              <td scope="row">{category.created_at}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(category)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                  {/* <a 
                                  href={void(0)}
                                  onClick={() => handleDisable(category)}
                                >
                                  <i className="fas fa-ban text-danger mr-1 ml-1"></i>
                                </a> */}
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No Product Category Available</td>)
                  }
                </tbody>
              </Table>
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
        <ModalHeader toggle={toggleAddModal}>Add New Product Category</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addProductCategory}
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
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Category name"
                      type="text"
                      autoComplete="new-category-name"
                      value={values.category_name}
                      onChange={handleChange('category_name')}
                      onBlur={handleBlur('category_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.category_name && errors.category_name && (
                  <>
                    <MsgText
                      text={errors.category_name}
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
                        ("Save  Category")
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
        <ModalHeader toggle={() => toggleEditModal()}>Edit Product Category {viewedProductCategory?.category_name}</ModalHeader>
        <ModalBody>
          {
            viewedProductCategory ? (
              <Formik
                enableReinitialize
                initialValues={viewedProductCategory}
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
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Category name"
                          type="text"
                          autoComplete="new-category-name"
                          value={values.category_name}
                          onChange={handleChange('category_name')}
                          onBlur={handleBlur('category_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.category_name && errors.category_name && (
                      <>
                        <MsgText
                          text={errors.category_name}
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
                            ("Update Category")
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

ProductCategories.layout = Admin;

export default ProductCategories;