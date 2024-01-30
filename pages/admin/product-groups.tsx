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
import { IProGroup } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddProductGroups, GetProductGroups, UpdateProductGroups } from '../api/product-groups';
// layout for this page

// core components


const ProductGroups = () => {

  let initialValues: IProGroup = {
    group_name: '',
  };

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedProductGroup, setViewedProductGroup] = useState<IProGroup>();

  const [updatingProductGroup, setUpdatingProductGroup] = useState(false);
  const [savingProductGroup, setSavingProductGroup] = useState(false);

  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);


  let get_payload = {
    paginate: true,
    page: page,
    dataSize: dataSize
  }
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["ProductGroups"],
    () => GetProductGroups(get_payload)
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


  const createMutation = useMutation(AddProductGroups);
  const updateMutation = useMutation(UpdateProductGroups);

  const addProductGroup = async (payload: IProGroup) => {
    if (savingProductGroup) {
      return
    }
    setSavingProductGroup(true);
    setAddErrorMsg("");
    const newProductGroup = await createMutation.mutateAsync(payload);
    refetch();
    setSavingProductGroup(false);

    // Handle result from API
    console.log(newProductGroup);

    // Close the add modal
    setAddModal(false);

    // Notify the user
    toast.success("Product group added successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
    // setSavingProductCategorie(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
  }

  const editProductGroup = async (payload: IProGroup) => {
    console.log(payload);
    if (updatingProductGroup) {
      return
    }
    setUpdatingProductGroup(true);
    setEditErrorMsg("");
    const updateProductGroup = await updateMutation.mutateAsync(payload);
    refetch();
    setUpdatingProductGroup(false);

    // Handle result from API
    console.log(updateProductGroup);

    //Close the edit modal
    setEditModal(false);

    // Notify the user
    toast.success("Product group updated successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
    // setSavingProductCategorie(false);
    // console.error(error.response?.data?.message);
    // const errorMessage = error.response?.data?.message;
    // setErrorMsg(errorMessage || error.message);
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
    // if (msg_type === 'success') {
    //   toast.success(successMsg, {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: 'light'
    //   });
    // }
  }

  // useEffect(() => {
  //   if (successMsg) {
  //     notify('success')
  //   }
  // }, [successMsg])

  useEffect(() => {
    if (isError) {
      notify('error')
    }
  }, [isError])

  const FormValidationSchema = Yup.object().shape({
    group_name: Yup.string().trim().required().label('Group name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (product_group: IProGroup | undefined = undefined) => {
    if (product_group != undefined) {
      setViewedProductGroup(product_group);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Product  Groups" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products  Groups</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD PRODUCT GROUP
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Group Name</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (<td colSpan={3}>Loading available Groups...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((group: IProGroup, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{group.group_name}</td>
                              <td scope="row">{group.created_at}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(group)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No Product Group Available</td>)
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
        <ModalHeader toggle={toggleAddModal}>Add New Product Group</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addProductGroup}
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
                      placeholder="Group name"
                      type="text"
                      autoComplete="new-group-name"
                      value={values.group_name}
                      onChange={handleChange('group_name')}
                      onBlur={handleBlur('group_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.group_name && errors.group_name && (
                  <>
                    <MsgText
                      text={errors.group_name}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {
                      savingProductGroup ?
                        ("Loading...") :
                        ("Save Group")
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
        <ModalHeader toggle={() => toggleEditModal()}>Edit Product Group {viewedProductGroup?.group_name}</ModalHeader>
        <ModalBody>
          {
            viewedProductGroup ? (
              <Formik
                enableReinitialize
                initialValues={viewedProductGroup}
                onSubmit={editProductGroup}
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
                          placeholder="Group name"
                          type="text"
                          autoComplete="new-group-name"
                          value={values.group_name}
                          onChange={handleChange('group_name')}
                          onBlur={handleBlur('group_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.group_name && errors.group_name && (
                      <>
                        <MsgText
                          text={errors.group_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingProductGroup ?
                            ("Loading...") :
                            ("Update Group")
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

ProductGroups.layout = Admin;

export default ProductGroups;