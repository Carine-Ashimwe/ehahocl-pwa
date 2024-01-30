/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

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
import axios from '../../helpers/axios';
import { ILocation, IMarket } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddMarket, GetMarkets, UpdateMarket } from '../api/markets';
// layout for this page

// core components


const Markets = () => {

  let initialValues: IMarket = {
    market_name: '',
    country: 'Rwanda',
    province: undefined,
    district: undefined,
    sector: undefined,
    cell: undefined,
    village: undefined,
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedMarket, setviewedMarket] = useState<IMarket>();

  const [updatingmarket, setUpdatingmarket] = useState(false);
  const [savingmarket, setSavingmarket] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [provincesErrorMsg, setProvincesErrorMsg] = useState("");
  const [isProvincesLoading, setIsProvincesLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [districtsErrorMsg, setDistrictsErrorMsg] = useState("");
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);

  const [sectors, setSectors] = useState([]);
  const [sectorsErrorMsg, setSectorsErrorMsg] = useState("");
  const [isSectorsLoading, setIsSectorsLoading] = useState(false);

  const [cells, setCells] = useState([]);
  const [cellsErrorMsg, setCellsErrorMsg] = useState("");
  const [isCellsLoading, setIsCellsLoading] = useState(false);

  const [villages, setVillages] = useState([]);
  const [villagesErrorMsg, setVillagesErrorMsg] = useState("");
  const [isVillagesLoading, setIsVillagesLoading] = useState(false);

  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["markets"],
    GetMarkets
  );

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

  const createMutation = useMutation(AddMarket);
  const updateMutation = useMutation(UpdateMarket);

  const addmarket = async (payload: IMarket) => {
    if (savingmarket) {
      return
    }
    setSavingmarket(true);
    setAddErrorMsg("");
    const newmarket = await createMutation.mutateAsync(payload);
    refetch();
    setSavingmarket(false);

    if (newmarket) {
      setSuccessMsg("saved successfully");
    }
    else {
      setErrorMsg("Error occured");
    }
    // Handle result from API
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editMarket = async (payload: IMarket) => {
    console.log(payload);
    if (updatingmarket) {
      return
    }
    setUpdatingmarket(true);
    setEditErrorMsg("");
    const updatemarket = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingmarket(false);
    if (updatemarket) {
      setSuccessMsg("Updated successfully");
    }
    else {
      setErrorMsg("Error occured");
    }
    // Handle result from API
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const FormValidationSchema = Yup.object().shape({
    market_name: Yup.string().trim().required().label('Market name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (market: IMarket | undefined = undefined) => {
    if (market != undefined) {
      setviewedMarket(market);
    }
    setEditModal(!editModal);
  }

  const countrychange = (values: IMarket, country: string) => {
    if (country == 'Rwanda') {
      values.province as undefined;
      values.district as undefined;
      values.sector as undefined;
      values.cell as undefined;
      values.village as undefined;
    }
  }

  const get_location = (level: string, parent_id: any, setLoad: any, setError: any, setLocations: any) => {
    setLoad(true);
    setError("");
    const payload = { 'model': level, 'parent_id': parent_id };
    axios.post('/locations', payload)
      .then((res) => {
        setLoad(false);
        if (res.data.status) {
          setLocations(res.data.message);
          setError("");
        }
        else {
          setError(res.data.message);
        }
      })
      .catch((error) => {
        setLoad(false);
        const errorMessage = error.response?.data?.message;
        setError(errorMessage || error.message);
      })
  }

  useEffect(() => {
    get_location('Province', null, setIsProvincesLoading, setProvincesErrorMsg, setProvinces);
  }, [])

  return (
    <>
      <ToastContainer />
      <PageHeader page="Markets" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Markets</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD MARKET
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Market Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (<td colSpan={3}>Loading available markets...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data.length > 0 ? (
                          data.map((market: IMarket, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{market.market_name}</td>
                              <td scope="row">{market.created_at ? new Date(market.created_at).toLocaleString() : ''}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(market)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No market Available</td>)
                  }
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>


      {/* Add new market */}
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={toggleAddModal}>Add New Market</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addmarket}
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
                      placeholder="Market name"
                      type="text"
                      autoComplete="new-market-name"
                      value={values.market_name}
                      onChange={handleChange('market_name')}
                      onBlur={handleBlur('market_name')}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-compass-04" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.province}
                      onChange={(e) => {
                        handleChange("province")(e);
                        get_location('District', e.currentTarget.value, setIsDistrictsLoading, setDistrictsErrorMsg, setDistricts);
                      }}
                      onBlur={handleBlur('province')}
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province: ILocation, index) => (
                        <option key={index} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-map-big" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.district}
                      onChange={(e) => {
                        handleChange("district")(e);
                        get_location('Sector', e.currentTarget.value, setIsSectorsLoading, setSectorsErrorMsg, setSectors);
                      }}
                      onBlur={handleBlur('district')}
                    >
                      <option value="">Select District</option>
                      {districts.map((district: ILocation, index) => (
                        <option key={index} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-square-pin" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.sector}
                      onChange={(e) => {
                        handleChange("sector")(e);
                        get_location('Cell', e.currentTarget.value, setIsCellsLoading, setCellsErrorMsg, setCells);
                      }}
                      onBlur={handleBlur('sector')}
                    >
                      <option value="">Select Sector</option>
                      {sectors.map((sector: ILocation, index) => (
                        <option key={index} value={sector.id}>
                          {sector.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="fas fa-map" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.cell}
                      onChange={(e) => {
                        handleChange("cell")(e);
                        get_location('Village', e.currentTarget.value, setIsVillagesLoading, setVillagesErrorMsg, setVillages);
                      }}
                      onBlur={handleBlur('cell')}
                    >
                      <option value="">Select Cell</option>
                      {cells.map((cell: ILocation, index) => (
                        <option key={index} value={cell.id}>
                          {cell.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="ni ni-shop" />
                    </InputGroupText>
                    <select
                      className="custom-select"
                      value={values.village}
                      onChange={(e) => {
                        handleChange("village")(e);
                      }}
                      onBlur={handleBlur('village')}
                    >
                      <option value="">Select Village</option>
                      {villages.map((village: ILocation, index) => (
                        <option key={index} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </FormGroup>

                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {savingmarket ? "Loading..." : "Save market"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Edit existing Market */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit market {viewedMarket?.market_name}</ModalHeader>
        <ModalBody>
          {
            viewedMarket ? (
              <Formik
                enableReinitialize
                initialValues={viewedMarket}
                onSubmit={editMarket}
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
                          placeholder="market name"
                          type="text"
                          autoComplete="new-market-name"
                          value={values.market_name}
                          onChange={handleChange('market_name')}
                          onBlur={handleBlur('market_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.market_name && errors.market_name && (
                      <>
                        <MsgText
                          text={errors.market_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-compass-04" />
                        </InputGroupText>
                        <select
                          className="custom-select"
                          value={values.province}
                          onChange={(e) => {
                            handleChange("province")(e);
                            get_location('District', e.currentTarget.value, setIsDistrictsLoading, setDistrictsErrorMsg, setDistricts);
                          }}
                          onBlur={handleBlur('province')}
                        >
                          <option value="">Select Province</option>
                          {provinces.map((province: ILocation, index) => (
                            <option key={index} value={province.id}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-map-big" />
                        </InputGroupText>
                        <select
                          className="custom-select"
                          value={values.district}
                          onChange={(e) => {
                            handleChange("district")(e);
                            get_location('Sector', e.currentTarget.value, setIsSectorsLoading, setSectorsErrorMsg, setSectors);
                          }}
                          onBlur={handleBlur('district')}
                        >
                          <option value="">Select District</option>
                          {districts.map((district: ILocation, index) => (
                            <option key={index} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-square-pin" />
                        </InputGroupText>
                        <select
                          className="custom-select"
                          value={values.sector}
                          onChange={(e) => {
                            handleChange("sector")(e);
                            get_location('Cell', e.currentTarget.value, setIsCellsLoading, setCellsErrorMsg, setCells);
                          }}
                          onBlur={handleBlur('sector')}
                        >
                          <option value="">Select Sector</option>
                          {sectors.map((sector: ILocation, index) => (
                            <option key={index} value={sector.id}>
                              {sector.name}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="fas fa-map" />
                        </InputGroupText>
                        <select
                          className="custom-select"
                          value={values.cell}
                          onChange={(e) => {
                            handleChange("cell")(e);
                            get_location('Village', e.currentTarget.value, setIsVillagesLoading, setVillagesErrorMsg, setVillages);
                          }}
                          onBlur={handleBlur('cell')}
                        >
                          <option value="">Select Cell</option>
                          {cells.map((cell: ILocation, index) => (
                            <option key={index} value={cell.id}>
                              {cell.name}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-shop" />
                        </InputGroupText>
                        <select
                          className="custom-select"
                          value={values.village}
                          onChange={(e) => {
                            handleChange("village")(e);
                          }}
                          onBlur={handleBlur('village')}
                        >
                          <option value="">Select Village</option>
                          {villages.map((village: ILocation, index) => (
                            <option key={index} value={village.id}>
                              {village.name}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingmarket ?
                            ("Loading...") :
                            ("Update market")
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

Markets.layout = Admin;

export default Markets;