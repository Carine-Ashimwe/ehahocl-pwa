/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

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
import { MsgText } from '../../components/Common/MsgText';
import PageHeader from '../../components/Headers/PageHeader';
import { IParameter } from '../../interfaces';
import { AddParameter, GetParameters, UpdateParameter } from '../api/parameters';
// layout for this page

// core components


const Parameters = () => {

    let initialValues: IParameter = {
        symbol: '',
        name: '',
        unit: '',
        min: 0,
        max: 0,
        rounding: 0
    };

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [editErrorMsg, setEditErrorMsg] = useState('');
    const [addErrorMsg, setAddErrorMsg] = useState('');

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewedParameter, setViewedParameter] = useState<IParameter>();

    const [updatingParameter, setUpdatingParameter] = useState(false);
    const [savingParameter, setSavingParameter] = useState(false);

    const { isLoading, isError, error, isSuccess, data, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["Parameters"],
        GetParameters
    );

    const createMutation = useMutation(AddParameter);
    const updateMutation = useMutation(UpdateParameter);

    const addParameter = async (payload: IParameter) => {
        if (savingParameter) {
            return
        }
        setSavingParameter(true);
        setAddErrorMsg("");
        const newParameter = await createMutation.mutateAsync(payload);
        refetch();
        setSavingParameter(false);

        if (newParameter) {
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

    const editParameter = async (payload: IParameter) => {
        console.log(payload);
        if (updatingParameter) {
            return
        }
        setUpdatingParameter(true);
        setEditErrorMsg("");
        const updateParameter = await updateMutation.mutateAsync(payload);
        refetch();
        setUpdatingParameter(false);
        if (updateParameter) {
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
        name: Yup.string().trim().required().label('Parameter name'),
    });

    const toggleAddModal = () => {
        setAddModal(!addModal);
    }

    const toggleEditModal = (parameter: IParameter | undefined = undefined) => {
        if (parameter != undefined) {
            setViewedParameter(parameter);
        }
        setEditModal(!editModal);
    }

    return (
        <>
            <ToastContainer />
            <PageHeader page="Parameters" />
            {/* Page content */}
            <Container className="mt--7" fluid>

                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" xl="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Parameters</h3>
                                    </div>
                                    <div className="col text-right">
                                        <Button
                                            className='bg-success text-white'
                                            href="#pablo"
                                            onClick={toggleAddModal}
                                            size="sm"
                                        >
                                            ADD PARAMETER
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Symbol</th>
                                        <th scope="col">Unit</th>
                                        <th scope="col">Min</th>
                                        <th scope="col">Max</th>
                                        <th scope="col">Rounding</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isLoading ? (<td colSpan={3}>Loading available parameters...</td>)
                                            : isError ? (<td colSpan={3}>{error.message}</td>)
                                                : isSuccess && data.length > 0 ? (
                                                    data.map((parameter: IParameter, index: number) => (
                                                        <tr key={index}>
                                                            <td scope="row">{(index + 1)}</td>
                                                            <td scope="row">{parameter.name}</td>
                                                            <td scope="row">{parameter.symbol}</td>
                                                            <td scope="row">{parameter.unit}</td>
                                                            <td scope="row">{parameter.min} {parameter.unit}</td>
                                                            <td scope="row">{parameter.max} {parameter.unit}</td>
                                                            <td scope="row">{parameter.rounding}</td>
                                                            <td scope="row">
                                                                <div className=" btn-actions">
                                                                    <a
                                                                        href={void (0)}
                                                                        onClick={() => toggleEditModal(parameter)}
                                                                    >
                                                                        <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                                    : (<td colSpan={3}>No Parameter Available {data.length}</td>)
                                    }
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>


            {/* Add new parameter */}
            <Modal
                isOpen={addModal}
                toggle={toggleAddModal}
                centered={true}
                size="lg"
            >
                <ModalHeader toggle={toggleAddModal}>Add New Parameter</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={addParameter}
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
                                    <Col xl={6}>
                                        <Label>Parameter name</Label>
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Enter parameter name"
                                                    type="text"
                                                    autoComplete="new"
                                                    value={values.name}
                                                    onChange={handleChange('name')}
                                                    onBlur={handleBlur('name')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.name && errors.name && (
                                            <>
                                                <MsgText
                                                    text={errors.name}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                    <Col xl={6}>
                                        <Label>Parameter symbol</Label>
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Enter parameter symbol"
                                                    type="text"
                                                    autoComplete="new"
                                                    value={values.symbol}
                                                    onChange={handleChange('symbol')}
                                                    onBlur={handleBlur('symbol')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.symbol && errors.symbol && (
                                            <>
                                                <MsgText
                                                    text={errors.symbol}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                    <Col xl={6}>
                                        <Label>Parameter unit</Label>
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Enter parameter unit"
                                                    type="text"
                                                    autoComplete="new"
                                                    value={values.unit}
                                                    onChange={handleChange('unit')}
                                                    onBlur={handleBlur('unit')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.unit && errors.unit && (
                                            <>
                                                <MsgText
                                                    text={errors.unit}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                    <Col xl={6}>
                                        <Label>Minimum Value</Label>
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Minimum value"
                                                    type="text"
                                                    autoComplete="new"
                                                    value={values.min}
                                                    onChange={handleChange('min')}
                                                    onBlur={handleBlur('min')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.min && errors.min && (
                                            <>
                                                <MsgText
                                                    text={errors.min}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                    <Col xl={6}>
                                        <Label>Maximum Value</Label>
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Maximum value"
                                                    type="text"
                                                    autoComplete="new"
                                                    value={values.max}
                                                    onChange={handleChange('max')}
                                                    onBlur={handleBlur('max')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.max && errors.max && (
                                            <>
                                                <MsgText
                                                    text={errors.max}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup>
                                            <Label>Rounding Value</Label>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Rounding value"
                                                    type="text"
                                                    autoComplete="new"
                                                    value={values.rounding}
                                                    onChange={handleChange('rounding')}
                                                    onBlur={handleBlur('rounding')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.rounding && errors.rounding && (
                                            <>
                                                <MsgText
                                                    text={errors.rounding}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                </Row>
                                <div className="text-center">
                                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                                        {
                                            savingParameter ?
                                                ("Loading...") :
                                                ("Save Parameter")
                                        }
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>

            {/* Edit existing paramter */}
            <Modal
                isOpen={editModal}
                toggle={() => toggleEditModal()}
                centered={true}
                size="lg"
            >
                <ModalHeader toggle={() => toggleEditModal()}>Edit Parameter {viewedParameter?.name}</ModalHeader>
                <ModalBody>
                    {
                        viewedParameter ? (
                            <Formik
                                enableReinitialize
                                initialValues={viewedParameter}
                                onSubmit={editParameter}
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
                                            <Col xl={6}>
                                                <Label>Parameter name</Label>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Enter parameter name"
                                                            type="text"
                                                            autoComplete="new"
                                                            value={values.name}
                                                            onChange={handleChange('name')}
                                                            onBlur={handleBlur('name')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.name && errors.name && (
                                                    <>
                                                        <MsgText
                                                            text={errors.name}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                            <Col xl={6}>
                                                <Label>Parameter symbol</Label>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Enter parameter symbol"
                                                            type="text"
                                                            autoComplete="new"
                                                            value={values.symbol}
                                                            onChange={handleChange('symbol')}
                                                            onBlur={handleBlur('symbol')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.symbol && errors.symbol && (
                                                    <>
                                                        <MsgText
                                                            text={errors.symbol}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                            <Col xl={6}>
                                                <Label>Parameter unit</Label>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Enter parameter unit"
                                                            type="text"
                                                            autoComplete="new"
                                                            value={values.unit}
                                                            onChange={handleChange('unit')}
                                                            onBlur={handleBlur('unit')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.unit && errors.unit && (
                                                    <>
                                                        <MsgText
                                                            text={errors.unit}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                            <Col xl={6}>
                                                <Label>Minimum Value</Label>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Minimum value"
                                                            type="text"
                                                            autoComplete="new"
                                                            value={values.min}
                                                            onChange={handleChange('min')}
                                                            onBlur={handleBlur('min')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.min && errors.min && (
                                                    <>
                                                        <MsgText
                                                            text={errors.min}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                            <Col xl={6}>
                                                <Label>Maximum Value</Label>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Maximum value"
                                                            type="text"
                                                            autoComplete="new"
                                                            value={values.max}
                                                            onChange={handleChange('max')}
                                                            onBlur={handleBlur('max')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.max && errors.max && (
                                                    <>
                                                        <MsgText
                                                            text={errors.max}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                            <Col xl={6}>
                                                <FormGroup>
                                                    <Label>Rounding Value</Label>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Rounding value"
                                                            type="text"
                                                            autoComplete="new"
                                                            value={values.rounding}
                                                            onChange={handleChange('rounding')}
                                                            onBlur={handleBlur('rounding')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.rounding && errors.rounding && (
                                                    <>
                                                        <MsgText
                                                            text={errors.rounding}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                        <div className="text-center">
                                            <Button className="my-4 w-100 bg-success text-white" type="submit">
                                                {
                                                    updatingParameter ?
                                                        ("Loading...") :
                                                        ("Update Parameter")
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


export default Parameters;