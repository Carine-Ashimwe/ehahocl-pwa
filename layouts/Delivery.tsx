import { useRouter } from 'next/router';
import React, { useState } from 'react';
// reactstrap components
import { ToastContainer } from 'react-toastify';
import { Container } from 'reactstrap';
import AdminFooter from '../components/Footers/AdminFooter';
import AdminNavbar from '../components/Navbars/AdminNavbar';
import Sidebar from '../components/Sidebar/Sidebar';
// core components

import routes from '../delivery-routes';


function Vendor(props: any) {
  const [user, setUser] = useState("");
  const [activeShop, setActiveShop] = useState("");
  const [greenLight, setGreenLight] = useState(false);

  // used for checking current route
  const router = useRouter();
  let mainContentRef: any = React.createRef();
  
  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const logged_user = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      const active_shop = localStorage.getItem('active_shop');
      if (!token || !logged_user) {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('active_shop');
        window.location.href = "/auth/login";
        return;
      }
      else {
        var parsed_user = JSON.parse(logged_user);
        setUser(parsed_user);
        if(parsed_user && parsed_user.role != 'vendor') {
          if(parsed_user.role == 'admin') {
            window.location.href = "/admin/dashboard";
          }
          else {
            window.location.href = "/client/dashboard";
          }
          return;
        }
        else if(parsed_user && (parsed_user.profile.country == '' || parsed_user.profile.country == null)) {
          window.location.href = "/auth/address";
          return;
        }
        else if(parsed_user && parsed_user.businesses.length < 1) {
          window.location.href = "/auth/create-shop";
          return;
        }
        else {

        }
        if(!active_shop) {
          localStorage.setItem('active_shop',JSON.stringify(parsed_user.businesses[0]));
          setActiveShop(parsed_user.businesses[0]);
        }
        else {
          let active_business = JSON.parse(active_shop); 
          if (active_business.user_sector.sector_id == 1) {
            window.location.href = "/farmer/dashboard";
            return;
          }
          else if(active_business.user_sector.sector_id == 2 || active_business.user_sector.sector_id == 3) {
            window.location.href = "/vendor/dashboard";
            return;
          }
          else {
            setActiveShop(active_business);
          }
        }
      }
      setGreenLight(true);
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement!.scrollTop = 0;
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    greenLight === false ? <div>loading....</div> : 
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: '/admin/index',
          imgSrc: '/img/brand/ehaho-logo.png',
          imgAlt: '...',
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar {...props} user={user} activeShop={activeShop} />
        {props.children}
        <Container fluid>
          <ToastContainer />
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Vendor;
