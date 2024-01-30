// reactstrap components
import { useEffect, useState } from 'react';
import {
  CardHeader,
  Container
} from "reactstrap";
// layout for this page
import PageHeader from '../../components/Headers/PageHeader';
// core components
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PurchaseRequests from '../../components/PageChange/PurchaseRequests';
import { IShop, IUser } from '../../interfaces';
import Vendor from '../../layouts/Vendor';

const VendorPurchaseRequest = () => {

  // let initialValues:IPurchaseRequest = {
  //   business_product_id: 0,
  //   order_quantity: 0,
  //   order_package: 0,
  //   order_date: '',
  //   packages: [
  //     {
  //       package_name: '',
  //       smallest_unit_conversion: 0
  //     }
  //   ]
  // };

  const [activeShop, setActiveShop] = useState<IShop>();
  const [user, setUser] = useState<IUser>();
  const [go, setGo] = useState(false);
  const [getPayload, setGetPayload] = useState({});

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      const userstring = localStorage.getItem('user');
      if (active_shop) {
        setActiveShop(JSON.parse(active_shop));
        let get_payload = {};
        get_payload = {
          business_id: JSON.parse(active_shop).id,
          paginate:true
        };
        setGetPayload(get_payload);
        setGo(true);
      }
      if (userstring) {
        setUser(JSON.parse(userstring));
      }
      if (user && user.role == 'admin') {
        setGo(true);
      }
    }
  }, []);

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

  return (
    <>
      <PageHeader page="Order Requests" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <CardHeader className="border-0">
          {/* <Row className="align-items-center">
            <div className="col">
              <h3 className="mb-0">Purchase Requests List</h3>
            </div>
          </Row> */}
        </CardHeader>
        <PurchaseRequests business_id={activeShop?.id} go={go} get_payload={getPayload} />
      </Container>
    </>
  );
}

VendorPurchaseRequest.layout = Vendor;

export default VendorPurchaseRequest;
