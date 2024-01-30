
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
import { IFarm, ISensor } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { GetFarms } from '../api/farms';
import { AddSensor, GetSensors, UpdateSensor } from '../api/sensors';
// layout for this page

// core components


const Sensors = () => {

    let initialValues: ISensor = {
        serial_number: '',
        farm_id: undefined,
        description: ''
    };

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [editErrorMsg, setEditErrorMsg] = useState('');
    const [addErrorMsg, setAddErrorMsg] = useState('');

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewedSensor, setViewedSensor] = useState<ISensor>();

    const [updatingSensor, setUpdatingSensor] = useState(false);
    const [savingSensor, setSavingSensor] = useState(false);

    const { isLoading, isError, error, isSuccess, data, isFetching, refetch } = useQuery<any, Error>(
    ["Sensors"],
    GetSensors
);

const { isLoading: isFarmLoading, isError: isFarmError, error: FarmError, isSuccess: isFarmSuccess, data: Farms }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["Farms"],
    GetFarms
);

const createMutation = useMutation(AddSensor);
const updateMutation = useMutation(UpdateSensor);

const addSensor = async (payload: ISensor) => {
    if (savingSensor) {
        return
    }
    if (payload.farm_id == 0) {
        payload.farm_id = undefined;
    }
    setSavingSensor(true);
    setAddErrorMsg("");
    const newSensor = await createMutation.mutateAsync(payload);
    refetch();
    setSavingSensor(false);

    if (newSensor) {
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

const editSensor = async (payload: ISensor) => {
    console.log(payload);
    if (updatingSensor) {
        return
    }
    if (payload.farm_id == 0) {
        payload.farm_id = undefined;
    }
    setUpdatingSensor(true);
    setEditErrorMsg("");
    const updateSensor = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingSensor(false);
    if (updateSensor) {
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
    serial_number: Yup.string().trim().required().label('Serial Number'),
    description: Yup.string().trim().required().label('Description'),
});

const toggleAddModal = () => {
    setAddModal(!addModal);
}

const toggleEditModal = (sensor: ISensor | undefined = undefined) => {
    if (sensor != undefined) {
        setViewedSensor(sensor);
    }
    setEditModal(!editModal);
}

return (
    <>
        <ToastContainer />
        <PageHeader page="Sensors" />
        {/* Page content */}
        <Container className="mt--7" fluid>

            <Row className="mt-5">
                <Col className="mb-5 mb-xl-0" xl="12">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h3 className="mb-0">Sensors</h3>
                                </div>
                                <div className="col text-right">
                                    <Button
                                        className='bg-success text-white'
                                        href="#pablo"
                                        onClick={toggleAddModal}
                                        size="sm"
                                    >
                                        ADD SENSOR
                                    </Button>
                                </div>
                            </Row>
                        </CardHeader>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Serial Number</th>
                                    <th scope="col">Assigned Farm</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Created Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ? (<td colSpan={3}>Loading available sensors...</td>)
                                        : isError ? (<td colSpan={3}>{error.message}</td>)
                                            : isSuccess && data.length > 0 ? (
                                                data.map((sensor: ISensor, index: number) => (
                                                    <tr key={index}>
                                                        <td scope="row">{(index + 1)}</td>
                                                        <td scope="row">{sensor.serial_number}</td>
                                                        <td scope="row">{(sensor.farm && (sensor.farm.farm_name)) || ("-")}</td>
                                                        <td scope="row">{sensor.description}</td>
                                                        <td scope="row">{sensor.created_at}</td>
                                                        <td scope="row">
                                                            <div className=" btn-actions">
                                                                <a
                                                                    href={void (0)}
                                                                    onClick={() => toggleEditModal(sensor)}
                                                                >
                                                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                                : (<td colSpan={3}>No Sensor Available</td>)
                                }
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>


        {/* Add new sensor */}
        <Modal
            isOpen={addModal}
            toggle={toggleAddModal}
            centered={true}
            size="sm"
        >
            <ModalHeader toggle={toggleAddModal}>Add New Sensor</ModalHeader>
            <ModalBody>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    onSubmit={addSensor}
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
                                        placeholder="Serial Number"
                                        type="text"
                                        autoComplete="new"
                                        value={values.serial_number}
                                        onChange={handleChange('serial_number')}
                                        onBlur={handleBlur('serial_number')}
                                    />

                                </InputGroup>
                            </FormGroup>
                            {touched.serial_number && errors.serial_number && (
                                <>
                                    <MsgText
                                        text={errors.serial_number}
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
                                        value={values.farm_id}
                                        onChange={handleChange('farm_id')}
                                        onBlur={handleBlur('farm_id')}
                                    >
                                        <option value="0">Select Farm</option>
                                        {
                                            isFarmLoading ? (<option>Loading available farms...</option>)
                                                : isFarmError ? (<option>{FarmError.message}</option>)
                                                    : isFarmSuccess && Farms.length > 0 ? (
                                                        Farms.map((farm: IFarm, index: number) => (
                                                            <option key={index} value={farm.id}>{farm.farm_name}</option>
                                                        ))
                                                    )
                                                        : (null)
                                        }
                                    </select>

                                </InputGroup>
                            </FormGroup>
                            {touched.farm_id && errors.farm_id && (
                                <>
                                    <MsgText
                                        text={errors.farm_id}
                                        textColor="danger"
                                    />
                                    <br />
                                </>
                            )}
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <Input
                                        placeholder="Enter description of sensor"
                                        type="textarea"
                                        autoComplete="new"
                                        value={values.description}
                                        onChange={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                    />

                                </InputGroup>
                            </FormGroup>
                            {touched.description && errors.description && (
                                <>
                                    <MsgText
                                        text={errors.description}
                                        textColor="danger"
                                    />
                                    <br />
                                </>
                            )}
                            <div className="text-center">
                                <Button className="my-4 w-100 bg-success text-white" type="submit">
                                    {
                                        savingSensor ?
                                            ("Loading...") :
                                            ("Save  Sensor")
                                    }
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
        </Modal>

        {/* Edit existing sensor */}
        <Modal
            isOpen={editModal}
            toggle={() => toggleEditModal()}
            centered={true}
            size="sm"
        >
            <ModalHeader toggle={() => toggleEditModal()}>Edit Sensor {viewedSensor?.serial_number}</ModalHeader>
            <ModalBody>
                {
                    viewedSensor ? (
                        <Formik
                            enableReinitialize
                            initialValues={viewedSensor}
                            onSubmit={editSensor}
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
                                                placeholder="Serial Number"
                                                type="text"
                                                autoComplete="new"
                                                value={values.serial_number}
                                                onChange={handleChange('serial_number')}
                                                onBlur={handleBlur('serial_number')}
                                            />

                                        </InputGroup>
                                    </FormGroup>
                                    {touched.serial_number && errors.serial_number && (
                                        <>
                                            <MsgText
                                                text={errors.serial_number}
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
                                                value={values.farm_id}
                                                onChange={handleChange('farm_id')}
                                                onBlur={handleBlur('farm_id')}
                                            >
                                                <option value="0">Select Farm</option>
                                                {
                                                    isFarmLoading ? (<option>Loading available farms...</option>)
                                                        : isFarmError ? (<option>{FarmError.message}</option>)
                                                            : isFarmSuccess && Farms.length > 0 ? (
                                                                Farms.map((farm: IFarm, index: number) => (
                                                                    <option key={index} value={farm.id}>{farm.farm_name}</option>
                                                                ))
                                                            )
                                                                : (null)
                                                }
                                            </select>

                                        </InputGroup>
                                    </FormGroup>
                                    {touched.farm_id && errors.farm_id && (
                                        <>
                                            <MsgText
                                                text={errors.farm_id}
                                                textColor="danger"
                                            />
                                            <br />
                                        </>
                                    )}
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                            <Input
                                                placeholder="Enter description of sensor"
                                                type="textarea"
                                                autoComplete="new"
                                                value={values.description}
                                                onChange={handleChange('description')}
                                                onBlur={handleBlur('description')}
                                            />

                                        </InputGroup>
                                    </FormGroup>
                                    {touched.description && errors.description && (
                                        <>
                                            <MsgText
                                                text={errors.description}
                                                textColor="danger"
                                            />
                                            <br />
                                        </>
                                    )}
                                    <div className="text-center">
                                        <Button className="my-4 w-100 bg-success text-white" type="submit">
                                            {
                                                updatingSensor ?
                                                    ("Loading...") :
                                                    ("Update Sensor")
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

Sensors.layout = Admin;

export default Sensors;