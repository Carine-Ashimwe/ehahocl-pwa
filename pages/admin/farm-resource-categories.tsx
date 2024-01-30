
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
import { IFarmResourceCategory } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddFarmResourceCategories, GetFarmResourceCategories, UpdateFarmResourceCategories } from '../api/farm-resource-categories';
const FarmResourceCategories = () => {

  let initialValues = {
    category_name: '',
  };

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedFarmResourceCategory, setViewedFarmResourceCategory] = useState<IFarmResourceCategory>();

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
    ["FarmResourceCategories"],
    () => GetFarmResourceCategories(get_payload)
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

  const createMutation = useMutation(AddFarmResourceCategories);
  const updateMutation = useMutation(UpdateFarmResourceCategories);

  const addFarmResourceCategory = async (payload: IFarmResourceCategory) => {
    if (savingFarmResourceCategory) {
      return
    }
    setSavingFarmResourceCategory(true);
    setAddErrorMsg("");
    const newFarmResourceCategories = await createMutation.mutateAsync(payload);
    refetch();
    setSavingFarmResourceCategory(false);

    console.log(newFarmResourceCategories);
  }

  const editFarmResourceCategory = async (payload: IFarmResourceCategory) => {
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

  useEffect(() => {
    if (isError) {
      notify('error')
    }
  }, [isError])

  const FormValidationSchema = Yup.object().shape({
    category_name: Yup.string().trim().required().label('Category name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (farm_resource_category: IFarmResourceCategory | undefined = undefined) => {
    if (farm_resource_category != undefined) {
      setViewedFarmResourceCategory(farm_resource_category);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Farm Resource Categories" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Farm Resource Categories</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD RESOURCE CATEGORY
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (<td colSpan={3}>Loading available categories...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((category: IFarmResourceCategory, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{category.category_name}</td>
                              <td scope="row">{category.created_at}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(category)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No Resource Category Available</td>)
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
        size="sm"
      >
        <ModalHeader toggle={toggleAddModal}>Add New Resource Category</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addFarmResourceCategory}
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
                      placeholder="Category name"
                      type="text"
                      autoComplete="new-category-name"
                      value={values.category_name}
                      onChange={handleChange('category_name')}
                      onBlur={handleBlur('category_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.category_name && errors.category_name && (
                  <>
                    <MsgText
                      text={errors.category_name}
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
                        ("Save  Category")
                    }
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Edit existing product */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="sm"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit Resource Category {viewedFarmResourceCategory?.category_name}</ModalHeader>
        <ModalBody>
          {
            viewedFarmResourceCategory ? (
              <Formik
                enableReinitialize
                initialValues={viewedFarmResourceCategory}
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
                          <i className="ni ni-collection" />
                        </InputGroupText>
                        <Input
                          placeholder="Category name"
                          type="text"
                          autoComplete="new-category-name"
                          value={values.category_name}
                          onChange={handleChange('category_name')}
                          onBlur={handleBlur('category_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.category_name && errors.category_name && (
                      <>
                        <MsgText
                          text={errors.category_name}
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
                            ("Update Category")
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

FarmResourceCategories.layout = Admin;

export default FarmResourceCategories;