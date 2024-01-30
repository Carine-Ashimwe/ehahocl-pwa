
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
import { MsgText } from '../../components/Common/MsgText';
import PageHeader from '../../components/Headers/PageHeader';
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import axios from '../../helpers/axios';
import { IFarmResource, IFarmResourceCategory, IFarmResourceSubCategory } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { GetFarmResourceCategories } from '../api/farm-resource-categories';
import { GetFarmResourceSubCategories } from '../api/farm-resource-sub-categories';
import { AddFarmResource, GetFarmResources, UpdateFarmResources } from '../api/farm-resources';
// layout for this page

// core components
const FarmResources = () => {

    let initialValues: IFarmResource = {
        sub_category_id: 0,
        farm_resource_title: '',
        farm_resource_summary: '',
        farm_resource_file: '',
        farm_resource_banner: '',
        farm_resource_link: '',
    };

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [editErrorMsg, setEditErrorMsg] = useState('');
    const [addErrorMsg, setAddErrorMsg] = useState('');

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewedFarmResource, setViewedFarmResource] = useState<IFarmResource>();

    const [updatingFarmResource, setUpdatingFarmResource] = useState(false);
    const [savingFarmResource, setSavingFarmResource] = useState(false);

    const [previewRessourceBanner, setPreviewRessourceBanner] = useState<string>('');
    const [ressourceBanner, setRessourceBanner] = useState<string>('');
    // files states
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [farmRessourceFile, setFarmRessourceFile] = useState("");
    const [selectedExistingFiles, setSelectedExistingFiles] = useState<string>('');
    const [farmRessourceExistingRessourceFile, setfarmRessourceExistingFiles] = useState<string>('');

    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(1);
    const [dataSize, setDataSize] = useState(10);


    let get_payload = {
        paginate: true,
        page: page,
        dataSize: dataSize

    }

    const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["FarmResources"],
        () => GetFarmResources(get_payload)
    );

    useEffect(() => {
        refetch()
    }, [dataSize])

    console.log(data)
    useEffect(() => {
        if (data) {
            setTotalPages(Math.ceil(data[1] / dataSize));
        }
    }, [data]);

    const handlePageClick = (newPage: number) => {
        setPage(newPage)
        refetch()
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
    }

    const createMutation = useMutation(AddFarmResource);
    const updateMutation = useMutation(UpdateFarmResources);

    const addFarmResource = async (payload: IFarmResource) => {
        if (savingFarmResource) {
            return
        }
        payload.farm_resource_banner = ressourceBanner;
        payload.farm_resource_file = farmRessourceFile;
        setSavingFarmResource(true);
        setAddErrorMsg("");
        console.log(JSON.stringify(payload))
        const newFarmResource = await createMutation.mutateAsync(payload);
        refetch();
        setSavingFarmResource(false);

        console.log(newFarmResource);
    }

    const editFarmResource = async (payload: IFarmResource) => {
        console.log(payload);
        if (updatingFarmResource) {
            return
        }
        setUpdatingFarmResource(true);
        setEditErrorMsg("");
        const updateFarmResourceCategory = await updateMutation.mutateAsync(payload);
        refetch();
        setUpdatingFarmResource(false);

        setUpdatingFarmResource(true);
        setEditErrorMsg("");
        const updateFarmResourceSubCategory = await updateMutation.mutateAsync(payload);
        refetch();
        setUpdatingFarmResource(false);

        console.log(updateFarmResourceCategory);
    }

    // Image handlers
    // Ressource banner
    const onRessourceBannerSelectFile = (event: any) => {
        const selectedFile = event.target.files[0];
        const image = URL.createObjectURL(selectedFile);

        setPreviewRessourceBanner(image);
        // FOR BUG IN CHROME
        event.target.value = "";

        // Upload on the server
        const formData = new FormData();
        formData.append('ressource_banner', selectedFile);
        formData.append('upload_type', 'single');
        formData.append('storage', 'images/farm_ressource_banners');
        formData.append('value_name', 'ressource_banner');

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
                    setRessourceBanner(res.data.message);
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
    function deleteRessourceBannerHandler(image: string) {
        setPreviewRessourceBanner('');
        setRessourceBanner('');
        URL.revokeObjectURL(image);
    }

    //Files
    const onSelectResourceFile = (event: any, action: string) => {
        const selectedFarmFile = event.target.files[0];
        const file_name = selectedFarmFile.name
        if (action == 'add') {
            setSelectedFile(file_name);
        }
        else {
            setSelectedExistingFiles(file_name);
        }

        // Upload on the server
        const formData = new FormData();
        formData.append('Farmfile', selectedFarmFile);
        formData.append('upload_type', 'single');
        formData.append('storage', 'images/farm_resource_files');
        formData.append('value_name', 'Farmfile');

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
        axios
            .post('/image_upload', formData, options)
            .then((res: any) => {
                console.log(res.data)
                if (res.data.status) {
                    if (action == 'add') {
                        setFarmRessourceFile(res.data.message);
                    }
                    else {
                        setfarmRessourceExistingFiles(res.data.message);
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

    //In order to re-render the farmRessourceFile to allow it to update
    useEffect(() => {
        console.log(farmRessourceFile)
    }, [farmRessourceFile])

    function deleteFarmRessurceFileHandler(action: string) {
        if (action == 'add') {
            setSelectedFile('');
            setFarmRessourceFile('');
        }
        else {
            setSelectedExistingFiles('');
            setfarmRessourceExistingFiles('');
        }
    }
    // End of images handlers

    useEffect(() => {
        if (isError) {
            notify('error')
        }
    }, [isError])

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

    const { isLoading: isFarmResourceCategoryLoading, isError: isFarmResourceCategoryError, error: FarmResourceCategoryErrorMsg, isSuccess: isFarmResourceCategorySucces, data: FarmResourceCategories, refetch: refetchCategories }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["FarmResourceCategories"],
        () => GetFarmResourceCategories({})
    );

    const { isLoading: isFarmResourceSubCategoryLoading, isError: isFarmResourceSubCategoryError, error: FarmResourceSubCategoryErrorMsg, isSuccess: isFarmResourceSubCategorySucces, data: FarmResourceSubCategories, refetch: refetchSubCategories }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["FarmResourceSubCategories"],
        () => GetFarmResourceSubCategories({})
    );

    /*const FormValidationSchema = Yup.object().shape({
        category_id: Yup.string().trim().required().min(0).label('Category'),
        sub_category_id: Yup.string().trim().required().min(0).label('Sub Category'),
        farm_resource_title: Yup.string().trim().required().label('Farm Resource Title'),
        farm_resource_summary: Yup.string().trim().required().label('Farm Resource Summary'),
        farm_resource_file: Yup.string().trim().required().label('Farm Resource File'),
        farm_resource_link: Yup.string().trim().required().label('Farm Resource Link'),
    });*/

    const toggleAddModal = () => {
        setAddModal(!addModal);
    }

    const toggleEditModal = (FarmResource_category: IFarmResource | undefined = undefined) => {
        if (FarmResource_category != undefined) {
            setViewedFarmResource(FarmResource_category);
        }
        setEditModal(!editModal);
    }

    return (
        <>
            <ToastContainer />
            <PageHeader page="Farm Resource" />
            {/* Page content */}
            <Container className="mt--7" fluid>

                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" xl="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Farm Resource</h3>
                                    </div>
                                    show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                                    <div className="col text-right">
                                        <Button
                                            className="bg-success text-white"
                                            href="#"
                                            onClick={() => toggleAddModal()}
                                            size="sm"
                                        >
                                            ADD NEW FARM RESOURCE
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Banner</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Sub category</th>
                                        <th scope="col">farm_resource_title</th>
                                        <th scope="col">farm_resource_summary</th>
                                        {/* <th scope="col">farm_resource_file</th> */}
                                        <th scope="col">farm_resource_link</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isFetching || isLoading ? (<td colSpan={4}>Loading available resources...</td>)
                                            : isError ? (<td colSpan={4}>{error.message}</td>)
                                                : isSuccess && data[0].length > 0 ? (
                                                    data[0].map((resource: IFarmResource, index: number) => (
                                                        <tr key={index}>
                                                            <td scope="row">{(index + 1)}</td>
                                                            <td scope="row">
                                                                <img src={resource.farm_resource_banner} />
                                                            </td>
                                                            <td scope="row">{resource.farm_resource_sub_category?.farm_resource_category?.category_name}</td>
                                                            <td scope="row">{resource.farm_resource_sub_category?.sub_category_name}</td>
                                                            <td scope="row">{resource.farm_resource_title}</td>
                                                            <td scope="row">{resource.farm_resource_summary}</td>
                                                            {/* <td scope="row">{resource.farm_resource_file}</td> */}
                                                            <td scope="row">{resource.farm_resource_link}</td>
                                                            <td scope="row">
                                                                <div className=" btn-actions">
                                                                    <a
                                                                        href={void (0)}
                                                                        onClick={() => toggleEditModal(resource)}
                                                                    >
                                                                        <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                                    : (<td colSpan={4}>No Farm Resource Available</td>)
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

            {/* Add new FarmResource */}
            <Modal
                isOpen={addModal}
                toggle={toggleAddModal}
                centered={true}
                size="lg"
            >
                <ModalHeader toggle={toggleAddModal}>Add New Farm Resource</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={addFarmResource}
                    //validationSchema={FormValidationSchema}
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
                                    <Col xl="6">
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">

                                                <InputGroupText>
                                                    <i className="fas fa-table" />
                                                </InputGroupText>

                                                <select
                                                    className="custom-select"
                                                    value={values.farm_resource_sub_category?.category_id}
                                                    onChange={handleChange('category_id')}
                                                    onBlur={handleBlur('category_id')}
                                                >
                                                    <option value="0" selected disabled>Select a category</option>
                                                    {
                                                        isLoading ? (<option>Loading available categories...</option>)
                                                            : isError ? (<option>{error.message}</option>)
                                                                : isSuccess && FarmResourceCategories.length > 0 ? (
                                                                    FarmResourceCategories.map((category: IFarmResourceCategory, index: number) => (
                                                                        <option key={index} value={category.id}>{category.category_name}</option>
                                                                    ))
                                                                )
                                                                    : (null)
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
                                    <Col xl="6">
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">

                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>

                                                <select
                                                    className="custom-select"
                                                    value={values.sub_category_id}
                                                    onChange={handleChange('sub_category_id')}
                                                    onBlur={handleBlur('sub_category_id')}
                                                >
                                                    <option value="0" selected disabled>Select a subcategory</option>
                                                    {
                                                        isLoading ? (<option>Loading available sub categories...</option>)
                                                            : isError ? (<option>{error.message}</option>)
                                                                : isSuccess && FarmResourceSubCategories.length > 0 ? (
                                                                    FarmResourceSubCategories.map((subcategory: IFarmResourceSubCategory, index: number) => (
                                                                        <option key={index} value={subcategory.id}>{subcategory.sub_category_name}</option>
                                                                    ))
                                                                )
                                                                    : (null)
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
                                    <Col xl="6">
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="fas fa-heading" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Farm Resource Title"
                                                    type="text"
                                                    autoComplete="new-farm_resource_title"
                                                    value={values.farm_resource_title}
                                                    onChange={handleChange('farm_resource_title')}
                                                    onBlur={handleBlur('farm_resource_title')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.farm_resource_title && errors.farm_resource_title && (
                                            <>
                                                <MsgText
                                                    text={errors.farm_resource_title}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                    </Col>
                                    <Col xl="6">
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="fa-solid fa-link" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Farm Resource Link"
                                                    type="text"
                                                    autoComplete="new-farm_resource_link"
                                                    value={values.farm_resource_link}
                                                    onChange={handleChange('farm_resource_link')}
                                                    onBlur={handleBlur('farm_resource_link')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.farm_resource_link && errors.farm_resource_link && (
                                            <>
                                                <MsgText
                                                    text={errors.farm_resource_link}
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
                                            <InputGroup className="input-group-alternative">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Farm Resource Summary"
                                                    value={values.farm_resource_summary}
                                                    onChange={handleChange('farm_resource_summary')}
                                                    onBlur={handleBlur('farm_resource_summary')}
                                                ></textarea>
                                            </InputGroup>
                                        </FormGroup>
                                        {touched.farm_resource_summary && errors.farm_resource_summary && (
                                            <MsgText
                                                text={errors.farm_resource_summary}
                                                textColor="danger"
                                            />
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={12} className='upload_image'>
                                        <Label>Resource banner</Label>
                                        <section>

                                            <div className="images">
                                                {
                                                    !previewRessourceBanner || previewRessourceBanner == '' ? (
                                                        <>
                                                            <label className='image'>
                                                                Click here for
                                                                <br />
                                                                <span>Resource Banner</span>
                                                                <Input
                                                                    name="business_logo"
                                                                    placeholder="business_logo"
                                                                    type="file"
                                                                    accept="image/png, image/jpeg, image/webp"
                                                                    autoComplete="business-logo"
                                                                    onChange={(event: any) => {
                                                                        onRessourceBannerSelectFile(event);
                                                                    }}
                                                                />
                                                            </label>
                                                            <p className="error">
                                                                <span>
                                                                    Resource banner is not set!
                                                                </span><br />
                                                                It&#39;s optional. You can leave it to set it later.
                                                            </p>
                                                        </>
                                                    )
                                                        : (
                                                            <div className="image">
                                                                <img src={previewRessourceBanner} height="150" alt="user image" />
                                                                <button onClick={() => deleteRessourceBannerHandler(previewRessourceBanner)}>
                                                                    <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                                                </button>
                                                                <p>Banner</p>
                                                            </div>

                                                        )
                                                }
                                            </div>
                                        </section>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xl={12} className='upload_image'>
                                        <Label>Resource Files</Label>
                                        <section>

                                            <div>
                                                {
                                                    selectedFile &&
                                                    <p>
                                                        <a href='#'>- {selectedFile}</a>
                                                        <a href='#' onClick={() => deleteFarmRessurceFileHandler('edit')}>
                                                            <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                                        </a>
                                                    </p>
                                                }
                                                <label className='image'>
                                                    + Add Files
                                                    <Input
                                                        name="file"
                                                        placeholder="file"
                                                        type="file"
                                                        autoComplete="new-product-image"
                                                        onChange={(event: any) => {
                                                            onSelectResourceFile(event, 'add');
                                                        }}
                                                    />
                                                </label>
                                            </div>

                                            {
                                                selectedFile == '' ? (
                                                    <p className="error">
                                                        <span>No File selected</span><br />
                                                        Upload file if available
                                                    </p>
                                                )
                                                    : (null)
                                            }
                                        </section>
                                    </Col>
                                </Row>
                                <div className="text-center">
                                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                                        {
                                            savingFarmResource ?
                                                ("Loading...") :
                                                ("Save Farm Resource")
                                        }
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>

            {/* Edit existing FarmResource */}
            <Modal
                isOpen={editModal}
                toggle={() => toggleEditModal()}
                centered={true}
                size="lg"
            >
                <ModalHeader toggle={() => toggleEditModal()}>Edit Farm Resource {viewedFarmResource?.farm_resource_title}</ModalHeader>
                <ModalBody>
                    {
                        viewedFarmResource ? (
                            <Formik
                                enableReinitialize
                                initialValues={viewedFarmResource}
                                onSubmit={editFarmResource}
                            //validationSchema={FormValidationSchema}
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
                                            <Col xl="6">
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">

                                                        <InputGroupText>
                                                            <i className="fas fa-table" />
                                                        </InputGroupText>

                                                        <select
                                                            className="custom-select"
                                                            value={values.sub_category_id}
                                                            onChange={handleChange('category_id')}
                                                            onBlur={handleBlur('category_id')}
                                                        >
                                                            {
                                                                isLoading ? (<option>Loading available categories...</option>)
                                                                    : isError ? (<option>{error.message}</option>)
                                                                        : isSuccess && FarmResourceCategories.length > 0 ? (
                                                                            FarmResourceCategories.map((category: IFarmResourceCategory, index: number) => (
                                                                                <option key={index} value={category.id}>{category.category_name}</option>
                                                                            ))
                                                                        )
                                                                            : (null)
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
                                            <Col xl="6">
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">

                                                        <InputGroupText>
                                                            <i className="ni ni-collection" />
                                                        </InputGroupText>

                                                        <select
                                                            className="custom-select"
                                                            value={values.sub_category_id}
                                                            onChange={handleChange('sub_category_id')}
                                                            onBlur={handleBlur('sub_category_id')}
                                                        >
                                                            {
                                                                isLoading ? (<option>Loading available sub categories...</option>)
                                                                    : isError ? (<option>{error.message}</option>)
                                                                        : isSuccess && FarmResourceSubCategories.length > 0 ? (
                                                                            FarmResourceSubCategories.map((subcategory: IFarmResourceSubCategory, index: number) => (
                                                                                <option key={index} value={subcategory.id}>{subcategory.sub_category_name}</option>
                                                                            ))
                                                                        )
                                                                            : (null)
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
                                        </Row>
                                        <Row>
                                            <Col xl="6">
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="fas fa-heading" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Farm Resource Title"
                                                            type="text"
                                                            autoComplete="new-farm_resource_title"
                                                            value={values.farm_resource_title}
                                                            onChange={handleChange('farm_resource_title')}
                                                            onBlur={handleBlur('farm_resource_title')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.farm_resource_title && errors.farm_resource_title && (
                                                    <>
                                                        <MsgText
                                                            text={errors.farm_resource_title}
                                                            textColor="danger"
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                            </Col>
                                            <Col xl="6">
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupText>
                                                            <i className="fa-solid fa-link" />
                                                        </InputGroupText>
                                                        <Input
                                                            placeholder="Farm Resource Link"
                                                            type="url"
                                                            autoComplete="new-farm_resource_link"
                                                            value={values.farm_resource_link}
                                                            onChange={handleChange('farm_resource_link')}
                                                            onBlur={handleBlur('farm_resource_link')}
                                                        />

                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.farm_resource_link && errors.farm_resource_link && (
                                                    <>
                                                        <MsgText
                                                            text={errors.farm_resource_link}
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
                                                    <InputGroup className="input-group-alternative">
                                                        <textarea
                                                            className="form-control"
                                                            placeholder="Farm Resource Summary"
                                                            value={values.farm_resource_summary}
                                                            onChange={handleChange('farm_resource_summary')}
                                                            onBlur={handleBlur('farm_resource_summary')}
                                                        ></textarea>
                                                    </InputGroup>
                                                </FormGroup>
                                                {touched.farm_resource_summary && errors.farm_resource_summary && (
                                                    <MsgText
                                                        text={errors.farm_resource_summary}
                                                        textColor="danger"
                                                    />
                                                )}
                                            </Col>
                                        </Row>
                                        <div className="text-center">
                                            <Button className="my-4 w-100 bg-success text-white" type="submit">
                                                {
                                                    updatingFarmResource ?
                                                        ("Loading...") :
                                                        ("Update Farm Ressource")
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

FarmResources.layout = Admin;

export default FarmResources;
