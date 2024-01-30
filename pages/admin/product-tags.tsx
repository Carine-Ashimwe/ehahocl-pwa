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
import { IProTag } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddProductTags, GetProductTags, UpdateProductTags } from '../api/product-tags';
// layout for this page

// core components


const ProductTags = () => {

  let initialValues: IProTag = {
    tag_name: '',
  };

  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedProductTag, setViewedProductTag] = useState<IProTag>();

  const [updatingProductTag, setUpdatingProductTag] = useState(false);
  const [savingProductTag, setSavingProductTag] = useState(false);

  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  let get_payload = {
    paginate: true,
    page: page,
    dataSize: dataSize
  }
  const { isLoading, isError, error, isSuccess, data, isFetching, refetch }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ["ProductTags"],
    () => GetProductTags(get_payload)
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

  const createMutation = useMutation(AddProductTags);
  const updateMutation = useMutation(UpdateProductTags);

  const addProductTag = async (payload: IProTag) => {
    if (savingProductTag) {
      return;
    }
    setSavingProductTag(true);
    setAddErrorMsg("");
    let error: any;
    try {
      const newProductTag = await createMutation.mutateAsync(payload);
      refetch();
      setSavingProductTag(false);
      setAddModal(false);
      toast.success("Product Tag added");
      console.log(newProductTag);
    } catch (e) {
      error = e;
      console.error(error.response?.data?.message);
      const errorMessage = error.response?.data?.message;
      setEditErrorMsg(errorMessage || error.message);
    }
  };


  const editProductTag = async (payload: IProTag) => {
    console.log(payload);
    if (updatingProductTag) {
      return;
    }
    setUpdatingProductTag(true);
    setEditErrorMsg("");
    try {
      const updatedProductTag = await updateMutation.mutateAsync(payload);
      refetch();
      setUpdatingProductTag(false);
      setEditModal(false);
      toast.success("Product Tag updated");
      console.log(updatedProductTag);
    } catch (error: any) {
      console.error(error.response?.data?.message);
      const errorMessage = error.response?.data?.message;
      setEditErrorMsg(errorMessage || error.message);
    }
  };


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
    tag_name: Yup.string().trim().required().label('Tag name'),
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (product_tag: IProTag | undefined = undefined) => {
    if (product_tag != undefined) {
      setViewedProductTag(product_tag);
    }
    setEditModal(!editModal);
  }

  return (
    <>
      <ToastContainer />
      <PageHeader page="Product Tags" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Products  Tags</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries

                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      ADD PRODUCT TAG
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Tag Name</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isFetching || isLoading ? (<td colSpan={3}>Loading available Tags...</td>)
                      : isError ? (<td colSpan={3}>{error.message}</td>)
                        : isSuccess && data[0].length > 0 ? (
                          data[0].map((tag: IProTag, index: number) => (
                            <tr key={index}>
                              <td scope="row">{(index + 1)}</td>
                              <td scope="row">{tag.tag_name}</td>
                              <td scope="row">{tag.created_at}</td>
                              <td scope="row">
                                <div className=" btn-actions">
                                  <a
                                    href={void (0)}
                                    onClick={() => toggleEditModal(tag)}
                                  >
                                    <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                          : (<td colSpan={3}>No Product Tag Available</td>)
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
        <ModalHeader toggle={toggleAddModal}>Add New Product Tag</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={addProductTag}
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
                      placeholder="Tag name"
                      type="text"
                      autoComplete="new-group-name"
                      value={values.tag_name}
                      onChange={handleChange('tag_name')}
                      onBlur={handleBlur('tag_name')}
                    />

                  </InputGroup>
                </FormGroup>
                {touched.tag_name && errors.tag_name && (
                  <>
                    <MsgText
                      text={errors.tag_name}
                      textColor="danger"
                    />
                    <br />
                  </>
                )}
                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {
                      savingProductTag ?
                        ("Loading...") :
                        ("Save Tag")
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
        <ModalHeader toggle={() => toggleEditModal()}>Edit Product Tag {viewedProductTag?.tag_name}</ModalHeader>
        <ModalBody>
          {
            viewedProductTag ? (
              <Formik
                enableReinitialize
                initialValues={viewedProductTag}
                onSubmit={editProductTag}
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
                          placeholder="Tag name"
                          type="text"
                          autoComplete="new-group-name"
                          value={values.tag_name}
                          onChange={handleChange('tag_name')}
                          onBlur={handleBlur('tag_name')}
                        />

                      </InputGroup>
                    </FormGroup>
                    {touched.tag_name && errors.tag_name && (
                      <>
                        <MsgText
                          text={errors.tag_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingProductTag ?
                            ("Loading...") :
                            ("Update Tag")
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

ProductTags.layout = Admin;

export default ProductTags;