/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
import DataEnteries from '../../components/Pagination/dataSize';
import TablePagination from '../../components/Pagination/pagination';
import axios from '../../helpers/axios';
import { IUser } from '../../interfaces';
import Admin from '../../layouts/Admin';
import { AddUser, GetUserProfiles, UpdateUser, approveProfile, deleteProfile, disableProfile, disapproveProfile, enableProfile } from '../api/user';
// layout for this page

// core components


const Users = () => {

  let initialValues: IUser = {
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    register_platform: 'Web',
    user_picture: '',
    role: '',
    active: '',
    approved: '',
    user: ''
  };


  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [addErrorMsg, setAddErrorMsg] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<IUser>();
  const [previewUserImage, setPreviewUserImage] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [updatingUser, setUpdatingUser] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1);
  const [dataSize, setDataSize] = useState(10);

  useEffect(() => {
    // Trigger a fetch when the component mounts
    refetch();
  }, []);

  let get_payload = {
    paginate: true,
    page: page,
    dataSize: dataSize
  };

  const shouldEnableQuery = 'business_id' in get_payload;

  const { isLoading, isError, error, isSuccess, data, isFetching, refetch } = useQuery<any, Error>(
    ["Users"],
    () => GetUserProfiles(get_payload),
    { enabled: shouldEnableQuery }
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

  const notify = (msg_type: string) => {
    if (msg_type === 'success')
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
    if (msg_type === 'error')
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
    setSuccessMsg("");
    setErrorMsg("");
  }

  // Image handlers
  const onSelectFile = (event: any) => {
    const selectedFile = event.target.files[0];
    const image = URL.createObjectURL(selectedFile);

    setPreviewUserImage(image);
    // FOR BUG IN CHROME
    event.target.value = "";

    // Upload on the server
    const formData = new FormData();
    formData.append('user_picture', selectedFile);
    formData.append('upload_type', 'single');
    formData.append('storage', 'images/users');
    formData.append('value_name', 'user_picture');

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
    axios.post('/image_upload', formData, options)
      .then((res: any) => {
        if (res.data.status) {
          setUserImage(res.data.message);
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

  function deleteHandler(image: string) {
    setPreviewUserImage('');
    setUserImage('');
    URL.revokeObjectURL(image);
  }
  // End of image handlers

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
    first_name: Yup.string().trim().required().label('First name'),
    last_name: Yup.string().trim().required().label('Last name'),
    gender: Yup.string().trim().required().label('Gender'),
    email: Yup.string().email('Invalid email').trim().label('Email'),
    phone: Yup.string().trim().required().label('Phone'),
    password: Yup.string().trim()
      .required()
      .min(3, 'Password is too short - should be 8 chars minimum.')
      // .matches(
      //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      //   'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      // )
      .label('Password'),
    password_confirmation: Yup.string().trim().required().label('Password Confirmation')
      .when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password need to be the same"
        )
      })
  });

  const createMutation = useMutation(AddUser);
  const updateMutation = useMutation(UpdateUser);

  const handleAddUser = async (payload: IUser) => {
    payload.register_platform = "Web";
    payload.user_picture = userImage;

    setSavingUser(true);
    const newUser = await createMutation.mutateAsync({ ...payload })
    if (newUser) {
      setSavingUser(false);
      if (newUser.status) {
        setSuccessMsg("User registered successfully!");
        // close the modal
        setAddModal(false);
        // refetch data on the table
        refetch();
        // localStorage.setItem('user', JSON.stringify(newUser.user));
        // localStorage.setItem('access_token', newUser.token?newUser.token:'');
        // setTimeout(()=>{Router.push("/auth/address")}, 3000);
      }
      else {
        setErrorMsg(newUser.message);
      }
    }
    if (createMutation.isError) {
      setSavingUser(false);
      setErrorMsg("Something went wrong! try again");
    }
  }

  const editUser = async (payload: IUser) => {
    console.log(payload);
    if (updatingUser) {
      return
    }
    setUpdatingUser(true);
    setEditErrorMsg("");
    const updateUser = await updateMutation.mutateAsync({ ...payload });
    refetch();
    setUpdatingUser(false);

    // Handle result from API
    console.log(updateUser);

    //Close the edit modal
    setEditModal(false);

    // Notify the user
    setSuccessMsg("User updated successfully");
  }


  useEffect(() => {
    if (isError) {
      notify('error')
    }
  }, [isError])


  const toggleAddModal = () => {
    setAddModal(!addModal);
  }

  const toggleEditModal = (profile: IUser | undefined = undefined) => {
    if (profile != undefined) {
      // Am adding the password field to the profile object
      const profileWithPassword = {
        ...profile,
        password: '',
      };
      setViewedUser(profileWithPassword);
    }
    setEditModal(!editModal);
  }

  const disableProfileHandler = async (profileId: number | undefined) => {
    if (!profileId) {
      setErrorMsg("Profile ID is missing!");
      return;
    }

    const response = await disableProfile({ id: profileId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Profile disabled successfully");
        await refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };

  const enableProfileHandler = async (profileId: number | undefined) => {
    if (!profileId) {
      setErrorMsg("Profile ID is missing!");
      return;
    }

    const response = await enableProfile({ id: profileId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Profile restored successfully");
        await refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };

  const approveProfileHandler = async (profileId: number | undefined) => {
    if (!profileId) {
      setErrorMsg("Profile ID is missing!");
      return;
    }

    const response = await approveProfile({ id: profileId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Profile approved successfully");
        await refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };

  const disapproveProfileHandler = async (profileId: number | undefined) => {
    if (!profileId) {
      setErrorMsg("Profile ID is missing!");
      return;
    }

    const response = await disapproveProfile({ id: profileId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Profile disapproved successfully");
        refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };

  const deleteProfileHandler = async (profileId: number | undefined) => {
    if (!profileId) {
      setErrorMsg("Profile ID is missing!");
      return;
    }

    const response = await deleteProfile({ id: profileId });

    if (response) {
      if (response.status) {
        setSuccessMsg("Profile deleted successfully");
        await refetch();
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Something went wrong!");
    }
  };  


  return (
    <>
      <ToastContainer />
      <PageHeader page="Users" />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Users</h3>
                  </div>
                  show <span className='ml-3 mr-3'><DataEnteries setDataSize={setDataSize} refetch={refetch} /></span> entries
                  <div className="col text-right">
                    <Button
                      className='bg-success text-white'
                      href="#pablo"
                      onClick={toggleAddModal}
                      size="sm"
                    >
                      REGISTER A NEW USER
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Full name</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Active</th>
                    <th scope="col">Approved</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetching || isLoading ? (
                    <tr>
                      <td colSpan={5}>Loading available user profiles...</td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={5}>{error.message}</td>
                    </tr>
                  ) : isSuccess && data[0].length > 0 ? (
                    data[0].map((profile: IUser, index: number) => (
                      <tr key={index}>
                        <td scope="row">{index + 1}</td>
                        <td scope="row">{`${profile.first_name} ${profile.last_name}`}</td>
                        <td scope="row">{profile.gender}</td>
                        <td scope="row">{profile.active}</td>
                        <td scope="row">{profile.approved}</td>
                        <td scope="row">{profile.created_at}</td>
                        <td scope="row">
                          <div className="btn-actions">
                            <a href={void 0} onClick={() => toggleEditModal(profile)}>
                              <i className="fas fa-pencil text-success mr-1 ml-1"></i>
                            </a>
                            {profile.active == "Yes" ? (
                              <a href={void 0} onClick={() => disableProfileHandler(profile.user_id)}>
                                <i className="fas fa-ban text-danger mr-1 ml-1" title="De-activate"></i>
                              </a>
                            ) : (
                              <a href={void 0} onClick={() => enableProfileHandler(profile.user_id)}>
                                <i className="fas fa-check-circle text-success mr-1 ml-1" title="Activate"></i>
                              </a>
                            )}
                            {profile.approved == "Yes" ? (
                              <a href={void 0} onClick={() => disapproveProfileHandler(profile.user_id)}>
                                <i className="fas fa-times text-danger mr-1 ml-1" title="Disapprove"></i>
                              </a>
                            ) : (
                              <a href={void 0} onClick={() => approveProfileHandler(profile.user_id)}>
                                <i className="fas fa-check text-success mr-1 ml-1" title="Approve"></i>
                              </a>
                            )}
                            {/* <a href={void 0} onClick={() => deleteProfileHandler(profile.id)}>
                              <i className="fas fa-trash-alt text-danger mr-1 ml-1" title="Delete"></i>
                            </a> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No user profiles available</td>
                    </tr>
                  )}
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


      {/* Add new user */}

      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true} size="lg">
        <ModalHeader toggle={toggleAddModal}>Register New User</ModalHeader>
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleAddUser}
          // validationSchema={FormValidationSchema}
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
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-single-02" />
                        </InputGroupText>
                        <Input
                          placeholder="First Name"
                          type="text"
                          autoComplete="new-first-name"
                          value={values.first_name}
                          onChange={handleChange('first_name')}
                          onBlur={handleBlur('first_name')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.first_name && errors.first_name && (
                      <>
                        <MsgText
                          text={errors.first_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-single-02" />
                        </InputGroupText>
                        <Input
                          placeholder="Last Name"
                          type="text"
                          autoComplete="new-last-name"
                          value={values.last_name}
                          onChange={handleChange('last_name')}
                          onBlur={handleBlur('last_name')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.last_name && errors.last_name && (
                      <>
                        <MsgText
                          text={errors.last_name}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                        <Input
                          placeholder="Email Address"
                          type="email"
                          autoComplete="new-email"
                          value={values.email}
                          onChange={handleChange('email')}
                          onBlur={handleBlur('email')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.email && errors.email && (
                      <>
                        <MsgText
                          text={errors.email}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-phone" />
                        </InputGroupText>

                        <Input
                          placeholder="Phone"
                          type="text"
                          value={values.phone}
                          onChange={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          autoComplete={`${true}`} />
                      </InputGroup>
                    </FormGroup>
                    {touched.phone && errors.phone && (
                      <MsgText
                        text={errors.phone}
                        textColor="danger"
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                        <Input
                          placeholder="Password"
                          type="password"
                          autoComplete="new-password"
                          value={values.password}
                          onChange={handleChange('password')}
                          onBlur={handleBlur('password')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.password && errors.password && (
                      <>
                        <MsgText
                          text={errors.password}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          autoComplete="new-password-confirmation"
                          value={values.password_confirmation}
                          onChange={handleChange('password_confirmation')}
                          onBlur={handleBlur('password_confirmation')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.password_confirmation && errors.password_confirmation && (
                      <MsgText
                        text={errors.password_confirmation}
                        textColor="danger"
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-single-02" />
                        </InputGroupText>
                        <select
                          className="custom-select"
                          value={values.role}
                          onChange={handleChange("role")}
                          onBlur={handleBlur('role')}
                        >
                          <option value="" disabled>
                            Select User&apos;s Type
                          </option>
                          <option value="admin">Admin</option>
                          <option value="client">Client</option>
                          <option value="vendor">Vendor</option>
                        </select>
                      </InputGroup>
                    </FormGroup>
                    {touched.role && errors.role && (
                      <MsgText
                        text={errors.role}
                        textColor="danger"
                      />
                    )}
                  </Col>
                  <Col md='6'>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-venus-mars" />
                        </InputGroupText>

                        <select
                          className="custom-select"
                          value={values.gender}
                          onChange={handleChange("gender")}
                          onBlur={handleBlur('gender')}
                        >
                          <option defaultValue="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>

                      </InputGroup>
                    </FormGroup>
                    {touched.gender && errors.gender && (
                      <MsgText
                        text={errors.gender}
                        textColor="danger"
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xl={12} className='upload_image'>
                    <Label>User profile image</Label>
                    <section>
                      <div className="images">
                        {
                          !previewUserImage || previewUserImage == '' ? (
                            <>
                              <label className='image'>
                                + Add Image
                                <br />
                                <span>This is optional</span>
                                <Input
                                  name="user_picture"
                                  placeholder="user_picture"
                                  type="file"
                                  accept="image/png, image/jpeg, image/webp"
                                  autoComplete="user-picture"
                                  onChange={(event: any) => {
                                    onSelectFile(event);
                                  }}
                                />
                              </label>
                              <p className="error">
                                <span>
                                  Profile is not set!
                                </span><br />
                                It&#39;s optional. You can leave it to set it later.
                              </p>
                            </>
                          )
                            : (
                              <div className="image">
                                <img src={previewUserImage} height="150" alt="user image" />
                                <button onClick={() => deleteHandler(previewUserImage)}>
                                  <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                </button>
                                <p>Profile</p>
                              </div>
                            )
                        }
                      </div>
                    </section>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button className="my-4 w-100 bg-success text-white" type="submit">
                    {savingUser ? ("Registering...") : ("Register")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

      {/* Edit existing user */}
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={() => toggleEditModal()}>Edit User {viewedUser?.first_name}</ModalHeader>
        <ModalBody>
          {
            viewedUser ? (
              <Formik
                enableReinitialize
                initialValues={viewedUser}
                onSubmit={editUser}
              // validationSchema={FormValidationSchema}
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
                      <Col md="6">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-single-02" />
                            </InputGroupText>
                            <Input
                              placeholder="First Name"
                              type="text"
                              autoComplete="new-first-name"
                              value={values.first_name}
                              onChange={handleChange('first_name')}
                              onBlur={handleBlur('first_name')}
                            />
                          </InputGroup>
                        </FormGroup>
                        {touched.first_name && errors.first_name && (
                          <>
                            <MsgText
                              text={errors.first_name}
                              textColor="danger"
                            />
                            <br />
                          </>
                        )}
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-single-02" />
                            </InputGroupText>
                            <Input
                              placeholder="Last Name"
                              type="text"
                              autoComplete="new-last-name"
                              value={values.last_name}
                              onChange={handleChange('last_name')}
                              onBlur={handleBlur('last_name')}
                            />
                          </InputGroup>
                        </FormGroup>
                        {touched.last_name && errors.last_name && (
                          <>
                            <MsgText
                              text={errors.last_name}
                              textColor="danger"
                            />
                            <br />
                          </>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                            <Input
                              placeholder="Email Address"
                              type="email"
                              autoComplete="new-email"
                              value={values.user.email}
                              onChange={handleChange('email')}
                              onBlur={handleBlur('email')}
                            />
                          </InputGroup>
                        </FormGroup>
                        {touched.email && errors.email && (
                          <>
                            <MsgText
                              text={errors.email}
                              textColor="danger"
                            />
                            <br />
                          </>
                        )}
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">

                            <InputGroupText>
                              <i className="fas fa-phone" />
                            </InputGroupText>

                            <Input
                              placeholder="Phone"
                              type="text"
                              value={values.user.phone}
                              onChange={handleChange('phone')}
                              onBlur={handleBlur('phone')}
                              autoComplete={`${true}`} />
                          </InputGroup>
                        </FormGroup>
                        {touched.phone && errors.phone && (
                          <MsgText
                            text={errors.phone}
                            textColor="danger"
                          />
                        )}
                      </Col>
                    </Row>

                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                        <Input
                          placeholder="Password"
                          type="password"
                          autoComplete="new-password"
                          value={values.password}
                          onChange={handleChange('password')}
                          onBlur={handleBlur('password')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.password && errors.password && (
                      <>
                        <MsgText
                          text={errors.password}
                          textColor="danger"
                        />
                        <br />
                      </>
                    )}

                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          updatingUser ?
                            ("Loading...") :
                            ("Update User")
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

Users.layout = Admin;

export default Users;