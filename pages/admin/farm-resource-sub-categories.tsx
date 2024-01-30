
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
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import { IFarmResourceCategory, IFarmResourceSubCategory } from '../../interfaces';
import { GetFarmResourceCategories } from '../api/farm-resource-categories';
import { AddFarmResourceSubCategories, GetFarmResourceSubCategories, UpdateFarmResourceSubCategories } from '../api/farm-resource-sub-categories';
// layout for this page

// core components
const FarmResourceSubCategories = () => {

    let initialValues: IFarmResourceSubCategory = {
        category_id: 0,
        sub_category_name: '',
    };

    const [editErrorMsg, setEditErrorMsg] = useState('');
    const [addErrorMsg, setAddErrorMsg] = useState('');

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewedFarmResourceSubCategory, setViewedFarmResourceSubCategory] = useState<IFarmResourceSubCategory>();

    const [updatingFarmResourceCategory, setUpdatingFarmResourceCategory] = useState(false);
    const [savingFarmResourceCategory, setSavingFarmResourceCategory] = useState(false);

    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(1);
    const [dataSize, setDataSize] = useState(10);


    let get_payload = {
        paginate: true,
        page: page,
        dataSize: dataSize

    }
    const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["FarmResourceSubCategories"],
        () => GetFarmResourceSubCategories(get_payload)
    );

    useEffect(() => {
        refetch()
    }, [dataSize])

    useEffect(() => {
        if (data) {
            setTotalPages(Math.ceil(data[1] / dataSize));
        }
    }, [data]);

    const handlePageClick = (newPage: number) => {
        setPage(newPage)
        refetch()
    }
    const { isLoading: isFarmResourceCategoryLoading, isError: isFarmResourceCategoryError, error: FarmResourceCategoryErrorMsg, isSuccess: isFarmResourceCategorySucces, data: FarmResourceCategories, refetch: FarmResourceCategoriesRefetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
        ["FarmResourceCategories"],
        GetFarmResourceCategories
    );

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

    const createMutation = useMutation(AddFarmResourceSubCategories);
    const updateMutation = useMutation(UpdateFarmResourceSubCategories);

    const addFarmResourceSubCategory = async (payload: IFarmResourceSubCategory) => {
        if (savingFarmResourceCategory) {
            return
        }
        setSavingFarmResourceCategory(true);
        setAddErrorMsg("");
        const newFarmResourceCategorie = await createMutation.mutateAsync(payload);
        refetch();
        setSavingFarmResourceCategory(false);

        console.log(newFarmResourceCategorie);
    }

    const editFarmResourceCategory = async (payload: IFarmResourceSubCategory) => {
        console.log(payload);
        if (updatingFarmResourceCategory) {
            return
        }
        setUpdatingFarmResourceCategory(true);
        setEditErrorMsg("");
        const updateFarmResourceCategory = await updateMutation.mutateAsync(payload);
        refetch();
        setUpdatingFarmResourceCategory(false);

        console.log(updateFarmResourceCategory);
    }

    useEffect(() => {
        if (isError) {
            notify('error')
        }
    }, [isError])

    useEffect(() => { }, [])

    const FormValidationSchema = Yup.object().shape({
        category_id: Yup.string().trim().required().min(0).label('Category'),
        sub_category_name: Yup.string().trim().required().min(0).label('Sub category name'),
    });

    const toggleAddModal = () => {
        setAddModal(!addModal);
    }

    const toggleEditModal = (FarmResource_category: IFarmResourceSubCategory | undefined = undefined) => {
        if (FarmResource_category != undefined) {
            setViewedFarmResourceSubCategory(FarmResource_category);
        }
        setEditModal(!editModal);
    }

    return (
        <>
            <ToastContainer />
            <PageHeader page="Farm Resource SubCategories" />
            {/* Page content */}
            <Container className="mt--7" fluid>

                <Row className="mt-5">
                    <Col className="mb-5 mb-xl-0" xl="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Farm Resources Sub Categories</h3>
                                    </div>
                                    show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                                    <div className="col text-right">
                                        <Button
                                            className="bg-success text-white"
                                            href="#pablo"
                                            onClick={() => toggleAddModal()}
                                            size="sm"
                                        >
                                            ADD NEW RESOURCE SUB CATEGORY
                                        </Button>
                                    </div>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Sub category</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isFetching || isLoading ? (<td colSpan={4}>Loading available sub categories...</td>)
                                            : isError ? (<td colSpan={4}>{error.message}</td>)
                                                : isSuccess && data[0].length > 0 ? (
                                                    data[0].map((sub_category: IFarmResourceSubCategory, index: number) => (
                                                        <tr key={index}>
                                                            <td scope="row">{(index + 1)}</td>
                                                            <td scope="row">{sub_category.farm_resource_category?.category_name}</td>
                                                            <td scope="row">{sub_category.sub_category_name}</td>
                                                            <td scope="row">
                                                                <div className=" btn-actions">
                                                                    <a
                                                                        href={void (0)}
                                                                        onClick={() => toggleEditModal(sub_category)}
                                                                    >
                                                                        <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                                    : (<td colSpan={4}>No Farm Resource Sub Category Available</td>)
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
                size="sm"
            >
                <ModalHeader toggle={toggleAddModal}>Add New Resource Sub Category</ModalHeader>
                <ModalBody>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={addFarmResourceSubCategory}
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
                                            <i className="fas fa-table" />
                                        </InputGroupText>

                                        <select
                                            className="custom-select"
                                            value={values.category_id}
                                            onChange={handleChange('category_id')}
                                            onBlur={handleBlur('category_id')}
                                        >
                                            <option value="">Select category</option>
                                            {
                                                isFarmResourceCategoryLoading ? (<option>Loading available categories...</option>)
                                                    : isFarmResourceCategoryError ? (<option>{FarmResourceCategoryErrorMsg.message}</option>)
                                                        : isFarmResourceCategorySucces && FarmResourceCategories.length > 0 ? (
                                                            FarmResourceCategories.map((category: IFarmResourceCategory, index: number) => (
                                                                <option key={index} value={category.id}>{category.category_name}</option>
                                                            ))
                                                        )
                                                            : (null)
                                            }
                                        </select>

                                    </InputGroup>
                                </FormGroup>
                                {touched.category_id && errors.category_id && (
                                    <MsgText
                                        text={errors.category_id}
                                        textColor="danger"
                                    />
                                )}
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupText>
                                            <i className="ni ni-collection" />
                                        </InputGroupText>
                                        <Input
                                            placeholder="Sub category name"
                                            type="text"
                                            autoComplete="new-sub_category_name"
                                            value={values.sub_category_name}
                                            onChange={handleChange('sub_category_name')}
                                            onBlur={handleBlur('sub_category_name')}
                                        />

                                    </InputGroup>
                                </FormGroup>
                                {touched.sub_category_name && errors.sub_category_name && (
                                    <>
                                        <MsgText
                                            text={errors.sub_category_name}
                                            textColor="danger"
                                        />
                                        <br />
                                    </>
                                )}
                                <div className="text-center">
                                    <Button className="my-4 w-100 bg-success text-white" type="submit">
                                        {
                                            savingFarmResourceCategory ?
                                                ("Loading...") :
                                                ("Save Sub Category")
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
                size="sm"
            >
                <ModalHeader toggle={() => toggleEditModal()}>Edit Resource Sub Category {viewedFarmResourceSubCategory?.sub_category_name}</ModalHeader>
                <ModalBody>
                    {
                        viewedFarmResourceSubCategory ? (
                            <Formik
                                enableReinitialize
                                initialValues={viewedFarmResourceSubCategory}
                                onSubmit={editFarmResourceCategory}
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
                                                    <i className="fas fa-table" />
                                                </InputGroupText>

                                                <select
                                                    className="custom-select"
                                                    value={values.category_id}
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
                                        {touched.category_id && errors.category_id && (
                                            <MsgText
                                                text={errors.category_id}
                                                textColor="danger"
                                            />
                                        )}
                                        <FormGroup>
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupText>
                                                    <i className="ni ni-collection" />
                                                </InputGroupText>
                                                <Input
                                                    placeholder="Category name"
                                                    type="text"
                                                    autoComplete="new-category-name"
                                                    value={values.sub_category_name}
                                                    onChange={handleChange('sub_category_name')}
                                                    onBlur={handleBlur('sub_category_name')}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                        {touched.sub_category_name && errors.sub_category_name && (
                                            <>
                                                <MsgText
                                                    text={errors.sub_category_name}
                                                    textColor="danger"
                                                />
                                                <br />
                                            </>
                                        )}
                                        <div className="text-center">
                                            <Button className="my-4 w-100 bg-success text-white" type="submit">
                                                {
                                                    updatingFarmResourceCategory ?
                                                        ("Loading...") :
                                                        ("Update Sub Category")
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


export default FarmResourceSubCategories;
