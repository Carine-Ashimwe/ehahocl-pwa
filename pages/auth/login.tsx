/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik } from 'formik';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { ToastContainer, toast } from 'react-toastify';
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
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import axios from '../../helpers/axios';
import { ILogin } from '../../interfaces';


function Login() {
  let initialValues = {
    phoneoremail: '',
    password: '',
  };

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; label: string; dialCode: string } | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  const sendNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options = {
        body: 'Connecting farmers to buyers!!',
        icon: '/icon-192x192.png',
      };

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Welcome to eHaho', options);
      });
    }
  };

  const notify = (msg_type: string) => {
    if (msg_type === 'error') {
      toast.error(errorMsg, {
        position: 'top-right',
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
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  };

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      console.log('Notification permission:', permission);
      // Assuming you want to send a notification when the login is successful
      if (permission === 'granted') {
        sendNotification();
      }
    });
    const getIPInfo = async () => {
      try {
        const ipInfo = await axios.get(`https://ipinfo.io?token=5a5487f0ef1022`);
        const { city, country, ip } = ipInfo.data;

        // TS error handle [countryMapping]
        type CountryMapping = { [key: string]: { code: string; label: string; dialCode: string } };

        // Mapping of country codes with full names and dial codes
        const countryMapping: CountryMapping = {
          RW: { code: 'RW', label: 'Rwanda', dialCode: '25' },
          BU: { code: 'BU', label: 'Burundi', dialCode: '257' },
          KE: { code: 'KE', label: 'Kenya', dialCode: '254' },
          TZ: { code: 'TZ', label: 'Tanzania', dialCode: '255' },
          UG: { code: 'UG', label: 'Uganda', dialCode: '256' },
          SS: { code: 'SS', label: 'South Sudan', dialCode: '211' }
        };

        // Setting the selected country in the state
        setSelectedCountry(countryMapping[country] || null);

        setIpAddress(ip);
      } catch (error) {
        console.error('Error fetching IP information:', error);
      }
    };

    getIPInfo();
  }, []);



  const countriesInEAC = [
    { code: 'BI', label: 'Burundi', dialCode: '257' },
    { code: 'KE', label: 'Kenya', dialCode: '254' },
    { code: 'RW', label: 'Rwanda', dialCode: '25' },
    { code: 'SS', label: 'South Sudan', dialCode: '211' },
    { code: 'TZ', label: 'Tanzania', dialCode: '255' },
    { code: 'UG', label: 'Uganda', dialCode: '256' },
  ];

  useEffect(() => {
    if (selectedCountry === null && ipAddress) {
      const userCountryOption = countriesInEAC.find(country => country.label === ipAddress) || null;
      setSelectedCountry(userCountryOption);
    }
  }, [selectedCountry, ipAddress]);

  useEffect(() => {
    if (successMsg) {
      notify('success');
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      notify('error');
    }
  }, [errorMsg]);

  const FormValidationSchema = Yup.object().shape({
    phoneoremail: Yup.string().trim().required().label('Phone / Email'),
    password: Yup.string().trim().required().label('Password'),
  });

  const handleLogin = async (payload: ILogin) => {
    const credentials = {
      phoneoremail: payload.phoneoremail,
      password: payload.password,
    };

    // Check if it's a phone number
    const containsOnlyDigits = /^\d+$/.test(payload.phoneoremail);

    // If phone no, concatenate the country's dial code 
    if (selectedCountry && containsOnlyDigits) {
      const phoneNumberWithDialCode = `${selectedCountry.dialCode}${payload.phoneoremail}`;
      credentials.phoneoremail = phoneNumberWithDialCode;
    }

    console.log("Modified Payload:", credentials);


    if (isLoading) {
      return
    }

    setIsLoading(true);
    setErrorMsg("");
    return await axios.post('/login', credentials)
      .then((res) => {
        setIsLoading(false);
        if (res.data.status) {
          setSuccessMsg("Authorisation granted");

          if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('Login Successful', {
                body: 'You have successfully logged in.',
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png ',
              });
            });
          }
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('access_token', res.data.token);
          if (res.data.user.role == 'admin') {
            setTimeout(() => { window.location.href = "/admin/dashboard" }, 3000);
          }
          else if (res.data.user.role == 'vendor') {
            if (res.data.user.profile.country == '' || res.data.user.profile.country == null) {
              setTimeout(() => { window.location.href = "/auth/address" }, 3000);
              return;
            }
            else if (res.data.user.businesses.length < 1) {
              setTimeout(() => { window.location.href = "/auth/create-shop" }, 3000);
              return;
            }
            else {
              if (res.data.user.businesses[0].user_sector.sector_id == 1) {
                setTimeout(() => { window.location.href = "/farmer/dashboard" }, 3000);
              }
              else if (res.data.user.businesses[0].user_sector.sector_id == 5) {
                setTimeout(() => { window.location.href = "/delivery/dashboard" }, 3000);
              }
              else {
                setTimeout(() => { window.location.href = "/vendor/dashboard" }, 3000);
              }
            }
          }
          else {
            setTimeout(() => { window.location.href = "/client/dashboard" }, 3000);
          }
        }
        else {
          setErrorMsg(res.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error.response?.data?.message);
        const errorMessage = error.response?.data?.message;
        setErrorMsg(errorMessage || error.message);
      })
  }

  return (
    <>
      <ToastContainer />
      <div className="main-content auth-container">
        <div className="auth-description">
          <h1 className="text-grey my-4">{greetings('dear')}</h1>
          <h4 className="text-grey font-weight-normal">
            Welcome to eHaho! Login for further steps!
            Enjoy the first e-commerce platform in Africa
          </h4>
          <h4 className="text-grey font-weight-normal">
            Don't have an account?
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
              <Formik
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
                }) => (
                  <Form role="form" method="post" onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                      <FormControl fullWidth>
                        <InputLabel id="selectCountryLabel">Your Location:</InputLabel>
                        <Select
                          labelId="selectCountryLabel"
                          id="selectCountry"
                          value={selectedCountry ? selectedCountry.code : ''}
                          onChange={(event) => {
                            const selectedValue = event.target.value;
                            const selectedOption = countriesInEAC.find((country) => country.code === selectedValue) || null;
                            setSelectedCountry(selectedOption as { code: string; label: string; dialCode: string } | null);
                          }}
                          label="Your Location"
                          sx={{ textTransform: 'uppercase' }}
                        >
                          {countriesInEAC.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                              <ReactCountryFlag
                                countryCode={country.code}
                                svg
                                style={{
                                  marginRight: '8px',
                                  width: '1.5em',
                                  height: '1.5em',
                                }}
                              />
                              {country.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                        <Input
                          placeholder="Phone or Email"
                          type="text"
                          autoComplete="new-email"
                          value={values.phoneoremail}
                          onChange={handleChange('phoneoremail')}
                          onBlur={handleBlur('phoneoremail')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.phoneoremail && errors.phoneoremail && (
                      <MsgText
                        text={errors.phoneoremail}
                        textColor="danger"
                      />
                    )}
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupText>
                          <i className="ni ni-key-25" />
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
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckLogin"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckLogin"
                      >
                        <span className="text-muted">Remember me</span>
                      </label>
                    </div>
                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {isLoading ? 'Logging in...' : 'Log in'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center">Don't have an account? <Link href="/auth/register" className="color-primary">Sign up</Link></div>
              <div className="text-center"><Link href="/auth/forgotPwdEmail" className="color-primary">Forgot password?</Link></div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
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

export default Login;