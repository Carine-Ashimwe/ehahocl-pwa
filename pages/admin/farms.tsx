
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
import { IFarm } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddFarm, GetFarms, UpdateFarm } from '../api/farms';
// layout for this page

// core components


const Farms = () => {

  let initialValues: IFarm = {
    farm_name: '',
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedFarm, setViewedFarm] = useState<IFarm>();

  const [updatingFarm, setUpdatingFarm] = useState(false);
  const [savingFarm, setSavingFarm] = useState(false);

  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["Farms"],
    GetFarms
  );

  const createMutation = useMutation(AddFarm);
  const updateMutation = useMutation(UpdateFarm);

  const addFarm = async (payload: IFarm) => {
    if (savingFarm) {
      return
    }
    setSavingFarm(true);
    setAddErrorMsg("");
    const newFarm = await createMutation.mutateAsync(payload);
    refetch();
    setSavingFarm(false);

    if (newFarm) {
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

  const editFarm = async (payload: IFarm) => {
    console.log(payload);
    if (updatingFarm) {
      return
    }
    setUpdatingFarm(true);
    setEditErrorMsg("");
    const updateFarm = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingFarm(false);
    if (updateFarm) {
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

  const FormValidationSchema = Yup.object().shape({
    farm_name: Yup.string().trim().required().label('Farm name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (farm: IFarm | undefined = undefined) => {
    if (farm != undefined) {
      setViewedFarm(farm);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Farms" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Farms</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD FARM
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Farm Name</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (<td colSpan={3}>Loading available farms...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data.length > 0 ? (
                          data.map((farm: IFarm, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{farm.farm_name}</td>
                              <td scope="row">{farm.created_at}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(farm)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No Farm Available</td>)
                  }
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>


      {/* Add new farm */}
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={toggleAddModal}>Add New Farm</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addFarm}
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
                      placeholder="Farm name"
                      type="text"
                      autoComplete="new-farm-name"
                      value={values.farm_name}
                      onChange={handleChange('farm_name')}
                      onBlur={handleBlur('farm_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.farm_name && errors.farm_name && (
                  <>
                    <MsgText
                      text={errors.farm_name}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {
                      savingFarm ?
                        ("Loading...") :
                        ("Save  Farm")
                    }
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Edit existing farm */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit Farm {viewedFarm?.farm_name}</ModalHeader>
        <ModalBody>
          {
            viewedFarm ? (
              <Formik
                enableReinitialize
                initialValues={viewedFarm}
                onSubmit={editFarm}
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
                          placeholder="Farm name"
                          type="text"
                          autoComplete="new-farm-name"
                          value={values.farm_name}
                          onChange={handleChange('farm_name')}
                          onBlur={handleBlur('farm_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.farm_name && errors.farm_name && (
                      <>
                        <MsgText
                          text={errors.farm_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingFarm ?
                            ("Loading...") :
                            ("Update Farm")
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

Farms.layout = Admin;

export default Farms;