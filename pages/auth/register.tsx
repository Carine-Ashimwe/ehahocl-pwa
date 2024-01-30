/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Image from 'next/image';
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row
} from 'reactstrap';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import axios from '../../helpers/axios';
import { IUser } from '../../interfaces';
import { AddUser } from '../api/user';


function Register() {
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
    role: 'vendor',
    active: '',
    approved: '',
    user: ''
  };

  const [savingUser, setSavingUser] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUserImage, setPreviewUserImage] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');

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
    axios
      .post('/image_upload', formData, options)
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
  // End of images handlers

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

  // All Validations
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

  // Mutation For Adding a User
  const createMutation = useMutation(AddUser);

  const handleAddUser = async (payload: IUser) => {
    payload.role = "vendor";
    payload.register_platform = "Web";
    payload.user_picture = userImage;

    setSavingUser(true);
    const newUser = await createMutation.mutateAsync({ ...payload })
    if (newUser) {
      setSavingUser(false);
      if (newUser.status) {
        setSuccessMsg("Account created successfully! You will have to complete your profile by providing location details and business information in the next steps!");
        localStorage.setItem('user', JSON.stringify(newUser.user));
        localStorage.setItem('access_token', newUser.token ? newUser.token : '');
        setTimeout(() => { Router.push("/auth/address") }, 3000);
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

  return <>
    <ToastContainer />
    <div className="main-content auth-container">
      <div className="auth-description">
        <h1 className="text-grey my-4">Welcome to eHaho!</h1>
        <h4 className="text-grey font-weight-normal">
          Create an account eHaho and Sell or purchase easily agriculture products
          (Fresh produce, Manufatured produce and Farm Inputs)<br /> Get your business to another level.
          Don&#39;t wait tomorrow, the time is now!.
        </h4>
        <h4 className="text-grey font-weight-normal">
          Already have an account? <Link href="/auth/login" className="color-primary ml-1">Login</Link>
        </h4>
      </div>
      <div className="auth-form">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Register on eHaho</small>
            </div>
            <div className="btn-wrapper text-center">
              <img src="/img/brand/ehaho-logo.png" alt="ehaho-logo" width="100" height="110" />
              {/* <Image style={{ textAlign: 'center' }} className="navbar-brand-img" src="/img/brand/ehaho-logo.png" alt="ehaho-logo" width="100" height="110" /> */}
            </div>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={handleAddUser}
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
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">

                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>

                      <Input
                        placeholder="First Name"
                        type="text"
                        value={values.first_name}
                        onChange={handleChange('first_name')}
                        onBlur={handleBlur('first_name')}
                        autoComplete={`${true}`} />
                    </InputGroup>
                  </FormGroup>
                  {touched.first_name && errors.first_name && (
                    <MsgText
                      text={errors.first_name}
                      textColor="danger"
                    />
                  )}

                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">

                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>

                      <Input
                        placeholder="Last Name"
                        type="text"
                        value={values.last_name}
                        onChange={handleChange('last_name')}
                        onBlur={handleBlur('last_name')}
                        autoComplete={`${true}`} />
                    </InputGroup>
                  </FormGroup>
                  {touched.last_name && errors.last_name && (
                    <MsgText
                      text={errors.last_name}
                      textColor="danger"
                    />
                  )}
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

                  <FormGroup>
                    <InputGroup className="input-group-alternative">

                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>

                      <Input
                        placeholder="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        autoComplete={`${true}`} />

                    </InputGroup>
                  </FormGroup>
                  {touched.email && errors.email && (
                    <MsgText
                      text={errors.email}
                      textColor="danger"
                    />
                  )}
                  <FormGroup>
                    <InputGroup className="input-group-alternative">

                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>

                      <Input
                        placeholder="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                        autoComplete={`${true}`} />
                    </InputGroup>
                  </FormGroup>
                  {touched.password && errors.password && (
                    <MsgText
                      text={errors.password}
                      textColor="danger"
                    />
                  )}

                  <FormGroup>
                    <InputGroup className="input-group-alternative">

                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>

                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={values.password_confirmation}
                        onChange={handleChange('password_confirmation')}
                      />
                    </InputGroup>
                  </FormGroup>
                  {touched.password_confirmation && errors.password_confirmation && (
                    <MsgText
                      text={errors.password_confirmation}
                      textColor="danger"
                    />
                  )}
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
                      {savingUser ? ("Registering Account...") : ("Next")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center">Already have an account? <Link href="/auth/login" className="color-primary">Login</Link></div>
          </CardBody>
        </Card>
      </div>
    </div>
  </>;
}

export default Register;
