// reactstrap components
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
// layout for this page

import { Formik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { MsgText } from '../../components/Common/MsgText';
import axios from '../../helpers/axios';
import { IbizSec, ILocation, IShop, IUser } from '../../interfaces';

function Createshop() {
  const [user, setUser] = useState<IUser>();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [businessSectors, setBusinessSectors] = useState([]);
  const [businessSectorErrorMsg, setBusinessSectorErrorMsg] = useState("");
  const [isBusinessSectorLoading, setIsBusinessSectorLoading] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [provincesErrorMsg, setProvincesErrorMsg] = useState("");
  const [isProvincesLoading, setIsProvincesLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [districtsErrorMsg, setDistrictsErrorMsg] = useState("");
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);

  const [sectors, setSectors] = useState([]);
  const [sectorsErrorMsg, setSectorsErrorMsg] = useState("");
  const [isSectorsLoading, setIsSectorsLoading] = useState(false);

  const [cells, setCells] = useState([]);
  const [cellsErrorMsg, setCellsErrorMsg] = useState("");
  const [isCellsLoading, setIsCellsLoading] = useState(false);

  const [villages, setVillages] = useState([]);
  const [villagesErrorMsg, setVillagesErrorMsg] = useState("");
  const [isVillagesLoading, setIsVillagesLoading] = useState(false);

  const [previewBusinessLogo, setPreviewBusinessLogo] = useState<string>('');
  const [businessLogo, setBusinessLogo] = useState<string>('');
  const [previewBusinessBanner, setPreviewBusinessBanner] = useState<string>('');
  const [businessBanner, setBusinessBanner] = useState<string>('');

  let initialValues:IShop = {
    sector_id: undefined,
    business_name: user?.profile?.first_name!+' '+user?.profile?.last_name!,
    business_email: user?.email!,
    business_phone: user?.phone!,
    business_logo: '',
    banner_image: '',
    country: user?.profile?.country!,
    province: user?.profile?.province!,
    district: user?.profile?.district!,
    sector: user?.profile?.sector!,
    cell: user?.profile?.cell!,
    village: user?.profile?.village!,
    street_number: user?.profile?.street_number!,
    common_place: user?.profile?.common_place!,
    address_1: user?.profile?.address_1!,
    address_2: user?.profile?.address_2!,
    state: user?.profile?.state!,
    city: user?.profile?.city!,
    zip_code: user?.profile?.zip_code!,
  };
  
  const notify = (msg_type: string) => {
    if (msg_type === 'error') {
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

  
  // Image handlers
  // Logo
  const onLogoSelectFile = (event:any) => {
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

    const options:any = {
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
    .then((res:any) => {
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

  function deleteLogoHandler(image:string) {
    setPreviewBusinessLogo('');
    setBusinessLogo('');
    URL.revokeObjectURL(image);
  }
  
  //Banner
  const onBannerSelectFile = (event:any) => {
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

    const options:any = {
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
    .then((res:any) => {
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

  function deleteBannerHandler(image:string) {
    setPreviewBusinessBanner('');
    setBusinessBanner('');
    URL.revokeObjectURL(image);
  }
  // End of images handlers

  const countrychange = (values:IShop,country:string) => {
    if (country == 'Rwanda') {
      values.address_1 as undefined;
      values.address_2 as undefined;
      values.state as undefined;
      values.city as undefined;
      values.zip_code as undefined;
    }
    else {
      values.province as undefined;
      values.district as undefined;
      values.sector as undefined;
      values.cell as undefined;
      values.village as undefined;
    }
  }

  useEffect(() => {
    // Protect page
    const logged_user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (!token || !logged_user) {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('active_shop');
      window.location.href = "/auth/login";
      return;
    }
    setUser(JSON.parse(logged_user));

    if (successMsg) {
      notify('success')
    }
  },[])

  const business_sectors = () => {
    // Get business sectors
    if (isBusinessSectorLoading) {
      return
    }
    setBusinessSectorErrorMsg("");
    setIsBusinessSectorLoading(true);

    axios.get('/business_sectors')
    .then((res) => {
      setIsBusinessSectorLoading(false);
      setBusinessSectorErrorMsg("");
      setBusinessSectors(res.data);
    })
    .catch((error) => {
      setIsBusinessSectorLoading(false);
      const errorMessage = error.response?.data?.message;
      setBusinessSectorErrorMsg(errorMessage || error.message);
    })
  }

  const get_location = (level: string,parent_id: any,setLoad: any,setError: any,setLocations: any) => {
    setLoad(true);
    setError("");
    const payload = {'model':level, 'parent_id': parent_id};
    axios.post('/locations', payload)
    .then((res) => {
      setLoad(false);
      if(res.data.status) {
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

  useEffect(() => {
    business_sectors();
    get_location('Province',null,setIsProvincesLoading,setProvincesErrorMsg,setProvinces);
    get_location('District',initialValues.province,setIsDistrictsLoading,setDistrictsErrorMsg,setDistricts);
    get_location('Sector',initialValues.district,setIsSectorsLoading,setSectorsErrorMsg,setSectors);
    get_location('Cell',initialValues.sector,setIsCellsLoading,setCellsErrorMsg,setCells);
    get_location('Village',initialValues.cell,setIsVillagesLoading,setVillagesErrorMsg,setVillages);
  },[])

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
    sector_id: Yup.string().trim().required().label('Business sector'),
    business_name: Yup.string().trim().required().label('Business Name'),
    business_phone: Yup.string().trim().required().label('Business Phone'),
    // business_email: Yup.string().trim().label('Business Email'),
    // business_logo: Yup.string().trim().label('Business Logo'),
    // banner_image: Yup.string().trim().label('Business banner image'),
    country: Yup.string().trim().required().label('Business country location'),
    province: Yup.string().trim().nullable().label('Province')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    district: Yup.string().trim().nullable().label('District')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    sector: Yup.string().trim().nullable().label('Sector')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    cell: Yup.string().trim().nullable().label('Cell')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    village: Yup.string().trim().nullable().label('Village')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    street_number: Yup.string().trim().nullable().label('Street Number')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    common_place: Yup.string().trim().nullable().required().label('Common Known place')
      .when('country', {
        is: (country: string) => country == "Rwanda",
        then: Yup.string()
          .required()            
      }),
    // address_1: Yup.string().trim().required().label('Address 1'),
    // address_2: Yup.string().trim().required().label('Address 2'),
    // state: Yup.string().trim().required().label('State'),
    // city: Yup.string().trim().required().label('City'),
    // zip_code: Yup.string().trim().required().label('Zip Code'),
  });

  const createbusiness = async (payload: IShop) => {
    if (isLoading) {
      return
    }
    payload.user_id = user?.id;
    payload.business_logo = businessLogo;
    payload.banner_image = businessBanner;
    if (payload.country == 'Rwanda') {
      payload.address_1 as undefined;
      payload.address_2 as undefined;
      payload.state as undefined;
      payload.city as undefined;
      payload.zip_code as undefined;
    }
    else {
      payload.province as undefined;
      payload.district as undefined;
      payload.sector as undefined;
      payload.cell as undefined;
      payload.village as undefined;
    }
    
    setIsLoading(true);
    setErrorMsg("");
    return await axios.post('/user_businesses', payload)
    .then((res) => {
      setIsLoading(false);
      if(res.data.status) {
        user?.businesses?.push(res.data.message);
        localStorage.setItem('active_shop', JSON.stringify(res.data.message));
        localStorage.setItem('user', JSON.stringify(user));
        setSuccessMsg("Congratulations! Business created successfully. You've completed all steps. You will now be redirected to your dashboard!");
        if(res.data.message.sector_id == 1) {
          setTimeout(()=>{window.location.href = "/farmer/dashboard"}, 5000);
        }
        else if (res.data.message.sector_id == 4) {
          setTimeout(()=>{window.location.href = "/delivery/dashboard"}, 5000);
        }
        else {
          setTimeout(()=>{window.location.href = "/vendor/dashboard"}, 5000);
        }
      }
      else {
        setErrorMsg(res.data.message);
      }
    })
    .catch((error) => {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message;
      setErrorMsg(errorMessage || error.message);
    })
  }

  return (
    <>
      <ToastContainer />
      <div className="main-content auth-container">
        <div className="auth-description">
          <h1 className="text-grey my-4">Create a business!</h1> 
          <h4 className="text-grey font-weight-normal">
            To sell on eHaho, you have to create at least one business. you can add more businesses on the dashboard<br/>
            Few steps ahead!
          </h4>
        </div>
        <div className="auth-form">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={createbusiness}
            validationSchema={FormValidationSchema}
          >
            {({
              values,
              setFieldValue,
              handleChange,
              handleSubmit,
              touched,
              handleBlur,
              errors,
            }) => (
              <Form role="form" onSubmit={handleSubmit}>
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-transparent">
                    <div className="text-muted text-center mt-2 mb-3">
                      <small>Create Business</small>
                    </div>
                    <div className="btn-wrapper text-center">
                      <Image style={{ textAlign: 'center' }} className="navbar-brand-img" src="/img/brand/ehaho-logo.png" alt="ehaho-logo" width="100" height="110" />
                    </div>
                    <h5 className="font-medium mb-3">Business Basic Info</h5>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="ni ni-shop" />
                        </InputGroupText>

                        <Input
                          placeholder="Business Name"
                          type="text"
                          autoComplete="new-business-name"
                          value={values.business_name}
                          onChange={handleChange('business_name')}
                          onBlur={handleBlur('business_name')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.business_name && errors.business_name && (
                      <MsgText
                        text={errors.business_name}
                        textColor="danger"
                      />
                    )}

                    <FormGroup>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-phone" />
                        </InputGroupText>

                        <Input
                          placeholder="Business Phone"
                          type="text"
                          autoComplete="new-phone"
                          value={values.business_phone}
                          onChange={handleChange('business_phone')}
                          onBlur={handleBlur('business_phone')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.business_phone && errors.business_phone && (
                      <MsgText
                        text={errors.business_phone}
                        textColor="danger"
                      />
                    )}

                    <FormGroup>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="ni ni-world" />
                        </InputGroupText>

                        <select 
                          className="custom-select" 
                          value={values.sector_id} 
                          onChange={handleChange('sector_id')}
                          onBlur={handleBlur('sector_id')}
                        >
                          {
                            isBusinessSectorLoading?
                            (<option value="">Loading available sectors...</option>):
                            (null)
                          }
                          {
                            businessSectorErrorMsg!=""?
                            (<option value="">{businessSectorErrorMsg}</option>):
                            (null)
                          }
                          <option value="">Select business sector</option>
                          {
                            businessSectorErrorMsg==""?
                            (businessSectors.map((sector:IbizSec,index) => (
                              <option key={index} value={sector.id}>{sector.sector_name}</option>
                            ))):
                            (null)
                          }
                        </select>

                      </InputGroup>
                    </FormGroup>
                    {touched.sector_id && errors.sector_id && (
                      <MsgText
                        text={errors.sector_id}
                        textColor="danger"
                      />
                    )}
                  </CardHeader>
                  <CardBody className="bg-transparent">
                    <h5 className="font-medium mb-3">Business Location</h5>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="fas fa-flag" />
                        </InputGroupText>

                        <select 
                          className="custom-select"
                          value={values.country} 
                          onChange={(e) => {
                            handleChange("country")(e);
                            countrychange(values,e.currentTarget.value);
                          }}
                          onBlur={handleBlur('country')}
                          >
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

                      </InputGroup>
                    </FormGroup>
                    {touched.country && errors.country && (
                      <MsgText
                        text={errors.country}
                        textColor="danger"
                      />
                    )}

                    {
                      values.country == 'Rwanda'?(
                        <>
                          <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">

                              <InputGroupText>
                                <i className="ni ni-compass-04" />
                              </InputGroupText>

                              <select 
                                className="custom-select"
                                value={values?.province as number}
                                onChange={(e) => {
                                  handleChange("province")(e);
                                  get_location('District',e.currentTarget.value,setIsDistrictsLoading,setDistrictsErrorMsg,setDistricts);
                                }} 
                                onBlur={handleBlur('province')}
                              >
                                {
                                  isProvincesLoading?
                                  (<option value="">Loading available provinces...</option>):
                                  (null)
                                }
                                {
                                  provincesErrorMsg!=""?
                                  (<option value="">{provincesErrorMsg}</option>):
                                  (null)
                                }
                                <option value="">Select Province</option>
                                {
                                  provincesErrorMsg==""?
                                  (provinces.map((province:ILocation,index) => (
                                    <option key={index} value={province.id}>{province.name}</option>
                                  ))):
                                  (null)
                                }
                              </select>

                            </InputGroup>
                          </FormGroup>
                          {touched.province && errors.province && (
                            <MsgText
                              text={errors.province}
                              textColor="danger"
                            />
                          )}

                          <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">

                              <InputGroupText>
                                <i className="ni ni-map-big" />
                              </InputGroupText>

                              <select 
                                className="custom-select"
                                value={values.district as number}
                                onChange={(e) => {
                                  handleChange("district")(e);
                                  get_location('Sector',e.currentTarget.value,setIsSectorsLoading,setSectorsErrorMsg,setSectors);
                                }} 
                                onBlur={handleBlur('district')}
                              >
                                {
                                  isDistrictsLoading?
                                  (<option value="">Loading available districts...</option>):
                                  (null)
                                }
                                {
                                  districtsErrorMsg!=""?
                                  (<option value="">{districtsErrorMsg}</option>):
                                  (null)
                                }
                                <option value="">Select District</option>
                                {
                                  districtsErrorMsg==""?
                                  (districts.map((district:ILocation,index) => (
                                    <option key={index} value={district.id}>{district.name}</option>
                                  ))):
                                  (null)
                                }
                              </select>

                            </InputGroup>
                          </FormGroup>
                          {touched.district && errors.district && (
                            <MsgText
                              text={errors.district}
                              textColor="danger"
                            />
                          )}

                          <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">

                              <InputGroupText>
                                <i className="fas fa-map" />
                              </InputGroupText>

                              <select 
                                className="custom-select"
                                value={values.sector as number}
                                onChange={(e) => {
                                  handleChange("sector")(e);
                                  get_location('Cell',e.currentTarget.value,setIsCellsLoading,setCellsErrorMsg,setCells);
                                }} 
                                onBlur={handleBlur('sector')}
                              >
                                {
                                  isSectorsLoading?
                                  (<option value="">Loading available sectors...</option>):
                                  (null)
                                }
                                {
                                  sectorsErrorMsg!=""?
                                  (<option value="">{sectorsErrorMsg}</option>):
                                  (null)
                                }
                                <option value="">Select Sector</option>
                                {
                                  sectorsErrorMsg==""?
                                  (sectors.map((sector:ILocation,index) => (
                                    <option key={index} value={sector.id}>{sector.name}</option>
                                  ))):
                                  (null)
                                }
                              </select>

                            </InputGroup>
                          </FormGroup>
                          {touched.sector && errors.sector && (
                            <MsgText
                              text={errors.sector}
                              textColor="danger"
                            />
                          )}

                          <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">

                              <InputGroupText>
                                <i className="ni ni-square-pin" />
                              </InputGroupText>

                              <select 
                                className="custom-select"
                                value={values.cell as number}
                                onChange={(e) => {
                                  handleChange("cell")(e);
                                  get_location('Village',e.currentTarget.value,setIsVillagesLoading,setVillagesErrorMsg,setVillages);
                                }} 
                                onBlur={handleBlur('cell')}
                              >
                                {
                                  isCellsLoading?
                                  (<option value="">Loading available cells...</option>):
                                  (null)
                                }
                                {
                                  cellsErrorMsg!=""?
                                  (<option value="">{cellsErrorMsg}</option>):
                                  (null)
                                }
                                <option value="">Select Cell</option>
                                {
                                  cellsErrorMsg==""?
                                  (cells.map((cell:ILocation,index) => (
                                    <option key={index} value={cell.id}>{cell.name}</option>
                                  ))):
                                  (null)
                                }
                              </select>

                            </InputGroup>
                          </FormGroup>
                          {touched.cell && errors.cell && (
                            <MsgText
                              text={errors.cell}
                              textColor="danger"
                            />
                          )}

                          <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">

                              <InputGroupText>
                                <i className="ni ni-shop" />
                              </InputGroupText>

                              <select 
                                className="custom-select"
                                value={values.village as number}
                                onChange={(e) => {
                                  handleChange("village")(e);
                                }} 
                                onBlur={handleBlur('village')}
                              >
                                {
                                  isVillagesLoading?
                                  (<option value="">Loading available villages...</option>):
                                  (null)
                                }
                                {
                                  villagesErrorMsg!=""?
                                  (<option value="">{villagesErrorMsg}</option>):
                                  (null)
                                }
                                <option value="">Select Village</option>
                                {
                                  villagesErrorMsg==""?
                                  (villages.map((village:ILocation,index) => (
                                    <option key={index} value={village.id}>{village.name}</option>
                                  ))):
                                  (null)
                                }
                              </select>

                            </InputGroup>
                          </FormGroup>
                          {touched.village && errors.village && (
                            <MsgText
                              text={errors.village}
                              textColor="danger"
                            />
                          )}

                          <FormGroup>
                            <InputGroup className="input-group-alternative">

                              <InputGroupText>
                                <i className="ni ni-pin-3" />
                              </InputGroupText>

                              <Input
                                placeholder="Street Number"
                                type="text"
                                autoComplete="new-street"
                                value={values.street_number} 
                                onChange={handleChange('street_number')}
                                onBlur={handleBlur('street_number')}
                              />
                            </InputGroup>
                          </FormGroup>
                          {touched.street_number && errors.street_number && (
                            <MsgText
                              text={errors.street_number}
                              textColor="danger"
                            />
                          )}

                          <FormGroup>
                            <textarea 
                              className="form-control" 
                              placeholder="Describe the location"
                              value={values.common_place} 
                              onChange={handleChange('common_place')}
                              onBlur={handleBlur('common_place')}
                            ></textarea>
                          </FormGroup>
                          {touched.common_place && errors.common_place && (
                            <MsgText
                              text={errors.common_place}
                              textColor="danger"
                            />
                          )}
                        </>
                      )
                      :(
                        <>
                          <FormGroup>
                            <InputGroup className="input-group-alternative">
                              <InputGroupText>
                                <i className="ni ni-square-pin" />
                              </InputGroupText>

                              <Input
                                type="text"
                                className="form-control" 
                                placeholder="Address 1"
                                value={values.address_1} 
                                onChange={handleChange('address_1')}
                                onBlur={handleBlur('address_1')}
                              />
                            </InputGroup>
                          </FormGroup>
                          {touched.	address_1 && errors.address_1 && (
                            <MsgText
                              text={errors.address_1}
                              textColor="danger"
                            />
                          )}

                          <FormGroup>
                            <InputGroup className="input-group-alternative">
                              <InputGroupText>
                                <i className="ni ni-pin-3" />
                              </InputGroupText>

                              <Input
                                type="text"
                                className="form-control" 
                                placeholder="Address 2"
                                value={values.address_2} 
                                onChange={handleChange('address_2')}
                                onBlur={handleBlur('address_2')}
                              />
                            </InputGroup>
                          </FormGroup>
                          {touched.address_2 && errors.address_2 && (
                            <MsgText
                              text={errors.address_2}
                              textColor="danger"
                            />
                          )}

                          <FormGroup>
                            <InputGroup className="input-group-alternative">
                              <InputGroupText>
                                <i className="ni ni-compass-04" />
                              </InputGroupText>

                              <Input
                                type="text"
                                className="form-control" 
                                placeholder="State"
                                value={values.state} 
                                onChange={handleChange('state')}
                                onBlur={handleBlur('state')}
                              />
                            </InputGroup>
                          </FormGroup>
                          {touched.state && errors.state && (
                            <MsgText
                              text={errors.state}
                              textColor="danger"
                            />
                          )}

                          <FormGroup>
                            <InputGroup className="input-group-alternative">
                              <InputGroupText>
                                <i className="ni ni-map-big" />
                              </InputGroupText>

                              <Input
                                type="text"
                                className="form-control" 
                                placeholder="City"
                                value={values.city} 
                                onChange={handleChange('city')}
                                onBlur={handleBlur('city')}
                              />
                            </InputGroup>
                          </FormGroup>
                          {touched.city && errors.city && (
                            <MsgText
                              text={errors.city}
                              textColor="danger"
                            />
                          )}

                          <FormGroup>
                            <InputGroup className="input-group-alternative">
                              <InputGroupText>
                                <i className="ni ni-shop" />
                              </InputGroupText>

                              <Input
                                type="text"
                                minLength={5}
                                maxLength={5}
                                className="form-control" 
                                placeholder="Zip code"
                                value={values.zip_code} 
                                onChange={handleChange('zip_code')}
                                onBlur={handleBlur('zip_code')}
                              />
                            </InputGroup>
                          </FormGroup>
                          {touched.zip_code && errors.zip_code && (
                            <MsgText
                              text={errors.zip_code}
                              textColor="danger"
                            />
                          )}
                        </>
                      )
                    }
                    {/* <FormGroup>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="ni ni-image" />
                        </InputGroupText>

                        <Input
                          placeholder="business_logo"
                          type="file"
                          autoComplete="new-business-logo"
                          name="business_logo" 
                          onChange={(event:any) => {
                            setFieldValue("business_logo", event.currentTarget.files[0]);
                          }}
                          onBlur={handleBlur('business_logo')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.business_logo && errors.business_logo && (
                      <MsgText
                        text={errors.business_logo}
                        textColor="danger"
                      />
                    )} */}
{/* 
                    <FormGroup>
                      <InputGroup className="input-group-alternative">

                        <InputGroupText>
                          <i className="ni ni-image" />
                        </InputGroupText>

                        <Input
                          placeholder="Banner Image"
                          type="file"
                          autoComplete="new-business-banner"
                          name="banner_image" 
                          onChange={(event:any) => {
                            setFieldValue("banner_image", event.currentTarget.files[0]);
                          }}
                          onBlur={handleBlur('banner_image')}
                        />
                      </InputGroup>
                    </FormGroup>
                    {touched.banner_image && errors.banner_image && (
                      <MsgText
                        text={errors.banner_image}
                        textColor="danger"
                      />
                    )} */}
                    
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
                                      onChange={(event:any) => {
                                        onLogoSelectFile(event);
                                      }}
                                    />
                                  </label>
                                  <p className="error">
                                    <span>
                                      Business logo is not set!
                                    </span><br />
                                    It&#39;s optional. You can leave it to set it later.
                                  </p>
                                </>
                              )
                              :(
                              <div className="image">
                                <img src={previewBusinessLogo} height="150" alt="user image" />
                                <button onClick={() => deleteLogoHandler(previewBusinessLogo)}>
                                  <i className="fas fa-trash text-danger mr-1 ml-1"></i>
                                </button>
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
                                      onChange={(event:any) => {
                                        onBannerSelectFile(event);
                                      }}
                                    />
                                  </label>
                                  <p className="error">
                                    <span>
                                      Business banner is not set!
                                    </span><br />
                                    It&#39;s optional. You can leave it to set it later.
                                  </p>
                                </>
                              )
                              :(
                              <div className="image">
                                <img src={previewBusinessBanner} height="150" alt="user image" />
                                <button onClick={() => deleteBannerHandler(previewBusinessBanner)}>
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

                    <div className="text-center">
                      <Button className="my-4 w-100 bg-success text-white" type="submit">
                        {
                          isLoading?
                          ("Saving Your Business Details..."):
                          ("Finish Registration")
                        }
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Createshop;
