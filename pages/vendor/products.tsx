import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import * as Yup from 'yup';
import axios from '../../helpers/axios';
// layout for this page
import PageHeader from '../../components/Headers/PageHeader';
// core components
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { MsgText } from '../../components/Common/MsgText';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import { IBusinessProduct, IImage, IPackage, IProduct, IShop } from '../../interfaces';
import Vendor from '../../layouts/Vendor';
import { GetBusinessProducts, UpdateStatus } from '../api/business-products';

const BusinessProducts = () => {

  let initialValues: IBusinessProduct = {
    business_id: 0,
    product_id: 0,
    product_price: 0,
    default_unit_package: 0,
    product_description: "",
    opening_stock: 0,
    minimum_order_quantity: 1,
    minimum_order_indicator: 0,
    images: [''],
    tags: ''
  };

  const [activeShop, setActiveShop] = useState<IShop | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedBusinessProduct, setViewedBusinessProduct] = useState<IBusinessProduct>();

  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  // Images states
  const [selectedImages, setSelectedImages] = useState<string[]>();
  const [productImages, setProductImages] = useState<string[]>();
  const [selectedExistingImages, setSelectedExistingImages] = useState<string[]>();
  const [productExistingImages, setProductExistingImages] = useState<string[]>();

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);


  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
        let get_payload: any = {
          category_id: JSON.parse(active_shop).user_sector.sector_id
        };
        get_products(get_payload);
      }
    }
  }, []);

  // Image handlers
  const onSelectFile = (event: any, action: string) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray: any = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file: any) => {
      return URL.createObjectURL(file);
    });

    if (action == 'add') {
      setSelectedImages((previousImages) => previousImages?.concat(imagesArray));
    }
    else {
      setSelectedExistingImages((previousImages) => previousImages?.concat(imagesArray));
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
            setProductImages((previousImages) => previousImages?.concat(res.data.message));
          }
          else {
            setProductExistingImages((previousImages) => previousImages?.concat(res.data.message));
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
      let index = selectedImages?.indexOf(image);
      setSelectedImages(selectedImages?.filter((e) => e !== image));
      setProductImages(productImages?.filter((e, i) => i !== index));
      URL.revokeObjectURL(image);
    }
    else {
      let index = selectedExistingImages?.indexOf(image);
      setSelectedExistingImages(selectedExistingImages?.filter((e) => e !== image));
      setProductExistingImages(productExistingImages?.filter((e, i) => i !== index));
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



  const handleAdd = async (payload: IBusinessProduct) => {
    // console.log('testing')
    if (!savingProduct) {
      return
    }

    setErrorMsg("");

    if (activeShop?.id) {
      payload.business_id = activeShop?.id;
    }
    else {
      setErrorMsg("Can't find business");
      setSavingProduct(false);
      return;
    }

    payload.images = productImages;

    setSavingProduct(true);
    setErrorMsg("");
    return await axios.post('/business_products', payload)
      .then((res) => {
        setSavingProduct(false);
        if (res.data.status) {
          setSuccessMsg("Saved successfully");
          refetch();
        }
        else {
          setErrorMsg(res.data.message);
        }
        return res;
      })
      .catch((error) => {
        setSavingProduct(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
        return error;
      })
  }

  const createMutation = useMutation(handleAdd);
  const statusMutation = useMutation(UpdateStatus);

  const createProduct = async (payload: IBusinessProduct) => {
    setSavingProduct(true);
    setErrorMsg("");
    const newProduct = await createMutation.mutateAsync(payload);
    refetch();
    setSavingProduct(false);

    // Handle result from API
    // console.log(newProduct);
  }

  const get_products = (get_payload: any) => {
    // Get products
    if (isProductLoading) {
      return
    }
    setErrorMsg("");
    setIsProductLoading(true);
    axios.get('/products', { params: get_payload })
      .then((res) => {
        setIsProductLoading(false);
        setErrorMsg("");
        setProducts(res.data);
      })
      .catch((error) => {
        setIsProductLoading(false);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  const editStatus = async (payload: IBusinessProduct, product_status: string) => {
    // if (updatingSale) {
    //   // return
    // }
    let userId = localStorage.getItem("user");
    if (userId !== null) {
      userId = JSON.parse(userId).id;
    }
    if (Number(userId) != payload.disabled_by && payload.disabled_by != null) {
      setErrorMsg("You cannot change status of the product. The admin was the last person to change it")
      return
    }
    payload.product_published = product_status
    const product_images = payload.business_images!.map((image: IImage) => {
      return image.image_path;
    });
    payload.images = product_images
    // setUpdatingSale(true);
    setErrorMsg("");
    await statusMutation.mutateAsync(payload);
    refetch();
    // setUpdatingSale(false);
    // console.log(update_status)
    // Handle result from API  
    // setSavingSale(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }
  // Fetch All business products
  let get_payload = {};
  let isShopLoading = true;
  if (activeShop && activeShop.id != undefined) {
    console.log("passed")
    isShopLoading = false;
    get_payload = {
      business_id: activeShop.id,
      paginate: true,
      page: page,
      dataSize: dataSize

    };
  }
  else {
    console.log('Pending...')
  }
  const shouldEnableQuery = 'business_id' in get_payload;

console.log(get_payload);

const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
  ["products"],
  () => GetBusinessProducts(get_payload),
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

  const FormValidationSchema = Yup.object().shape({
    product_id: Yup.string().trim().required().label('Product'),
    product_price: Yup.string().trim().required().min(1).label('Product Price'),
    default_unit_package: Yup.string().trim().required().label('Product default price'),
    // product_description: Yup.string().trim().label('Product description'),
    opening_stock: Yup.string().trim().required().label('Opening stock'),
    // minimum_order_quantity: Yup.string().trim().required().min(1).label('Minimum Order'),
    // minimum_order_indicator: Yup.string().trim().required().label('Minimum Indicator'),
    // images: Yup.array().min(1),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (business_product: IBusinessProduct | undefined = undefined) => {
    if (business_product != undefined) {
      setViewedBusinessProduct(business_product);
    }
    setEditModal(!editModal);
  }

  const setProductSelected = (product_id: number) => {
    let index = products.findIndex((x: IProduct) => x.id == product_id);
    if (index >= 0) {
      let product: IProduct = products[index];
      setSelectedProduct(product);
      let images: string[] = [];
      product && product.images?.forEach((image: IImage) => {
        images.push(image.image_path);
      });
      setSelectedImages(images);
      setProductImages(images);
    }
  }

  return (
    <>
      <PageHeader page="Products" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products List</h3>
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
                    <th>ID</th>
                    <th className="no-wrap">Product Image</th>
                    <th className="no-wrap">Product Name</th>
                    <th className="no-wrap">Product Category</th>
                    <th>Stock</th>
                    <th className="no-wrap">Product Price</th>
                    <th className="no-wrap">Active Discount</th>
                    <th className="no-wrap">Product description</th>
                    <th className="no-wrap">Minimum Orders</th>
                    <th className="no-wrap">Minimum Indicator</th>
                    <th className="no-wrap">Published</th>
                    <th className="no-wrap">Posted Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isShopLoading ? (
                      <td colSpan={12}>Loading shop...</td>
                    )
                      : isFetching || isLoading ? (
                        <td colSpan={12}>Loading available products...</td>
                      )
                        : !isShopLoading && isError ? (

                          <td colSpan={12}>Error: {error.message} </td>
                        )
                          : !isShopLoading && isSuccess && data[0].length > 0 ? (
                            data[0].map((product: IBusinessProduct, index: number) => (
                              <tr key={index}>
                                <td>{(index + 1)}</td>
                                <td>
                                  <img src={(product.business_images && product.business_images.length > 0 && product.business_images[0].image_path) || (product.product?.images && product.product?.images.length > 0 && product.product?.images[0].image_path) || ''} alt={product.product?.product_name} width={50} />
                                </td>
                                <td className="no-wrap">{product.product?.product_name}</td>
                                <td className="no-wrap">{product.product?.sub_category?.sub_category_name}</td>
                                <td className="no-wrap">{product.product_stock?.stock_quantity} {product.default_package?.package_name}</td>
                                <td>{product.product_price} RWF</td>
                                <td>-</td>
                                <td className="no-wrap">{product.product_description}</td>
                                <td className="no-wrap">{product.minimum_order_quantity} {product.default_package?.package_name}</td>
                                <td className="no-wrap">{product.minimum_order_indicator} {product.default_package?.package_name}</td>
                                <td>{product.product_published}</td>
                                <td>{product.created_at}</td>
                                <td>
                                  <div className=" btn-actions">
                                    <a href={void (0)}><i className="fas fa-pencil text-primary mr-1 ml-1"></i></a>
                                    <a href={void (0)} style={{ paddingRight: "10px" }}><i className="fas fa-trash text-danger mr-1 ml-1"></i></a>

                                    {product.product_published == "No" && <button onClick={() => editStatus(product, 'Yes')} className='btn btn-sm btn-success'>Enable</button>}
                                    {product.product_published == "Yes" && <button onClick={() => editStatus(product, 'No')} className='btn btn-sm btn-danger'>Disable</button>}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )
                            : (
                              <td colSpan={12}>No product found</td>
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
        <ModalHeader toggle={toggleAddModal}>Add New product</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={createProduct}
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
                          className="custom-select"
                          value={values.product_id}
                          onChange={(event: any) => {
                            setFieldValue("product_id", event.currentTarget.value);
                            setProductSelected(event.currentTarget.value);
                          }}
                        >
                          {
                            isProductLoading ? (
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
                    {touched.product_id && errors.product_id && (
                      <MsgText
                        text={errors.product_id}
                        textColor="danger"
                      />
                    )}
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
                          className="custom-select"
                          value={values.default_unit_package}
                          onChange={handleChange('default_unit_package')}
                          onBlur={handleBlur('default_unit_package')}
                        >
                          {
                            isProductLoading ? (
                              <option>Loading available packages...</option>
                            )
                              : errorMsg != '' ? (
                                <option>Error: {errorMsg}</option>
                              )
                                : selectedProduct && Object.keys(selectedProduct).length !== 0 ? (
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
                    {touched.default_unit_package && errors.default_unit_package && (
                      <MsgText
                        text={errors.default_unit_package}
                        textColor="danger"
                      />
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Product Price</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Product Price"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.product_price}
                          onChange={handleChange('product_price')}
                          onBlur={handleBlur('product_price')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.product_price && errors.product_price && (
                      <>
                        <MsgText
                          text={errors.product_price}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Opening stock</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Opening Stock"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.opening_stock}
                          onChange={handleChange('opening_stock')}
                          onBlur={handleBlur('opening_stock')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.opening_stock && errors.opening_stock && (
                      <>
                        <MsgText
                          text={errors.opening_stock}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Minimum Order</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Minimum Order Qty"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.minimum_order_quantity}
                          onChange={handleChange('minimum_order_quantity')}
                          onBlur={handleBlur('minimum_order_quantity')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.minimum_order_quantity && errors.minimum_order_quantity && (
                      <>
                        <MsgText
                          text={errors.minimum_order_quantity}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Minimum order indictor</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Minimum order indicator"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.minimum_order_indicator}
                          onChange={handleChange('minimum_order_indicator')}
                          onBlur={handleBlur('minimum_order_indicator')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.minimum_order_indicator && errors.minimum_order_indicator && (
                      <>
                        <MsgText
                          text={errors.minimum_order_indicator}
                          textColor="danger"
                        />
                        <br />
                      </>
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
                              <div key={image} className="image">
                                <img src={image} height="150" alt="upload" />
                                <button onClick={() => deleteHandler(image, 'add')}>
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
                              onSelectFile(event, 'add');
                            }}
                          />
                        </label>
                      </div>

                      {
                        selectedImages && selectedImages.length <= 0 ? (
                          <p className="error">
                            <span>
                              You can&#39;t add product without image!
                            </span><br />
                            please add at least one product image.
                          </p>
                        )
                          : selectedImages && selectedImages.length > 5 ? (
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

                <FormGroup>
                  <Label>Product Details</Label>
                  <Input
                    placeholder="Product Details"
                    type="textarea"
                    autoComplete="new-product0-details"
                    value={values.product_description}
                    onChange={handleChange('product_description')}
                    onBlur={handleBlur('product_description')}
                  />
                </FormGroup>
                {touched.product_description && errors.product_description && (
                  <MsgText
                    text={errors.product_description}
                    textColor="danger"
                  />
                )}

                <div className="text-center">
                </div>
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
                    <Button className="my-4 w-100 bg-red text-white" color="secondary" onClick={toggleAddModal}>Cancel</Button>
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
        <ModalHeader toggle={() => toggleEditModal()}>Edit New product</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={createProduct}
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
                          className="custom-select"
                          value={values.product_id}
                          onChange={(event: any) => {
                            setFieldValue("product_id", event.currentTarget.value);
                            setProductSelected(event.currentTarget.value);
                          }}
                        >
                          {
                            isProductLoading ? (
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
                    {touched.product_id && errors.product_id && (
                      <MsgText
                        text={errors.product_id}
                        textColor="danger"
                      />
                    )}
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
                          className="custom-select"
                          value={values.default_unit_package}
                          onChange={handleChange('default_unit_package')}
                          onBlur={handleBlur('default_unit_package')}
                        >
                          {
                            isProductLoading ? (
                              <option>Loading available packages...</option>
                            )
                              : errorMsg != '' ? (
                                <option>Error: {errorMsg}</option>
                              )
                                : selectedProduct && Object.keys(selectedProduct).length !== 0 ? (
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
                    {touched.default_unit_package && errors.default_unit_package && (
                      <MsgText
                        text={errors.default_unit_package}
                        textColor="danger"
                      />
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Product Price</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Product Price"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.product_price}
                          onChange={handleChange('product_price')}
                          onBlur={handleBlur('product_price')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.product_price && errors.product_price && (
                      <>
                        <MsgText
                          text={errors.product_price}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Opening stock</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Opening Stock"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.opening_stock}
                          onChange={handleChange('opening_stock')}
                          onBlur={handleBlur('opening_stock')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.opening_stock && errors.opening_stock && (
                      <>
                        <MsgText
                          text={errors.opening_stock}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Minimum Order</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Minimum Order Qty"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.minimum_order_quantity}
                          onChange={handleChange('minimum_order_quantity')}
                          onBlur={handleBlur('minimum_order_quantity')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.minimum_order_quantity && errors.minimum_order_quantity && (
                      <>
                        <MsgText
                          text={errors.minimum_order_quantity}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col xl="4">
                    <FormGroup>
                      <Label>Minimum order indictor</Label>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Minimum order indicator"
                          type="text"
                          autoComplete="new-product-name"
                          value={values.minimum_order_indicator}
                          onChange={handleChange('minimum_order_indicator')}
                          onBlur={handleBlur('minimum_order_indicator')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.minimum_order_indicator && errors.minimum_order_indicator && (
                      <>
                        <MsgText
                          text={errors.minimum_order_indicator}
                          textColor="danger"
                        />
                        <br />
                      </>
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
                              <div key={image} className="image">
                                <img src={image} height="150" alt="upload" />
                                <button onClick={() => deleteHandler(image, 'add')}>
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
                              onSelectFile(event, 'add');
                            }}
                          />
                        </label>
                      </div>

                      {
                        selectedImages && selectedImages.length <= 0 ? (
                          <p className="error">
                            <span>
                              You can&#39;t add product without image!
                            </span><br />
                            please add at least one product image.
                          </p>
                        )
                          : selectedImages && selectedImages.length > 5 ? (
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

                <FormGroup>
                  <Label>Product Details</Label>
                  <Input
                    placeholder="Product Details"
                    type="textarea"
                    autoComplete="new-product0-details"
                    value={values.product_description}
                    onChange={handleChange('product_description')}
                    onBlur={handleBlur('product_description')}
                  />
                </FormGroup>
                {touched.product_description && errors.product_description && (
                  <MsgText
                    text={errors.product_description}
                    textColor="danger"
                  />
                )}

                <div className="text-center">
                </div>
                <Row>
                  <Col xl="6">
                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                      {
                        savingProduct ?
                          ("Updating...") :
                          ("Update Product")
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
    </>
  );
}

BusinessProducts.layout = Vendor;

export default BusinessProducts;
