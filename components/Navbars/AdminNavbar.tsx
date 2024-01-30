import Link from "next/link";
import { useEffect, useState } from 'react';
// reactstrap components
import { toast } from 'react-toastify';
import {
  DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, NavItem, NavLink, Navbar, UncontrolledDropdown
} from "reactstrap";
import axios from '../../helpers/axios';
import { IShop, IUser } from '../../interfaces';

function AdminNavbar({ user, activeShop }: { user: IUser, activeShop: IShop }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [UserRole, setUserRole] = useState("");
  const [UserPicture, setUserPicture] = useState("");

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
  useEffect(() => {
    const user_role = localStorage.getItem("user");
    if (user_role !== null) {
      // console.log(user_role);

      setUserRole(JSON.parse(user_role).role);
      setUserPicture(JSON.parse(user_role).profile.user_picture);
      // console.log(user.profile?.user_picture + ' ' + typeof (user.profile?.user_picture))
    }
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

  const switch_business = (shop_id: number | undefined) => {
    let switched_shop: IShop | undefined = user.businesses?.find((e) => e.id == shop_id);
    if (switched_shop) {
      localStorage.setItem('active_shop', JSON.stringify(switched_shop));
      if (switched_shop?.user_sector?.sector_id == 1) {
        window.location.href = "/farmer/dashboard";
      }
      else if (switched_shop?.user_sector?.sector_id == 4) {
        window.location.href = "/delivery/dashboard";
      }
      else {
        window.location.href = "/vendor/dashboard";
      }
    }
    else {
      setErrorMsg("Business not existed. Logout and login again.");
      return;
    }
  }

  // logout
  const logout = async () => {
    return await axios.post('/logout')
      .then((res) => {
        if (res.data.status) {
          // console.log(res.data);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('active_shop');
          window.location.href = "/auth/login";
        }
      })
      .catch((error) => {
        alert(error);
      })
  };

  const defaultPicture = '/img/brand/user.png';
  
  return <>
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Nav className="align-items-center d-none d-md-flex" navbar>
        {
          user.role == 'vendor' ?
            (
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Link
                    href="#"
                    className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
                    legacyBehavior>

                    <span>{activeShop.business_name} ({activeShop.user_sector?.sector.sector_name})<i className="fa fa-angle-down ml-2" /></span>

                  </Link>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" end>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Switch business</h6>
                  </DropdownItem>
                  {
                    user.businesses?.length! > 1 ? (
                      user.businesses?.map((shop: IShop, index: number) => (
                        shop.id != activeShop.id ? (
                          <a onClick={() => switch_business(shop.id)} key={index}>
                            <DropdownItem>
                              <i className="ni ni-single-02" />
                              <span>{shop.business_name} ({shop.user_sector?.sector.sector_name})</span>
                            </DropdownItem>
                          </a>
                        )
                          : (null)
                      ))
                    )
                      : (null)
                  }
                  <DropdownItem divider />
                  <Link href="/auth/create-shop" legacyBehavior>
                    <DropdownItem>
                      <i className="ni ni-support-16" />
                      <span>Add new business</span>
                    </DropdownItem>
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            )
            : user.role == 'admin' ? (
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
                    eHaho Administration
                  </a>
                </DropdownToggle>
              </UncontrolledDropdown>
            )
              : (
                <UncontrolledDropdown nav>
                  <DropdownToggle className="pr-0" nav>
                    <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
                      Personal Dashboard
                    </a>
                  </DropdownToggle>
                </UncontrolledDropdown>
              )
        }
      </Nav>
      {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
        <FormGroup className="mb-0">
          <InputGroup className="input-group-alternative">

            <InputGroupText>
              <i className="fas fa-search" />
            </InputGroupText>

            <Input placeholder="Search" type="text" />
          </InputGroup>
        </FormGroup>
      </Form> */}
      <Nav className="align-items-center d-none d-md-flex" navbar>
        <UncontrolledDropdown nav>
          <DropdownToggle className="pr-0" nav>
            <Media className="align-items-center">
              <span className="avatar avatar-sm rounded-circle">
                <img src={UserPicture || defaultPicture} className="rounded-circle avatar avatar-sm" alt="me" />
              </span>
              <Media className="ml-2 d-none d-lg-block">
                <span className="mb-0 text-sm font-weight-bold">
                  {user.profile?.first_name} {user.profile?.last_name}
                  <i className="fa fa-angle-down ml-2" />
                </span>
              </Media>
            </Media>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-arrow" end>
            <DropdownItem className="noti-title" header tag="div">
              <h6 className="text-overflow m-0">Welcome!</h6>
            </DropdownItem>
            <Link href={`/${UserRole}/profile`} legacyBehavior>
              <DropdownItem>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
            </Link>
            <NavItem>
                <Link
                  href="http://178.62.195.18/"
                  target="_blank"
                  rel="noopener noreferrer"
                  legacyBehavior>
                  <NavLink title="Click to go to the Marketplace" style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="ni ni-shop text-primary" style={{ marginRight: '8px' }} />
                    <span style={{ color: 'black' }}>Go to Marketplace</span>
                  </NavLink>
                </Link>
            </NavItem>
            <DropdownItem divider />
            <DropdownItem href="#pablo" onClick={() => logout()}>
              <i className="ni ni-user-run" />
              <span>Logout</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  </>;
}

export default AdminNavbar;