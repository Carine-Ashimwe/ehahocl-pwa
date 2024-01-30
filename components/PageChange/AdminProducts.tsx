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
  InputGroupText, Label, Modal, ModalBody, ModalHeader, Row,
  Table
} from 'reactstrap';
import * as Yup from 'yup';
import axios from '../../helpers/axios';
import { IImage, IProduct, IProductSubCategory, IProGroup, IUnit } from '../../interfaces';
import { AddProduct, disableProduct, enableProduct, GetProducts, UpdateProduct } from '../../pages/api/products';
import { MsgText } from '../Common/MsgText';
import PageHeader from '../Headers/PageHeader';
import DataEnteries from '../Pagination/dataSize';
import TablePagination from '../Pagination/pagination';
// layout for this page

const AdminProducts = ({ vendor }: { vendor: number }) => {

  let initialValues: IProduct = {
    sub_category_id: 0,
    group_id: undefined,
    product_name: '',
    unit_id: 0,
    default_description: '',
    product_images: ['']
  };


  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [viewedProduct, setViewedProduct] = useState<IProduct>();

  // const [products, setProducts] = useState([]);
  // const [productErrorMsg, setProductErrorMsg] = useState("");
  // const [isProductLoading, setIsProductLoading] = useState(false);

  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const [productSubCategories, setProductSubCategories] = useState([]);
  const [productSubCategoryErrorMsg, setProductSubCategoryErrorMsg] = useState("");
  const [isProductSubCategoryLoading, setIsProductSubCategoryLoading] = useState(false);

  const [productGroups, setProductGroups] = useState([]);
  const [productGroupErrorMsg, setProductGroupErrorMsg] = useState("");
  const [isProductGroupLoading, setIsProductGroupLoading] = useState(false);

  const [units, setUnits] = useState([]);
  const [unitErrorMsg, setUnitErrorMsg] = useState("");
  const [isUnitLoading, setIsUnitLoading] = useState(false);

  // Images states
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedExistingImages, setSelectedExistingImages] = useState<string[]>([]);
  const [productExistingImages, setProductExistingImages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);


  let get_payload = {
    category_id: vendor,
    sub_category_id: null,
    paginate: true,
    page: page,
    dataSize: dataSize

  };
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    [`admin_products_${vendor}`],
    () => GetProducts(get_payload)
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

  // Image handlers
  const onSelectFile = (event: any, action: string) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray: any = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file: any) => {
      return URL.createObjectURL(file);
    });

    if (action == 'add') {
      setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    }
    else {
      setSelectedExistingImages((previousImages) => previousImages.concat(imagesArray));
    }
    // FOR BUG IN CHROME
    event.target.value = "";

    // Upload on the server
    const formData = new FormData();
    formData.append('upload_type', 'multiple');
    formData.append('storage', 'images/products');
    formData.append('value_name', 'images');
    for (let index = 0; index < selectedFilesArray.length; index++) {
      formData.append(`images[${index}]`, selectedFilesArray[index]);
    }

    const options: any = {
      onUploadProgress: (progressEvent: { loaded: any; total: any; }) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        if (percent <= 100) {
          console.info(`${loaded}kb of ${total}kb | ${percent}%`);
          // setUploadPercentage(percent)
        }
      },
    };
    // setIsUploading(true)
    axios
      .post('/image_upload', formData, options)
      .then((res: any) => {
        if (res.data.status) {
          if (action == 'add') {
            setProductImages((previousImages) => previousImages.concat(res.data.message));
          }
          else {
            setProductExistingImages((previousImages) => previousImages.concat(res.data.message));
          }

          // setIsUploading(false)
        }
        else {
          setErrorMsg(res.data.message);
        }
      })
      .catch((error: any) => {
        // setIsUploading(false)
        console.error(error.response?.data?.message);
        setErrorMsg("Something went wrong!");
      });
  };

  function deleteHandler(image: string, action: string) {
    if (action == 'add') {
      let index = selectedImages.indexOf(image);
      setSelectedImages(selectedImages.filter((e) => e !== image));
      setProductImages(productImages.filter((e, i) => i !== index));
      URL.revokeObjectURL(image);
    }
    else {
      let index = selectedExistingImages.indexOf(image);
      setSelectedExistingImages(selectedExistingImages.filter((e) => e !== image));
      setProductExistingImages(productExistingImages.filter((e, i) => i !== index));
      URL.revokeObjectURL(image);
    }
  }
  // End of images handlers

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
    product_sub_categories();
    product_groups();
    unit_of_measurements();
  }, [])

  const product_sub_categories = () => {
    // Get product sub categories
    if (isProductSubCategoryLoading) {
      return
    }
    setProductSubCategoryErrorMsg("");
    setIsProductSubCategoryLoading(true);
    let get_payload = {
      category_id: vendor
    };
    axios.get(`/product_sub_categories`, { params: get_payload })
      .then((res) => {
        setIsProductSubCategoryLoading(false);
        setProductSubCategoryErrorMsg("");
        setProductSubCategories(res.data);
      })
      .catch((error) => {
        setIsProductSubCategoryLoading(false);
        const errorMessage = error.response?.data?.message;
        setProductSubCategoryErrorMsg(errorMessage || error.message);
      })
  }

  const product_groups = () => {
    // Get product groups
    if (isProductGroupLoading) {
      return
    }
    setProductGroupErrorMsg("");
    setIsProductGroupLoading(true);

    axios.get('/product_groups')
      .then((res) => {
        setIsProductGroupLoading(false);
        setProductGroupErrorMsg("");
        setProductGroups(res.data);
      })
      .catch((error) => {
        setIsProductGroupLoading(false);
        const errorMessage = error.response?.data?.message;
        setProductGroupErrorMsg(errorMessage || error.message);
      })
  }

  const unit_of_measurements = () => {
    // Get product units
    if (isUnitLoading) {
      return
    }
    setUnitErrorMsg("");
    setIsUnitLoading(true);

    axios.get('/unit_of_measurements')
      .then((res) => {
        setIsUnitLoading(false);
        setUnitErrorMsg("");
        setUnits(res.data);
        // console.log("Units", units);
        
      })
      .catch((error) => {
        setIsUnitLoading(false);
        const errorMessage = error.response?.data?.message;
        setUnitErrorMsg(errorMessage || error.message);
      })
  }

  const FormValidationSchema = Yup.object().shape({
    sub_category_id: Yup.number().min(1).label('Product category'),
    unit_id: Yup.number().min(1).label('Product Unit of Measurements'),
    product_name: Yup.string().trim().required().label('Product name'),
    // default_description: Yup.string().trim().required().label('Product Details'),
    // group_id: Yup.string().trim().label('Product group'),
    // images: Yup.array().min(1),
  });

  const createMutation = useMutation(AddProduct);
  const updateMutation = useMutation(UpdateProduct);

  const addNewProduct = async (payload: IProduct) => {
    if (savingProduct) {
      return
    }
    if (productImages.length <= 0) {
      setErrorMsg("Image is mandatory. Wait for upload.");
      return
    }
    payload.product_images = productImages;
    setSavingProduct(true);
    const new_product = await createMutation.mutateAsync({ ...payload })
    setSavingProduct(false);
    if (new_product) {
      if (new_product.status) {
        setSuccessMsg("Product Saved Successfully!");
        refetch();
        setAddModal(false);
      }
      else {
        setErrorMsg(new_product.message);
      }
    }
    if (createMutation.isError) {
      setErrorMsg("Something went wrong!");
    }
  }

  const editExistingProduct = async (payload: IProduct) => {
    if (updatingProduct) {
      return
    }
    if (productExistingImages.length <= 0) {
      setErrorMsg("Image is mandatory. Wait for upload.");
      return
    }
    payload.product_images = productExistingImages;
    setUpdatingProduct(true);
    const new_product = await updateMutation.mutateAsync({ ...payload })
    setUpdatingProduct(false);
    if (new_product) {
      if (new_product.status) {
        setSuccessMsg("Product Updated Successfully!");
        refetch();
        setEditModal(false);
      }
      else {
        setErrorMsg(new_product.message);
      }
    }
    if (updateMutation.isError) {
      setErrorMsg("Something went wrong!");
    }
  }

  const disableProductHandler = async (productId: number | undefined) => {
    if (!productId) {
      setErrorMsg("Product ID is missing!");
      return;
    }

    const response = await disableProduct({ id: productId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Product disabled successfully");
        refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };

  const enableProductHandler = async (productId: number | undefined) => {
    if (!productId) {
      setErrorMsg("Product ID is missing!");
      return;
    }

    const response = await enableProduct({ id: productId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Product restored successfully");
        refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (product: IProduct | undefined = undefined) => {
    setViewedProduct({
      sub_category_id: 0,
      group_id: 0,
      product_name: '',
      unit_id: 0,
      default_description: '',
      product_images: ['']
    });
    setEditModal(!editModal);
    if (product != undefined) {
      setViewedProduct(product);
      setSelectedExistingImages([]);
      setProductExistingImages([]);
      const product_images = product.images?.map((image: IImage) => {
        return image.image_path;
      });
      setSelectedExistingImages((existing) => existing.concat(product_images!));
      setProductExistingImages((existing) => existing.concat(product_images!));
    }
  }
  useEffect(() => {
    if (selectedExistingImages) {
      console.log({ selectedExistingImages });
    }

  }, [selectedExistingImages])

  return (
    <>
      <ToastContainer />
      <PageHeader page="Products" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                  <div className="col text-right">
                    <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW PRODUCT
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Image</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Category</th>
                    {isSuccess && data[0] && data[0].some((product: { group: any; }) => product.group) && <th scope="col">Group</th>}
                    <th scope="col">Unit</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (<td colSpan={8}>Loading available products...</td>)
                      : isError ? (<td colSpan={8}>{error.message}</td>)
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((product: IProduct, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">
                                <img src={(product.images && product.images.length > 0 && product.images[0].image_path) || ''} alt={product.product_name} width={50} />
                              </td>
                              <td scope="row">{product.product_name}</td>
                              <td scope="row">{product.sub_category?.sub_category_name}</td>
                              {product.group ? (
                                <td scope="row">{product.group.group_name}</td>
                              ) : (
                                data && data.some((product: { group: any; }) => product.group) && <td scope="row"></td>
                              )}
                              <td scope="row">{product.unit?.unit_name}</td>
                              <td scope="row">{product.default_description}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(product)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                  {product.published === "Yes" ? (
                                    <a href={void (0)} onClick={() => disableProductHandler(product.id)}>
                                      <i className="fas fa-ban text-danger mr-1 ml-1"></i>
                                    </a>
                                  ) : (
                                    <a href={void (0)} onClick={() => enableProductHandler(product.id)}>
                                      <i className="fas fa-check-circle text-success mr-1 ml-1"></i>
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={8}>No product found</td>)
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
        size="lg"
      >
        <ModalHeader toggle={toggleAddModal}>Add New product</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addNewProduct}
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

                <Row>
                  <Col xl="4">
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-table" />
                        </InputGroupText>

                        <select
                          className="custom-select"
                          value={values.sub_category_id}
                          onChange={handleChange("sub_category_id")}
                          onBlur={handleBlur('sub_category_id')}
                        >
                          {
                            isProductSubCategoryLoading ?
                              (<option value="">Loading available categories...</option>) :
                              (null)
                          }
                          {
                            productSubCategoryErrorMsg != "" ?
                              (<option value="">{productSubCategoryErrorMsg}</option>) :
                              (null)
                          }
                          <option value="">Select Category</option>
                          {
                            productSubCategoryErrorMsg == "" ?
                              (productSubCategories.map((sub_category: IProductSubCategory, index) => (
                                <option key={index} value={sub_category.id}>{sub_category.sub_category_name}</option>
                              ))) :
                              (null)
                          }
                        </select>

                      </InputGroup>
                    </FormGroup>
                    {touched.sub_category_id && errors.sub_category_id && (
                      <MsgText
                        text={errors.sub_category_id}
                        textColor="danger"
                      />
                    )}
                  </Col>
                  {
                    vendor == 1 ? (
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>

                            <select
                              className="custom-select"
                              value={values.group_id}
                              onChange={handleChange("group_id")}
                              onBlur={handleBlur('group_id')}
                            >
                              {
                                isProductSubCategoryLoading ?
                                  (<option value="">Loading available groups...</option>) :
                                  (null)
                              }
                              {
                                productGroupErrorMsg != "" ?
                                  (<option value="">{productGroupErrorMsg}</option>) :
                                  (null)
                              }
                              <option value="">Select group</option>
                              {
                                productGroupErrorMsg == "" ?
                                  (productGroups.map((group: IProGroup, index) => (
                                    <option key={index} value={group.id}>{group.group_name}</option>
                                  ))) :
                                  (null)
                              }
                            </select>

                          </InputGroup>
                        </FormGroup>
                        {touched.group_id && errors.group_id && (
                          <MsgText
                            text={errors.group_id}
                            textColor="danger"
                          />
                        )}
                      </Col>
                    )
                      : (null)
                  }
                  <Col xl="4">
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-scale-balanced" />
                        </InputGroupText>

                        <select
                          className="custom-select"
                          value={values.unit_id}
                          onChange={handleChange("unit_id")}
                          onBlur={handleBlur('unit_id')}
                        >
                          {
                            isUnitLoading ?
                              (<option value="">Loading available units...</option>) :
                              (null)
                          }
                          {
                            unitErrorMsg != "" ?
                              (<option value="">{unitErrorMsg}</option>) :
                              (null)
                          }
                          <option value="">Select Unit</option>
                          {
                            unitErrorMsg == "" ?
                              (units.map((unit: IUnit, index) => (
                                <option key={index} value={unit.id}>
                                  {unit.unit_name}
                                  {unit?.packages[0] && ` (${unit?.packages[0]?.package_name})`}
                                </option>
                              ))) :
                              (null)
                          }
                        </select>

                      </InputGroup>
                    </FormGroup>
                    {touched.unit_id && errors.unit_id && (
                      <MsgText
                        text={errors.unit_id}
                        textColor="danger"
                      />
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Product name"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.product_name}
                          onChange={handleChange('product_name')}
                          onBlur={handleBlur('product_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.product_name && errors.product_name && (
                      <>
                        <MsgText
                          text={errors.product_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xl={12}>
                    <FormGroup>
                      <textarea
                        className="form-control"
                        placeholder="Product more details"
                        value={values.default_description}
                        onChange={handleChange('default_description')}
                        onBlur={handleBlur('default_description')}
                      ></textarea>
                    </FormGroup>
                    {touched.default_description && errors.default_description && (
                      <MsgText
                        text={errors.default_description}
                        textColor="danger"
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xl={12} className='upload_image'>
                    <Label>Product Images</Label>
                    <section>

                      <div className="images">
                        {
                          selectedImages &&
                          selectedImages.map((image, index) => {
                            return (
                              <div key={index} className="image">
                                <img src={image} height="150" alt="upload" />
                                <button type="button" onClick={() => deleteHandler(image, 'add')}>
                                  <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                </button>
                                <p>{index + 1}</p>
                              </div>
                            );
                          })
                        }
                        <label className='image'>
                          + Add Images
                          <br />
                          <span>up to 5 images ({productImages.length})</span>
                          <Input
                            name="images"
                            placeholder="images"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            multiple
                            autoComplete="new-product-image"
                            onChange={(event: any) => {
                              onSelectFile(event, 'add');
                            }}
                          />
                        </label>
                      </div>

                      {
                        selectedImages.length <= 0 ? (
                          <p className="error">
                            <span>
                              You can&#39;t add product without image!
                            </span><br />
                            please add at least one product image.
                          </p>
                        )
                          : selectedImages.length > 5 ? (
                            <p className="error">
                              You can&#39;t upload more than 5 images! <br />
                              <span>
                                please delete <b> {selectedImages.length - 5} </b> of them{" "}
                              </span>
                            </p>
                          )
                            : (null)
                      }
                    </section>
                  </Col>
                </Row>
                <Row>
                  <Col xl="6">
                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                      {
                        savingProduct ?
                          ("Saving...") :
                          ("Save Product")
                      }
                    </Button>
                  </Col>
                  <Col xl="6">
                    <Button type="button" className="my-4 w-100 bg-red text-white" color="secondary" onClick={toggleAddModal}>Cancel</Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Edit new product */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit {viewedProduct?.product_name} </ModalHeader>
        <ModalBody>
          {
            viewedProduct ? (
              <Formik
                enableReinitialize
                initialValues={viewedProduct}
                onSubmit={editExistingProduct}
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
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-table" />
                            </InputGroupText>

                            <select
                              className="custom-select"
                              value={values.sub_category_id}
                              onChange={handleChange("sub_category_id")}
                              onBlur={handleBlur('sub_category_id')}
                            >
                              {
                                isProductSubCategoryLoading ?
                                  (<option value="">Loading available categories...</option>) :
                                  (null)
                              }
                              {
                                productSubCategoryErrorMsg != "" ?
                                  (<option value="">{productSubCategoryErrorMsg}</option>) :
                                  (null)
                              }
                              <option value="">Select Category</option>
                              {
                                productSubCategoryErrorMsg == "" ?
                                  (productSubCategories.map((sub_category: IProductSubCategory, index) => (
                                    <option key={index} value={sub_category.id}>{sub_category.sub_category_name}</option>
                                  ))) :
                                  (null)
                              }
                            </select>

                          </InputGroup>
                        </FormGroup>
                        {touched.sub_category_id && errors.sub_category_id && (
                          <MsgText
                            text={errors.sub_category_id}
                            textColor="danger"
                          />
                        )}
                      </Col>
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>

                            <select
                              className="custom-select"
                              value={values.group_id}
                              onChange={handleChange("group_id")}
                              onBlur={handleBlur('group_id')}
                            >
                              {
                                isProductSubCategoryLoading ?
                                  (<option value="">Loading available groups...</option>) :
                                  (null)
                              }
                              {
                                productGroupErrorMsg != "" ?
                                  (<option value="">{productGroupErrorMsg}</option>) :
                                  (null)
                              }
                              <option value="">Select group</option>
                              {
                                productGroupErrorMsg == "" ?
                                  (productGroups.map((group: IProGroup, index) => (
                                    <option key={index} value={group.id}>{group.group_name}</option>
                                  ))) :
                                  (null)
                              }
                            </select>

                          </InputGroup>
                        </FormGroup>
                        {touched.group_id && errors.group_id && (
                          <MsgText
                            text={errors.group_id}
                            textColor="danger"
                          />
                        )}
                      </Col>
                      <Col xl="4">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-scale-balanced" />
                            </InputGroupText>

                            <select
                              className="custom-select"
                              value={values.unit_id}
                              onChange={handleChange("unit_id")}
                              onBlur={handleBlur('unit_id')}
                            >
                              {
                                isUnitLoading ?
                                  (<option value="">Loading available units...</option>) :
                                  (null)
                              }
                              {
                                unitErrorMsg != "" ?
                                  (<option value="">{unitErrorMsg}</option>) :
                                  (null)
                              }
                              <option value="">Select Unit</option>
                              {
                                unitErrorMsg == "" ?
                                  (units.map((unit: IUnit, index) => (
                                    <option key={index} value={unit.id}>
                                      {unit.unit_name}
                                      {unit?.packages[0] && ` (${unit?.packages[0]?.package_name})`}
                                    </option>
                                  ))) :
                                  (null)
                              }
                            </select>

                          </InputGroup>
                        </FormGroup>
                        {touched.unit_id && errors.unit_id && (
                          <MsgText
                            text={errors.unit_id}
                            textColor="danger"
                          />
                        )}
                      </Col>
                      <Col xl="4">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-collection" />
                            </InputGroupText>
                            <Input
                              placeholder="Product name"
                              type="text"
                              autoComplete="new-product-name"
                              value={values.product_name}
                              onChange={handleChange('product_name')}
                              onBlur={handleBlur('product_name')}
                            />

                          </InputGroup>
                        </FormGroup>
                        {touched.product_name && errors.product_name && (
                          <>
                            <MsgText
                              text={errors.product_name}
                              textColor="danger"
                            />
                            <br />
                          </>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={12}>
                        <FormGroup>
                          <textarea
                            className="form-control"
                            placeholder="Describe the location"
                            value={values.default_description}
                            onChange={handleChange('default_description')}
                            onBlur={handleBlur('default_description')}
                          ></textarea>
                        </FormGroup>
                        {touched.default_description && errors.default_description && (
                          <MsgText
                            text={errors.default_description}
                            textColor="danger"
                          />
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={12} className='upload_image'>
                        <Label>Product Images</Label>
                        <section>

                          <div className="images">
                            {
                              selectedExistingImages &&
                              selectedExistingImages.map((image, index) => {
                                return (
                                  <div key={index} className="image">
                                    <img src={image} height="150" alt="upload" />
                                    <button type='button' onClick={() => deleteHandler(image, 'edit')}>
                                      <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                    </button>
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              })
                            }
                            <label className='image'>
                              + Add Images
                              <br />
                              <span>up to 5 images</span>
                              <Input
                                name="images"
                                placeholder="images"
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                multiple
                                autoComplete="new-product-image"
                                onChange={(event: any) => {
                                  onSelectFile(event, 'update');
                                }}
                              />
                            </label>
                          </div>

                          {
                            selectedExistingImages.length <= 0 ? (
                              <p className="error">
                                <span>
                                  You can&#39;t add product without image!
                                </span><br />
                                please add at least one product image.
                              </p>
                            )
                              : selectedExistingImages.length > 5 ? (
                                <p className="error">
                                  You can&#39;t upload more than 5 images! <br />
                                  <span>
                                    please delete <b> {selectedExistingImages.length - 5} </b> of them{" "}
                                  </span>
                                </p>
                              )
                                : (null)
                          }
                        </section>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl="6">
                        <Button className="my-4 w-100 bg-success text-white" type="submit">
                          {
                            updatingProduct ?
                              ("Updating...") :
                              ("Update Product")
                          }
                        </Button>
                      </Col>
                      <Col xl="6">
                        <Button type="button" className="my-4 w-100 bg-red text-white" color="secondary" onClick={() => toggleEditModal()}>Cancel</Button>
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
};

export default AdminProducts;