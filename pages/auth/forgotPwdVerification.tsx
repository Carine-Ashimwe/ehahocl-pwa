/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from 'formik';
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Router from "next/router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText
} from 'reactstrap';
// import * as Yup from 'yup';
// import { MsgText } from '../../components/Common/MsgText';
import axios from '../../helpers/axios';
import { setInterval } from 'timers/promises';
// import { ILogin } from '../../interfaces';

function ForgotPwdVerification() {    
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [verificationCode, setVerificationCode] = useState(0);
    const [totalTime, setTotaltime] = useState(120);
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

    const checkCode = async () => {

        const code = Number(localStorage.getItem('verificationCode'))
        if(code == verificationCode){            
            setSuccessMsg("Successfully verified code")
            localStorage.removeItem('verificationCode')
            setTimeout(()=>{Router.push("/auth/forgotPassword")}, 3000);
        }else{
            setErrorMsg("The verification code is incorrect")
        }
        // const data = {
        //     email:email,
        //     verification_code : verificationCode
        // }
        // axios
        //     .post('send_email',data)
        //     .then((res) => {
        //         if(res.data.status){
        //         localStorage.setItem('userId', res.data.id)
        //         }else{
        //             setErrorMsg(res.data.message)
        //         }
        //         // return res.data;
        //       })
        //       .catch((error) => {
        //         console.error(error.response?.data?.message);
        //         throw new Error(error.response?.data?.message);
        //       });
    }

    // const FormValidationSchema = Yup.object().shape({
    //     phoneoremail: Yup.string().trim().required().label('Phone / Email'),
    //     password: Yup.string().trim().required().label('Password'),
    // });

    // const handleLogin = async (payload: ILogin) => {
    //     const credentials = {
    //         phoneoremail: payload.phoneoremail,
    //         password: payload.password,
    //     }

    //     if (isLoading) {
    //         return
    //     }

    //     setIsLoading(true);
    //     setErrorMsg("");
    //     return await axios.post('/login', credentials)
    //         .then((res) => {
    //             setIsLoading(false);
    //             if (res.data.status) {
    //                 setSuccessMsg("Authorisation granted");
    //                 localStorage.setItem('user', JSON.stringify(res.data.user));
    //                 localStorage.setItem('access_token', res.data.token);
    //                 if (res.data.user.role == 'admin') {
    //                     setTimeout(() => { window.location.href = "/admin/dashboard" }, 3000);
    //                 }
    //                 else if (res.data.user.role == 'vendor') {
    //                     if (res.data.user.profile.country == '' || res.data.user.profile.country == null) {
    //                         setTimeout(() => { window.location.href = "/auth/address" }, 3000);
    //                         return;
    //                     }
    //                     else if (res.data.user.businesses.length < 1) {
    //                         setTimeout(() => { window.location.href = "/auth/create-shop" }, 3000);
    //                         return;
    //                     }
    //                     else {
    //                         if (res.data.user.businesses[0].user_sector.sector_id == 1) {
    //                             setTimeout(() => { window.location.href = "/farmer/dashboard" }, 3000);
    //                         }
    //                         else if (res.data.user.businesses[0].user_sector.sector_id == 4) {
    //                             setTimeout(() => { window.location.href = "/delivery/dashboard" }, 3000);
    //                         }
    //                         else {
    //                             setTimeout(() => { window.location.href = "/vendor/dashboard" }, 3000);
    //                         }
    //                     }
    //                 }
    //                 else {
    //                     setTimeout(() => { window.location.href = "/client/dashboard" }, 3000);
    //                 }
    //             }
    //             else {
    //                 setErrorMsg(res.data.message);
    //             }
    //         })
    //         .catch((error) => {
    //             setIsLoading(false);
    //             console.error(error.response?.data?.message);
    //             const errorMessage = error.response?.data?.message;
    //             setErrorMsg(errorMessage || error.message);
    //         })
    // }
    return <>
        <ToastContainer />
        <div className="main-content auth-container">
            <div className="auth-description">
                <h1 className="text-grey my-4">{greetings('dear')}</h1>
                <h4 className="text-grey font-weight-normal">
                    Welcome to  eHaho! Login for further steps!
                    Enjoy the first e-commerce platform in Africa
                </h4>
                <h4 className="text-grey font-weight-normal">
                    Don&#39;t have an account?
                    <Link href="/auth/register" className="color-primary ml-1">Sign Up</Link>
                </h4>
            </div>
            <div className="auth-form">
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent">
                        <div className="text-muted text-center mt-2 mb-3">
                            <small>Sign in to eHaho</small>
                        </div>
                        <div className="btn-wrapper text-center">
                            <img src="/img/brand/ehaho-logo.png" alt="ehaho-logo" width="100" height="110" />
                            {/* <Image style={{ textAlign: 'center' }} className="navbar-brand-img" src="/img/brand/ehaho-logo.png" alt="ehaho-logo" width="100" height="110" /> */}
                        </div>
                        {/* <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            onSubmit={handleLogin}
                            validationSchema={FormValidationSchema}
                        >
                            {({
                                values,
                                handleChange,
                                handleSubmit,
                                touched,
                                handleBlur,
                                errors,
                            }) => ( */}
                                <Form role="form" method="post">
                                    <FormGroup className="mb-3">
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupText>
                                                <i className="ni ni-email-83" />
                                            </InputGroupText>
                                            <Input
                                                placeholder="Verification code"
                                                type="number"
                                                autoComplete="new-email"
                                                value={verificationCode}
                                                onChange={(e)=>setVerificationCode(Number(e.target.value))}
                                            />

                                        </InputGroup>

                                    </FormGroup>                                                                                                                                                                                            
                                    <div className="text-center">
                                        <Button className="my-4 w-100 bg-success text-white" onClick={()=>{checkCode()}}>
                                           Next
                                        </Button>
                                    </div>
                                </Form>
                            {/* )}</Formik> */}

                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center">Don&#39;t have an account? <Link href="/auth/register" className="color-primary">Sign up</Link></div>
                    </CardBody>
                </Card>
            </div>
        </div>
    </>;
}

function greetings(name: any) {
    var day = new Date();
    var hr = day.getHours();
    if (hr >= 0 && hr < 12) {
        return "Good morning " + name + "!";
    }
    else if (hr == 12) {
        return "Good noon " + name + "!";
    }
    else if (hr >= 12 && hr <= 17) {
        return "Good afternoon " + name + "!";
    }
    else {
        return "Good evening " + name + "!";
    }
}

export default ForgotPwdVerification;
