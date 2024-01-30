// reactstrap components
import {
  Button,
  Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row
} from "reactstrap";
// core components
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../helpers/axios';
import { ILocation, IProfile, IShop } from '../../interfaces';
import { UpdateBusiness, UpdatePassword, UpdateUser, UpdateUserInfo } from '../../pages/api/user';
import UserHeader from '../Headers/UserHeader';


const Profile = (props: any) => {
  const Business = JSON.parse(props.business)
  const [user_id, setUserId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewUserImage, setPreviewUserImage] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  const [country, setCountry] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState("");
  const [provincesErrorMsg, setProvincesErrorMsg] = useState("");
  const [isProvincesLoading, setIsProvincesLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [districtsErrorMsg, setDistrictsErrorMsg] = useState("");
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);

  const [sectors, setSectors] = useState([]);
  const [sector, setSector] = useState("");
  const [sectorsErrorMsg, setSectorsErrorMsg] = useState("");
  const [isSectorsLoading, setIsSectorsLoading] = useState(false);

  const [cells, setCells] = useState([]);
  const [cell, setCell] = useState("");
  const [cellsErrorMsg, setCellsErrorMsg] = useState("");
  const [isCellsLoading, setIsCellsLoading] = useState(false);

  const [villages, setVillages] = useState([]);
  const [village, setVillage] = useState("");
  const [villagesErrorMsg, setVillagesErrorMsg] = useState("");
  const [isVillagesLoading, setIsVillagesLoading] = useState(false);

  const [commonPlace, setCommon_place] = useState("");
  const [streetNumber, setStreetNumber] = useState("");

  const [address_1, setAddress1] = useState("");
  const [address_2, setAddress2] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip_code, setZipCode] = useState("");

  const [business_name, setBusinessName] = useState("");
  const [business_phone, setBusinessPhone] = useState("");
  const [business_email, setBusinessEmail] = useState("");
  const [business_country, setBusinessCountry] = useState("");
  const [business_provinces, setBusinessProvinces] = useState([]);
  const [business_province, setBusinessProvince] = useState("");
  const [business_provincesErrorMsg, setBusinessProvincesErrorMsg] = useState("");
  const [business_isProvincesLoading, setBusinessIsProvincesLoading] = useState(false);

  const [business_districts, setBusinessDistricts] = useState([]);
  const [business_district, setBusinessDistrict] = useState("");
  const [business_districtsErrorMsg, setBusinessDistrictsErrorMsg] = useState("");
  const [business_isDistrictsLoading, setBusinessIsDistrictsLoading] = useState(false);

  const [business_sectors, setBusinessSectors] = useState([]);
  const [business_sector, setBusinessSector] = useState("");
  const [business_sectorsErrorMsg, setBusinessSectorsErrorMsg] = useState("");
  const [business_isSectorsLoading, setBusinessIsSectorsLoading] = useState(false);

  const [business_cells, setBusinessCells] = useState([]);
  const [business_cell, setBusinessCell] = useState("");
  const [business_cellsErrorMsg, setBusinessCellsErrorMsg] = useState("");
  const [business_isCellsLoading, setBusinessIsCellsLoading] = useState(false);

  const [business_villages, setBusinessVillages] = useState([]);
  const [business_village, setBusinessVillage] = useState("");
  const [business_villagesErrorMsg, setBusinessVillagesErrorMsg] = useState("");
  const [business_isVillagesLoading, setBusinessIsVillagesLoading] = useState(false);

  const [business_commonPlace, setBusinessCommon_place] = useState("");
  const [business_streetNumber, setBusinessStreetNumber] = useState("");

  const [business_address_1, setBusinessAddress1] = useState("");
  const [business_address_2, setBusinessAddress2] = useState("");
  const [business_state, setBusinessState] = useState("");
  const [business_city, setBusinessCity] = useState("");
  const [business_zip_code, setBusinessZipCode] = useState("");

  const [previewBusinessLogo, setPreviewBusinessLogo] = useState<string>('');
  const [displayedLogo, setDisplayedLogo] = useState<string>('');
  const [businessLogo, setBusinessLogo] = useState<string>('');
  const [previewBusinessBanner, setPreviewBusinessBanner] = useState<string>('');
  const [businessBanner, setBusinessBanner] = useState<string>('');


  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const updateProfile = useMutation(UpdateUser)
  const updateInfo = useMutation(UpdateUserInfo)
  const updateBusinessMutaion = useMutation(UpdateBusiness)
  const UpdatePasswordMutation = useMutation(UpdatePassword)
  const router = useRouter();

  const notify = (msg_type: string) => {
    if (msg_type === 'error')
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
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
    setSuccessMsg("");
    setErrorMsg("");
  }

  useEffect(() => {
    setUserId(props.user.profile.user_id)
    setFirstName(props.user.profile.first_name)
    setLastName(props.user.profile.last_name)
    setEmail(props.user.email)
    setGender(props.user.profile.gender)
    setUserImage(props.user.profile.user_picture)
    setPhone(props.user.phone)
    setCountry(props.user.profile.country)
    setCommon_place(props.user.profile.common_place)
    setProvince(props.user.profile.province)
    setDistrict(props.user.profile.district)
    setSector(props.user.profile.sector)
    setCell(props.user.profile.cell)
    setVillage(props.user.profile.village)
    setStreetNumber(props.user.profile.street_number)
    setAddress1(props.user.profile.address_1)
    setAddress2(props.user.profile.address_2)
    setState(props.user.profile.state)
    setCity(props.user.profile.city)
    setZipCode(props.user.profile.zip_code)
    if (props.user.role != 'admin') {
      setBusinessName(Business.business_name)
      setBusinessEmail(Business.business_email)
      setBusinessPhone(Business.business_phone)
      setBusinessCountry(Business.country)
      setBusinessCommon_place(Business.common_place)
      setBusinessProvince(Business.province)
      setBusinessDistrict(Business.district)
      setBusinessSector(Business.sector)
      setBusinessCell(Business.cell)
      setBusinessVillage(Business.village)
      setBusinessStreetNumber(Business.street_number)
      setBusinessAddress1(Business.address_1)
      setBusinessAddress2(Business.address_2)
      setBusinessState(Business.state)
      setBusinessCity(Business.city)
      setBusinessZipCode(Business.zip_code)
      setBusinessLogo(Business.business_logo)
      setBusinessBanner(Business.banner_image)
    }
  }, [])

  const onLogoSelectFile = (event: any) => {
    const selectedFile = event.target.files[0];
    const image = URL.createObjectURL(selectedFile);

    setPreviewBusinessLogo(image);
    // FOR BUG IN CHROME
    event.target.value = "";

    // Upload on the server
    const formData = new FormData();
    formData.append('business_logo', selectedFile);
    formData.append('upload_type', 'single');
    formData.append('storage', 'images/business_logos');
    formData.append('value_name', 'business_logo');

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
          setBusinessLogo(res.data.message);
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

  function deleteLogoHandler(image: string) {
    setPreviewBusinessLogo('');
    setBusinessLogo('');
    URL.revokeObjectURL(image);
  }

  //Banner
  const onBannerSelectFile = (event: any) => {
    const selectedFile = event.target.files[0];
    const image = URL.createObjectURL(selectedFile);

    setPreviewBusinessBanner(image);
    // FOR BUG IN CHROME
    event.target.value = "";

    // Upload on the server
    const formData = new FormData();
    formData.append('banner_image', selectedFile);
    formData.append('upload_type', 'single');
    formData.append('storage', 'images/business_banners');
    formData.append('value_name', 'banner_image');

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
          setBusinessBanner(res.data.message);
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

  function deleteBannerHandler(image: string) {
    setPreviewBusinessBanner('');
    setBusinessBanner('');
    URL.revokeObjectURL(image);
  }

  const get_location = (level: string, parent_id: any, setLoad: any, setError: any, setLocations: any) => {
    setLoad(true);
    setError("");
    const payload = { 'model': level, 'parent_id': parent_id };
    axios.post('/locations', payload)
      .then((res) => {
        setLoad(false);
        if (res.data.status) {
          setLocations(res.data.message);
          setError("");
        }
        else {
          setError(res.data.message);
        }
      })
      .catch((error) => {
        setLoad(false);
        const errorMessage = error.response?.data?.message;
        setError(errorMessage || error.message);
      })
  }

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


  const updateUserProfile = async (payload: IProfile) => {
    payload.id = Number(user_id)
    payload.first_name = firstName
    payload.last_name = lastName
    payload.gender = gender
    payload.user_picture = userImage
    payload.country = country
    payload.province = Number(province)
    payload.district = Number(district)
    payload.sector = Number(sector)
    payload.cell = Number(cell)
    payload.village = Number(village)
    payload.street_number = streetNumber
    payload.common_place = commonPlace
    payload.address_1 = address_1
    payload.address_2 = address_2
    payload.state = state
    payload.city = city
    payload.zip_code = zip_code
    const updateProf = await updateProfile.mutateAsync(payload)
    console.log(updateProf)
    const payload2 = {
      id: user_id,
      email: email,
      phone: Number(phone),
    }
    console.log(JSON.stringify(payload2))
    const updateUserinfo = await updateInfo.mutateAsync(payload2)
    // console.log(updateUserinfo)
    localStorage.setItem('user', JSON.stringify(updateUserinfo?.user))

    router.reload()
    setSuccessMsg("User updated successfully");

  }
  const updateBusiness = async (payload: IShop) => {
    payload.id = Number(Business.id)
    payload.user_sector_id = Business.user_sector_id
    payload.user_id = user_id
    payload.business_logo = businessLogo
    payload.banner_image = businessBanner
    payload.business_name = business_name
    payload.business_email = business_email
    payload.business_phone = business_phone
    payload.country = business_country
    payload.province = Number(business_province)
    payload.district = Number(business_district)
    payload.sector = Number(business_sector)
    payload.cell = Number(business_cell)
    payload.village = Number(business_village)
    payload.street_number = business_streetNumber
    payload.common_place = business_commonPlace
    payload.address_1 = business_address_1
    payload.address_2 = business_address_2
    payload.state = business_state
    payload.city = business_city
    payload.zip_code = business_zip_code

    console.log(JSON.stringify(payload))
    const updatedBusiness = await updateBusinessMutaion.mutateAsync(payload)
    localStorage.setItem('active_shop', JSON.stringify(updatedBusiness?.message));
    localStorage.setItem('user', JSON.stringify(updatedBusiness?.user));
    setSuccessMsg("Business created successfully");
    setTimeout(() => {
      router.reload()
    }, 1000);
  }


  useEffect(() => {
    get_location('Province', null, setIsProvincesLoading, setProvincesErrorMsg, setProvinces);
    get_location('Province', null, setBusinessIsProvincesLoading, setBusinessProvincesErrorMsg, setBusinessProvinces);
  }, [])

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

  // const getActualName = async (id: number, type: string) => {
  //   await axios.get(`/get_${type}/${id}`)
  //     .then((res: any) => {
  //       return res.msg.name
  //     })
  // }

  const changePassword = async () => {
    if (confirmPassword != password) {
      setErrorMsg("The password and confirm password do not match")
      return
    }
    const payload = {
      id: Number(user_id),
      password: password,
      current_password: currentPassword,
    }
    console.log(JSON.stringify(payload))
    const updatePwd = await UpdatePasswordMutation.mutateAsync(payload)
    if (updatePwd?.status == true) {
      setSuccessMsg(updatePwd?.message)
    } else {
      setErrorMsg(updatePwd!.message)
    }

  }

  return (
    <>
      <UserHeader user={props.user} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <Image className="rounded-circle" src="/img/theme/team-4-800x800.jpg" alt="me" width="100" height="100" />
                    </a>
                  </div>
                </Col>
              </Row>
              {/* <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader> */}
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading"></span>
                        <span className="description"></span>
                      </div>
                      <div>
                        <div>
                          <span className="heading">{props.user.businesses.length}</span>
                          <span className="description">Businesses</span>
                        </div>
                        <span className="heading"></span>
                        <span className="description"></span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    {props.user.profile.first_name} {props.user.profile.last_name}

                    <span className="font-weight-light">, {props.user.profile.gender}</span>
                    <span className="font-weight-light"> {props.user.email},</span>
                    <span className="font-weight-light"> {props.user.phone}, </span>
                    <span className="font-weight-light">{props.user.profile.country}, </span>
                    {/* <span className="font-weight-light">{getActualName(props.user.profile.province, 'province')}</span>                      */}

                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                  </div>
                  <hr className="my-4" />
                  {props.user.role != 'admin' &&
                    <>
                      <p>
                        Business Name — {Business.business_name},
                        Business Email — {Business.business_email},
                        Business Phone — {Business.business_phone}
                      </p>
                      <div className="image">
                        <Row>
                          <Col className="md">
                            <img src={Business.banner_image} height="150" alt="banner image" style={{ marginBottom: '10px' }} /><br />
                            <p>Banner Image</p>
                          </Col>
                        </Row>

                        <Row>
                          <Col className="md">
                            <img src={Business.business_logo} height="150" alt="business logo" /><br />
                            <p>Business Logo</p>
                          </Col>
                        </Row>
                      </div>
                    </>
                  }
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Phone
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone"
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Gender
                          </label>
                          <select
                            className="custom-select"
                            value={gender}
                            onChange={(e) => {
                              setGender(e.currentTarget.value);
                            }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>

                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Lucky"
                            id="input-first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter First name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Jesse"
                            id="input-last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Password
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Current Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            type="password"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            New Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            value={password}
                            onChange={(e) => { currentPassword == "" ? setErrorMsg("The current password can not be empty") : setPassword(e.target.value) }}
                            placeholder="Enter new password"
                            type="password"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Confirm Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                            placeholder="Confirm password"
                            type="password"
                          />

                        </FormGroup>
                      </Col>
                      <Button
                        color="info"
                        href="#pablo"
                        style={{ marginTop: '10%' }}
                        onClick={(e) => { e.preventDefault; changePassword() }}
                      >
                        Change password
                      </Button>
                    </Row>
                    {/* <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Lucky"
                            id="input-first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter First name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Jesse"
                            id="input-last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Address information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Common Place
                          </label>
                          <textarea
                            className="form-control"
                            placeholder="Describe the location"
                            value={commonPlace}
                            onChange={(e) => setCommon_place(e.target.value)}
                          ></textarea>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Street Number
                          </label>
                          <Input
                            className="form-control"
                            placeholder="Eg. Kg Av 39"
                            value={streetNumber}
                            onChange={(e) => setStreetNumber(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address 1 and Address 2
                          </label>
                          <div className="input-group">
                            <Input
                              className="form-control"
                              placeholder="Enter address 1"
                              value={address_1}
                              onChange={(e) => setAddress1(e.target.value)}
                            />
                            <Input
                              className="form-control"
                              placeholder="Enter address 2"
                              value={address_2}
                              onChange={(e) => setAddress2(e.target.value)}
                            />
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Country
                          </label>
                          <select
                            className="custom-select"
                            onChange={(e) => {
                              setCountry(e.currentTarget.value);
                            }}
                          >
                            <option value="0" selected disabled>Select a Country</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Åland Islands">Åland Islands</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="American Samoa">American Samoa</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Anguilla">Anguilla</option>
                            <option value="Antarctica">Antarctica</option>
                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Aruba">Aruba</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bermuda">Bermuda</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Bouvet Island">Bouvet Island</option>
                            <option value="Brazil">Brazil</option>
                            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                            <option value="Brunei Darussalam">Brunei Darussalam</option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cape Verde">Cape Verde</option>
                            <option value="Cayman Islands">Cayman Islands</option>
                            <option value="Central African Republic">Central African Republic</option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Christmas Island">Christmas Island</option>
                            <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                            <option value="Cook Islands">Cook Islands</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Cote D'ivoire">Cote D&#39;ivoire</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">Czech Republic</option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">Dominican Republic</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                            <option value="Faroe Islands">Faroe Islands</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="French Guiana">French Guiana</option>
                            <option value="French Polynesia">French Polynesia</option>
                            <option value="French Southern Territories">French Southern Territories</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Gibraltar">Gibraltar</option>
                            <option value="Greece">Greece</option>
                            <option value="Greenland">Greenland</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guadeloupe">Guadeloupe</option>
                            <option value="Guam">Guam</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guernsey">Guernsey</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-bissau">Guinea-bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                            <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Isle of Man">Isle of Man</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jersey">Jersey</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Korea, Democratic People's Republic of">Korea, Democratic People&#39;s Republic of</option>
                            <option value="Korea, Republic of">Korea, Republic of</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Lao People's Democratic Republic">Lao People&#39;s Democratic Republic</option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Macao">Macao</option>
                            <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">Marshall Islands</option>
                            <option value="Martinique">Martinique</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mayotte">Mayotte</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                            <option value="Moldova, Republic of">Moldova, Republic of</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Netherlands Antilles">Netherlands Antilles</option>
                            <option value="New Caledonia">New Caledonia</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Niue">Niue</option>
                            <option value="Norfolk Island">Norfolk Island</option>
                            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">Papua New Guinea</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Pitcairn">Pitcairn</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Puerto Rico">Puerto Rico</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Reunion">Reunion</option>
                            <option value="Romania">Romania</option>
                            <option value="Russian Federation">Russian Federation</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Saint Helena">Saint Helena</option>
                            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                            <option value="Saint Lucia">Saint Lucia</option>
                            <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                            <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">Solomon Islands</option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                            <option value="Swaziland">Swaziland</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                            <option value="Taiwan">Taiwan</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Timor-leste">Timor-leste</option>
                            <option value="Togo">Togo</option>
                            <option value="Tokelau">Tokelau</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Viet Nam">Viet Nam</option>
                            <option value="Virgin Islands, British">Virgin Islands, British</option>
                            <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                            <option value="Wallis and Futuna">Wallis and Futuna</option>
                            <option value="Western Sahara">Western Sahara</option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>

                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Province
                          </label>
                          <select
                            className="custom-select"
                            onChange={(e) => {
                              setProvince(e.target.value);
                              get_location('District', e.currentTarget.value, setIsDistrictsLoading, setDistrictsErrorMsg, setDistricts);
                            }}
                          >
                            {
                              isProvincesLoading ?
                                (<option value="">Loading available provinces...</option>) :
                                (null)
                            }
                            {
                              provincesErrorMsg != "" ?
                                (<option value="">{provincesErrorMsg}</option>) :
                                (null)
                            }
                            <option value="">Select Province</option>
                            {
                              provincesErrorMsg == "" ?
                                (provinces.map((province: ILocation, index) => (
                                  <option key={index} value={province.id}>{province.name}</option>
                                ))) :
                                (null)
                            }
                          </select>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            District
                          </label>
                          <select
                            className="custom-select"
                            onChange={(e) => {
                              setDistrict(e.target.value);
                              get_location('Sector', e.currentTarget.value, setIsSectorsLoading, setSectorsErrorMsg, setSectors);
                            }}
                          >
                            {
                              isDistrictsLoading ?
                                (<option value="">Loading available districts...</option>) :
                                (null)
                            }
                            {
                              districtsErrorMsg != "" ?
                                (<option value="">{districtsErrorMsg}</option>) :
                                (null)
                            }
                            <option value="">Select District</option>
                            {
                              districtsErrorMsg == "" ?
                                (districts.map((district: ILocation, index) => (
                                  <option key={index} value={district.id}>{district.name}</option>
                                ))) :
                                (null)
                            }
                          </select>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Sector
                          </label>
                          <select
                            className="custom-select"
                            onChange={(e) => {
                              setSector(e.target.value);
                              get_location('Cell', e.currentTarget.value, setIsCellsLoading, setCellsErrorMsg, setCells);
                            }}
                          >
                            {
                              isSectorsLoading ?
                                (<option value="">Loading available sectors...</option>) :
                                (null)
                            }
                            {
                              sectorsErrorMsg != "" ?
                                (<option value="">{sectorsErrorMsg}</option>) :
                                (null)
                            }
                            <option value="">Select Sector</option>
                            {
                              sectorsErrorMsg == "" ?
                                (sectors.map((sector: ILocation, index) => (
                                  <option key={index} value={sector.id}>{sector.name}</option>
                                ))) :
                                (null)
                            }
                          </select>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Cell
                          </label>
                          <select
                            className="custom-select"
                            onChange={(e) => {
                              setCell(e.target.value);
                              get_location('Village', e.currentTarget.value, setIsVillagesLoading, setVillagesErrorMsg, setVillages);
                            }}
                          >
                            {
                              isCellsLoading ?
                                (<option value="">Loading available cells...</option>) :
                                (null)
                            }
                            {
                              cellsErrorMsg != "" ?
                                (<option value="">{cellsErrorMsg}</option>) :
                                (null)
                            }
                            <option value="">Select Cell</option>
                            {
                              cellsErrorMsg == "" ?
                                (cells.map((cell: ILocation, index) => (
                                  <option key={index} value={cell.id}>{cell.name}</option>
                                ))) :
                                (null)
                            }
                          </select>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Village
                          </label>
                          <select
                            className="custom-select"
                            onChange={(e) => {
                              setVillage(e.target.value);
                            }}
                          >
                            {
                              isVillagesLoading ?
                                (<option value="">Loading available villages...</option>) :
                                (null)
                            }
                            {
                              villagesErrorMsg != "" ?
                                (<option value="">{villagesErrorMsg}</option>) :
                                (null)
                            }
                            <option value="">Select Village</option>
                            {
                              villagesErrorMsg == "" ?
                                (villages.map((village: ILocation, index) => (
                                  <option key={index} value={village.id}>{village.name}</option>
                                ))) :
                                (null)
                            }
                          </select>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            State, City and Zip code
                          </label>
                          <div className="input-group">
                            <Input
                              className="form-control"
                              placeholder="Enter state"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                            />
                            <Input
                              className="form-control"
                              placeholder="Enter city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            />
                            <Input
                              className="form-control"
                              placeholder="Enter zip code"
                              value={zip_code}
                              onChange={(e) => setZipCode(e.target.value)}
                            />
                          </div>
                        </FormGroup>
                      </Col>
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
                                    {/* <p className="error">
                                    <span>
                                      Profile is not set!
                                    </span><br />
                                    It&#39;s optional. You can leave it to set it later.
                                  </p> */}
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
                    </Row>
                    <Button
                      color="info"
                      href="#pablo"
                      style={{ marginTop: '10%' }}
                      onClick={(e) => { e.preventDefault; updateUserProfile(props.user) }}
                    >
                      Edit profile
                    </Button>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  {props.user.role != 'admin' &&
                    <>
                      <h6 className="heading-small text-muted mb-4">Business Information</h6>
                      <div className="pl-lg-4">
                        <FormGroup>
                          <label>Business</label>
                          <Input
                            placeholder="Business Name"
                            type="text"
                            autoComplete="new-business-name"
                            value={business_name}
                            onChange={(e) => setBusinessName(e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Business Email</label>
                          <Input
                            placeholder="Business Email"
                            type="text"
                            autoComplete="new-business-email"
                            value={business_email}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Business Phone</label>
                          <Input
                            placeholder="Business Phone"
                            type="text"
                            autoComplete="new-business-phone"
                            value={business_phone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                          />
                        </FormGroup>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                Common Place
                              </label>
                              <textarea
                                className="form-control"
                                placeholder="Describe the location"
                                value={business_commonPlace}
                                onChange={(e) => setBusinessCommon_place(e.target.value)}
                              ></textarea>
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                Street Number
                              </label>
                              <Input
                                className="form-control"
                                placeholder="Eg. Kg Av 39"
                                value={business_streetNumber}
                                onChange={(e) => setBusinessStreetNumber(e.target.value)}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                Address 1 and Address 2
                              </label>
                              <div className="input-group">
                                <Input
                                  className="form-control"
                                  placeholder="Enter address 1"
                                  value={business_address_1}
                                  onChange={(e) => setBusinessAddress1(e.target.value)}
                                />
                                <Input
                                  className="form-control"
                                  placeholder="Enter address 2"
                                  value={business_address_2}
                                  onChange={(e) => setBusinessAddress2(e.target.value)}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-city"
                              >
                                Country
                              </label>
                              <select
                                className="custom-select"
                                onChange={(e) => {
                                  setBusinessCountry(e.currentTarget.value);
                                }}
                              >
                                <option value="0" selected disabled>Select a Country</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Åland Islands">Åland Islands</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="American Samoa">American Samoa</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Anguilla">Anguilla</option>
                                <option value="Antarctica">Antarctica</option>
                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Aruba">Aruba</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bermuda">Bermuda</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Bouvet Island">Bouvet Island</option>
                                <option value="Brazil">Brazil</option>
                                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                <option value="Brunei Darussalam">Brunei Darussalam</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Cape Verde">Cape Verde</option>
                                <option value="Cayman Islands">Cayman Islands</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Christmas Island">Christmas Island</option>
                                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                <option value="Cook Islands">Cook Islands</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote D'ivoire">Cote D&#39;ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                <option value="Faroe Islands">Faroe Islands</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="French Guiana">French Guiana</option>
                                <option value="French Polynesia">French Polynesia</option>
                                <option value="French Southern Territories">French Southern Territories</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Gibraltar">Gibraltar</option>
                                <option value="Greece">Greece</option>
                                <option value="Greenland">Greenland</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Guam">Guam</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guernsey">Guernsey</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guinea-bissau">Guinea-bissau</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hong Kong">Hong Kong</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Isle of Man">Isle of Man</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jersey">Jersey</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="Korea, Democratic People's Republic of">Korea, Democratic People&#39;s Republic of</option>
                                <option value="Korea, Republic of">Korea, Republic of</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Lao People's Democratic Republic">Lao People&#39;s Democratic Republic</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macao">Macao</option>
                                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                <option value="Moldova, Republic of">Moldova, Republic of</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montenegro">Montenegro</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Namibia">Namibia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Netherlands Antilles">Netherlands Antilles</option>
                                <option value="New Caledonia">New Caledonia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Niue">Niue</option>
                                <option value="Norfolk Island">Norfolk Island</option>
                                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Palau">Palau</option>
                                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Pitcairn">Pitcairn</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Reunion">Reunion</option>
                                <option value="Romania">Romania</option>
                                <option value="Russian Federation">Russian Federation</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Saint Helena">Saint Helena</option>
                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                <option value="Saint Lucia">Saint Lucia</option>
                                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                <option value="Samoa">Samoa</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia">Serbia</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sudan">Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                <option value="Taiwan">Taiwan</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Timor-leste">Timor-leste</option>
                                <option value="Togo">Togo</option>
                                <option value="Tokelau">Tokelau</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                <option value="Tunisia">Tunisia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                <option value="Uruguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Venezuela">Venezuela</option>
                                <option value="Viet Nam">Viet Nam</option>
                                <option value="Virgin Islands, British">Virgin Islands, British</option>
                                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                <option value="Wallis and Futuna">Wallis and Futuna</option>
                                <option value="Western Sahara">Western Sahara</option>
                                <option value="Yemen">Yemen</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                              </select>

                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                Province
                              </label>
                              <select
                                className="custom-select"
                                onChange={(e) => {
                                  setBusinessProvince(e.target.value);
                                  get_location('District', e.currentTarget.value, setBusinessIsDistrictsLoading, setBusinessDistrictsErrorMsg, setBusinessDistricts);
                                }}
                              >
                                {
                                  business_isProvincesLoading ?
                                    (<option value="">Loading available provinces...</option>) :
                                    (null)
                                }
                                {
                                  business_provincesErrorMsg != "" ?
                                    (<option value="">{provincesErrorMsg}</option>) :
                                    (null)
                                }
                                <option value="">Select Province</option>
                                {
                                  business_provincesErrorMsg == "" ?
                                    (business_provinces.map((province: ILocation, index) => (
                                      <option key={index} value={province.id}>{province.name}</option>
                                    ))) :
                                    (null)
                                }
                              </select>
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                District
                              </label>
                              <select
                                className="custom-select"
                                onChange={(e) => {
                                  setBusinessDistrict(e.target.value);
                                  get_location('Sector', e.currentTarget.value, setBusinessIsSectorsLoading, setBusinessSectorsErrorMsg, setBusinessSectors);
                                }}
                              >
                                {
                                  business_isDistrictsLoading ?
                                    (<option value="">Loading available districts...</option>) :
                                    (null)
                                }
                                {
                                  business_districtsErrorMsg != "" ?
                                    (<option value="">{districtsErrorMsg}</option>) :
                                    (null)
                                }
                                <option value="">Select District</option>
                                {
                                  business_districtsErrorMsg == "" ?
                                    (business_districts.map((district: ILocation, index) => (
                                      <option key={index} value={district.id}>{district.name}</option>
                                    ))) :
                                    (null)
                                }
                              </select>
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                Sector
                              </label>
                              <select
                                className="custom-select"
                                onChange={(e) => {
                                  setBusinessSector(e.target.value);
                                  get_location('Cell', e.currentTarget.value, setBusinessIsCellsLoading, setBusinessCellsErrorMsg, setBusinessCells);
                                }}
                              >
                                {
                                  business_isSectorsLoading ?
                                    (<option value="">Loading available sectors...</option>) :
                                    (null)
                                }
                                {
                                  business_sectorsErrorMsg != "" ?
                                    (<option value="">{sectorsErrorMsg}</option>) :
                                    (null)
                                }
                                <option value="">Select Sector</option>
                                {
                                  business_sectorsErrorMsg == "" ?
                                    (business_sectors.map((sector: ILocation, index) => (
                                      <option key={index} value={sector.id}>{sector.name}</option>
                                    ))) :
                                    (null)
                                }
                              </select>
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                Cell
                              </label>
                              <select
                                className="custom-select"
                                onChange={(e) => {
                                  setBusinessCell(e.target.value);
                                  get_location('Village', e.currentTarget.value, setBusinessIsVillagesLoading, setBusinessVillagesErrorMsg, setBusinessVillages);
                                }}
                              >
                                {
                                  business_isCellsLoading ?
                                    (<option value="">Loading available cells...</option>) :
                                    (null)
                                }
                                {
                                  business_cellsErrorMsg != "" ?
                                    (<option value="">{cellsErrorMsg}</option>) :
                                    (null)
                                }
                                <option value="">Select Cell</option>
                                {
                                  business_cellsErrorMsg == "" ?
                                    (business_cells.map((cell: ILocation, index) => (
                                      <option key={index} value={cell.id}>{cell.name}</option>
                                    ))) :
                                    (null)
                                }
                              </select>
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-country"
                              >
                                Village
                              </label>
                              <select
                                className="custom-select"
                                onChange={(e) => {
                                  setBusinessVillage(e.target.value);
                                }}
                              >
                                {
                                  business_isVillagesLoading ?
                                    (<option value="">Loading available villages...</option>) :
                                    (null)
                                }
                                {
                                  business_villagesErrorMsg != "" ?
                                    (<option value="">{villagesErrorMsg}</option>) :
                                    (null)
                                }
                                <option value="">Select Village</option>
                                {
                                  business_villagesErrorMsg == "" ?
                                    (business_villages.map((village: ILocation, index) => (
                                      <option key={index} value={village.id}>{village.name}</option>
                                    ))) :
                                    (null)
                                }
                              </select>
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                State, City and Zip code
                              </label>
                              <div className="input-group">
                                <Input
                                  className="form-control"
                                  placeholder="Enter state"
                                  value={business_state}
                                  onChange={(e) => setBusinessState(e.target.value)}
                                />
                                <Input
                                  className="form-control"
                                  placeholder="Enter city"
                                  value={business_city}
                                  onChange={(e) => setBusinessCity(e.target.value)}
                                />
                                <Input
                                  className="form-control"
                                  placeholder="Enter zip code"
                                  value={business_zip_code}
                                  onChange={(e) => setBusinessZipCode(e.target.value)}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                          <Row>
                            <Col xl={12} className='upload_image'>
                              <Label>Business Logo</Label>
                              <section>

                                <div className="images">
                                  {
                                    !previewBusinessLogo || previewBusinessLogo == '' ? (
                                      <>
                                        <label className='image'>
                                          Click here for
                                          <br />
                                          <span>business Logo</span>
                                          <Input
                                            name="business_logo"
                                            placeholder="business_logo"
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp"
                                            autoComplete="business-logo"
                                            onChange={(event: any) => {
                                              onLogoSelectFile(event);
                                            }}
                                          />
                                        </label>
                                        {/* <div className="image">
                                      <img src={displayedLogo} height="150" alt="Logo image" />
                                      <p>Logo</p>
                                    </div> */}
                                      </>
                                    )
                                      : (
                                        <div className="image">
                                          <img src={previewBusinessLogo} height="150" alt="user image" />
                                          <Button onClick={() => deleteLogoHandler(previewBusinessLogo)}>
                                            <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                          </Button>
                                          <p>Logo</p>
                                        </div>

                                      )
                                  }
                                </div>
                              </section>
                            </Col>
                          </Row>
                          <Row>
                            <Col xl={12} className='upload_image'>
                              <Label>Business Banner</Label>
                              <section>

                                <div className="images">
                                  {
                                    !previewBusinessBanner || previewBusinessBanner == '' ? (
                                      <>
                                        <label className='image'>
                                          Click here for
                                          <br />
                                          <span>business Banner</span>
                                          <Input
                                            name="banner_image"
                                            placeholder="banner_image"
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp"
                                            autoComplete="banner-image"
                                            onChange={(event: any) => {
                                              onBannerSelectFile(event);
                                            }}
                                          />
                                        </label>
                                        {/* <p className="error">
                                      <span>
                                        Business banner is not set!
                                      </span><br />
                                      It&#39;s optional. You can leave it to set it later.
                                    </p> */}
                                      </>
                                    )
                                      : (
                                        <div className="image">
                                          <img src={previewBusinessBanner} height="150" alt="user image" />
                                          <Button onClick={() => deleteBannerHandler(previewBusinessBanner)}>
                                            <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                          </Button>
                                          <p>Banner</p>
                                        </div>

                                      )
                                  }
                                </div>
                              </section>
                            </Col>
                          </Row>
                        </Row>
                        <Button
                          color="info"
                          style={{ marginTop: '10%' }}
                          onClick={(e) => { e.preventDefault; updateBusiness(Business) }}
                        >
                          Edit Business
                        </Button>
                      </div>
                    </>
                  }
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
