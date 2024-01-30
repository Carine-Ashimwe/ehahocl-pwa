/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import PageHeader from '../../components/Headers/PageHeader';
import { IBusinessProduct, IMarket, IMarketPrice, IProduct } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddMarketprice, DeleteMarketprice, GetMarketPrices, UpdateMarketPrice } from '../api/market-prices';
import { GetMarkets } from '../api/markets';
import { GetProducts } from '../api/products';

const MarketPrices = () => {
  let initialValues: IMarketPrice = {
    market_id: undefined,
    product_id: undefined,
    product_group_id: undefined,
    wholesale_price: 0,
    retail_price: 0,
    group: undefined
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [productGroups, setProductGroups] = useState([]);
  const [productGroupErrorMsg, setProductGroupErrorMsg] = useState("");
  const [isProductGroupLoading, setIsProductGroupLoading] = useState(false);

  const [products, setProducts] = useState([]);
  // const [isProductLoading, setIsProductLoading] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [editProduct, setEditProduct] = useState<IBusinessProduct>();

  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [savingProduct, setSavingProduct] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedMarketPrice, setViewedMarketPrice] = useState<IMarketPrice>();

  const [updatingMarketPrice, setUpdatingMarketPrice] = useState(false);
  const [savingMarketPrice, setSavingMarketPrice] = useState(false);
  const [deletingMarketPrice, setDeletingMarketPrice] = useState(false);

  const { isLoading, isError, error, isSuccess, data, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["MarketPrices"],
    GetMarketPrices
  );
  const { isLoading: isMarketLoading, isError: isMarketError, error: MarketError, isSuccess: isMarketSuccess, data: Markets }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["Markets"],
    GetMarkets
  );
  const { isLoading: isProductLoading, isError: isProductError, error: ProductError, isSuccess: isProductSuccess, data: Products }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["Products"],
    GetProducts
  );

  const createMutation = useMutation(AddMarketprice);
  const updateMutation = useMutation(UpdateMarketPrice);
  const deleteMutation = useMutation(DeleteMarketprice);

  const addMarketPrice = async (payload: IMarketPrice) => {
    if (savingMarketPrice) {
      return;
    }
    setSavingMarketPrice(true);
    setAddErrorMsg("");

    // console.log("Payload:", payload);
    // console.log("Form Values:", payload);

    try {
      const newMarketPrice = await createMutation.mutateAsync(payload);
      refetch();
      setSavingMarketPrice(false);

      if (newMarketPrice) {
        setSuccessMsg("Saved successfully");
      } else {
        setErrorMsg("Error occurred");
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorMsg("Error occurred");
    }
  }

  const editMarketPrice = async (payload: IMarketPrice) => {
    if (updatingMarketPrice) {
      return;
    }
    setUpdatingMarketPrice(true);
    setEditErrorMsg("");
    const updatedMarketPrice = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingMarketPrice(false);
    if (updatedMarketPrice) {
      setSuccessMsg("Updated successfully");
    } else {
      setErrorMsg("Error occurred");
    }
  }

  const handleDeleteMarketPrice = async (id: number | undefined) => {
    try {
      if (deletingMarketPrice || id === undefined) {
        return;
      }

      setDeletingMarketPrice(true);
      setDeleteErrorMsg("");

      const deletedMarketPrice = await deleteMutation.mutateAsync(id);

      if (deletedMarketPrice) {
        refetch();
        setSuccessMsg("Market Price deleted successfully");
      } else {
        setErrorMsg("Error occurred while deleting Market Price");
      }

      setDeletingMarketPrice(false);
    } catch (error) {
      console.error('Error deleting market price:', error);
      setErrorMsg("Error occurred while deleting Market Price");
      setDeletingMarketPrice(false);
    }
  };

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

  const MarketPriceValidationSchema = Yup.object().shape({
    market_id: Yup.number().required().label('Market Name'),
    product_id: Yup.number().required().label('Product ID'),
    wholesale_price: Yup.number().required().label('Wholesale Price'),
    retail_price: Yup.number().required().label('Retail Price'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (event: React.MouseEvent, marketPrice?: IMarketPrice | undefined) => {
    event.preventDefault();

    if (marketPrice !== undefined) {
      setViewedMarketPrice(marketPrice);
    }

    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Market Prices" />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Market Prices</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD MARKET PRICE
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Market Name</th>
                    <th scope="col">Product</th>
                    <th scope="col">Product Group</th>
                    <th scope="col">Wholesale Price</th>
                    <th scope="col">Retail Price</th>
                    <th scope="col">Date Recorded</th>
                    <th scope="col">Date Updated</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (<td colSpan={7}>Loading market prices...</td>)
                      : isError ? (<td colSpan={7}>{error.message}</td>)
                        : isSuccess && data.length > 0 ? (
                          data.map((marketPrice: IMarketPrice, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{marketPrice.market?.market_name}</td>
                              <td scope="row">{marketPrice.product?.product_name}</td>
                              <td scope="row">{marketPrice.group?.group_name}</td>
                              <td scope="row">{marketPrice.wholesale_price}</td>
                              <td scope="row">{marketPrice.retail_price}</td>
                              <td scope="row">{marketPrice.created_at ? new Date(marketPrice.created_at).toLocaleString() : ''}</td>
                              <td scope="row">{marketPrice.updated_at ? new Date(marketPrice.updated_at).toLocaleString() : ''}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={(e) => toggleEditModal(e, marketPrice)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                  {/* <a href={void (0)} onClick={() => handleDeleteMarketPrice(marketPrice.id)}>
                                    <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                  </a> */}
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={7}>No Market Prices Available</td>)
                  }
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add new market price */}
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={toggleAddModal}>Add Market Price</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addMarketPrice}
            validationSchema={MarketPriceValidationSchema}
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
                    <select
                      className="custom-select"
                      value={values.market_id}
                      onChange={handleChange('market_id')}
                      onBlur={handleBlur('market_id')}
                    >
                      <option value={undefined}>Select Market Name</option>
                      {
                        isMarketLoading ? (<option>Loading available markets...</option>)
                          : isMarketError ? (<option>{MarketError.message}</option>)
                            : isMarketSuccess && Markets.length > 0 ? (
                              Markets.map((market: IMarket, index: number) => (
                                <option key={index} value={market.id}>{market.market_name}</option>
                              ))
                            )
                              : (null)
                      }
                    </select>

                  </InputGroup>
                </FormGroup>
                {touched.market_id && errors.market_id && (
                  <>
                    <MsgText
                      text={errors.market_id}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.product_id}
                      onChange={handleChange('product_id')}
                      onBlur={handleBlur('product_id')}
                    >
                      <option value={undefined}>Select Product Name</option>
                      {
                        isProductLoading ? (<option>Loading available products...</option>)
                          : isProductError ? (<option>{ProductError.message}</option>)
                            : isProductSuccess && Products.length > 0 ? (
                              Products.map((product: IProduct, index: number) => (
                                <option key={index} value={product.id}>{product.product_name}</option>
                              ))
                            )
                              : (null)
                      }
                    </select>

                  </InputGroup>
                </FormGroup>
                {touched.product_id && errors.product_id && (
                  <>
                    <MsgText
                      text={errors.product_id}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Wholesale Price"
                      type="number"
                      autoComplete="new-wholesale-price"
                      value={values.wholesale_price}
                      onChange={handleChange('wholesale_price')}
                      onBlur={handleBlur('wholesale_price')}
                    />
                  </InputGroup>
                </FormGroup>
                {touched.wholesale_price && errors.wholesale_price && (
                  <>
                    <MsgText
                      text={errors.wholesale_price}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Retail Price"
                      type="number"
                      autoComplete="new-retail-price"
                      value={values.retail_price}
                      onChange={handleChange('retail_price')}
                      onBlur={handleBlur('retail_price')}
                    />
                  </InputGroup>
                </FormGroup>
                {touched.retail_price && errors.retail_price && (
                  <>
                    <MsgText
                      text={errors.retail_price}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {savingMarketPrice ? ("Loading...") : ("Save Market Price")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Add new market price */}
      <Modal
        isOpen={editModal}
        toggle={toggleEditModal}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={toggleAddModal}>Edit Market Price</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={viewedMarketPrice || initialValues}
            onSubmit={editMarketPrice}
            validationSchema={MarketPriceValidationSchema}
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
                    <select
                      className="custom-select"
                      value={values.market_id}
                      onChange={handleChange('market_id')}
                      onBlur={handleBlur('market_id')}
                    >
                      <option value={undefined}>Select Market Name</option>
                      {
                        isMarketLoading ? (<option>Loading available markets...</option>)
                          : isMarketError ? (<option>{MarketError.message}</option>)
                            : isMarketSuccess && Markets.length > 0 ? (
                              Markets.map((market: IMarket, index: number) => (
                                <option key={index} value={market.id}>{market.market_name}</option>
                              ))
                            )
                              : (null)
                      }
                    </select>

                  </InputGroup>
                </FormGroup>
                {touched.market_id && errors.market_id && (
                  <>
                    <MsgText
                      text={errors.market_id}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.product_id}
                      onChange={handleChange('product_id')}
                      onBlur={handleBlur('product_id')}
                    >
                      <option value={undefined}>Select Product Name</option>
                      {
                        isProductLoading ? (<option>Loading available products...</option>)
                          : isProductError ? (<option>{ProductError.message}</option>)
                            : isProductSuccess && Products.length > 0 ? (
                              Products.map((product: IProduct, index: number) => (
                                <option key={index} value={product.id}>{product.product_name}</option>
                              ))
                            )
                              : (null)
                      }
                    </select>

                  </InputGroup>
                </FormGroup>
                {touched.product_id && errors.product_id && (
                  <>
                    <MsgText
                      text={errors.product_id}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Wholesale Price"
                      type="number"
                      autoComplete="new-wholesale-price"
                      value={values.wholesale_price}
                      onChange={handleChange('wholesale_price')}
                      onBlur={handleBlur('wholesale_price')}
                    />
                  </InputGroup>
                </FormGroup>
                {touched.wholesale_price && errors.wholesale_price && (
                  <>
                    <MsgText
                      text={errors.wholesale_price}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-collection" />
                    </InputGroupText>
                    <Input
                      placeholder="Retail Price"
                      type="number"
                      autoComplete="new-retail-price"
                      value={values.retail_price}
                      onChange={handleChange('retail_price')}
                      onBlur={handleBlur('retail_price')}
                    />
                  </InputGroup>
                </FormGroup>
                {touched.retail_price && errors.retail_price && (
                  <>
                    <MsgText
                      text={errors.retail_price}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {updatingMarketPrice ? ("Loading...") : ("Edit Market Price")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

MarketPrices.layout = Admin;

export default MarketPrices;