import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
// reactstrap components
import { Container } from 'reactstrap';
import AdminFooter from '../components/Footers/AdminFooter';
import AdminNavbar from '../components/Navbars/AdminNavbar';
import Sidebar from '../components/Sidebar/Sidebar';
// core components

import routes from '../routes';


function Admin(props: any) {
  const [user, setUser] = useState("");
  const [greenLight, setGreenLight] = useState(false);
  // used for checking current route
  const router = useRouter();
  let mainContentRef: any = React.createRef();

  // Initial hook to Get Localstorage  
  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const logged_user = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      if (!token || !logged_user) {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('active_shop');
        router.push("/auth/login");
        return;
      }
      else {
        var parsed_user = JSON.parse(logged_user);
        setUser(parsed_user);
        if(parsed_user && parsed_user.role != 'admin') {
          if(parsed_user.role == 'vendor') {
            router.push("/vendor/dashboard");
          }
          else {
            router.push("/client/dashboard");
          }
          return;
        }
        else {
  
        }
      }
      setGreenLight(true);
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement!.scrollTop = 0;
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    
    // fetch user data from API
    axios.get('/api/user_businesses').then(response => {
      setUser(response.data);
      setGreenLight(true);
    }).catch(error => {
      console.error(error);
    });
  }, []);
  
  return (
    greenLight === false ? <div>loading....</div> : 
    <>
      <Sidebar
        {...props}
        routes={routes}
        role=""
        logo={{
          innerLink: '/admin/index',
          imgSrc: '/img/brand/ehaho-logo.png',
          imgAlt: '...',
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar {...props} user={user} />
        {props.children}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Admin;
