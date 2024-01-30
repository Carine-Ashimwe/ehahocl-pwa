import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Farmer from '../../layouts/Farmer';
import { GetProducts } from '../api/products';
const BusinessProducts = () => {

  let initialValues: IBusinessProduct = {
    business_id: 0,
    product_id: 0,
    product_price: 0,
    default_unit_package: 0,
    product_description: "",
    opening_stock: 0,
    minimum_order_quantity: 1,
    images: [''],
    tags: ''
  };

  const [activeShop, setActiveShop] = useState<IShop | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addModal, setAddModal] = useState(false);
  // const [editModal, setEditModal] = useState(false);

  const [businessProducts, setBusinessProducts] = useState([]);
  const [isBusinessProductLoading, setIsBusinessProductLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(false);

  // const [updatingProduct, setUpdatingProduct] = useState({});
  // const [updating, setUpdating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [savingProduct, setSavingProduct] = useState(false);

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
      console.log(products);
      console.log(isBusinessProductLoading);
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
    if (savingProduct) {
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
          setTimeout(
            () => {
              refetch();
            },
            3000
          );
        }
        else {
          setErrorMsg(res.data.message);
        }
        return res;
      })
      .catch((error) => {
        setSavingProduct(false);
        console.error(error.response?.data?.message);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
        return error;
      })
  }

  const createMutation = useMutation(handleAdd);

  const createProduct = async (payload: IBusinessProduct) => {
    setSavingProduct(true);
    setErrorMsg("");
    const newProduct = await createMutation.mutateAsync(payload);
    refetch();
    setSavingProduct(false);

    // Handle result from API
    console.log(newProduct);
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

  // Fetch All business products
  let get_payload = {};
  let isShopLoading = true;
  if (activeShop && activeShop.id != undefined) {
    isShopLoading = false;
    get_payload = {
      category_id: 1,
      sub_category_id: null,
      paginate: true,
      page: page,
      dataSize: dataSize

    };
  }
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["products"],
    () => GetProducts(get_payload),
    { enabled: !!activeShop }
  );

  useEffect(() => {
    'business_id' in get_payload && refetch();
  }, [dataSize])
  // calculates number of pages for pagination
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data[1] / dataSize));
    }
  }, [data]);

  // changes page of pagination
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
    minimum_order_quantity: Yup.string().trim().required().min(1).label('Minimum Order'),
    // minimum_order_indicator: Yup.string().trim().required().label('Minimum Indicator'),
    // images: Yup.array().min(1),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
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
      <ToastContainer />
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
                    {/* <Button
                      className="bg-success text-white"
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD NEW PRODUCT
                    </Button> */}
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Image</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">SubCategory</th>
                    {isSuccess && data[0] && data[0].some((product: { group: any; }) => product.group) && <th scope="col">Group</th>}
                    <th scope="col">Unit</th>
                    <th scope="col">Description</th>
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
                          <td colSpan={12}>Error: {error.message}</td>
                        )
                          : !isShopLoading && isSuccess && data[0].length > 0 ? (
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
                                  data[0] && data[0].some((product: { group: any; }) => product.group) && <td scope="row"></td>
                                )}
                                <td scope="row">{product.unit?.unit_name}</td>
                                <td scope="row">{product.default_description}</td>
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
                  {/* <Col xl="4">
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
                  </Col> */}
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
                          ("Loading...") :
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
    </>
  )
}

BusinessProducts.layout = Farmer;

export default BusinessProducts;
