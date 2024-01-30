// reactstrap components
import { useEffect, useState } from 'react';
import { Container } from "reactstrap";
// layout for this page
import PageHeader from '../../components/Headers/PageHeader';
// core components
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PurchaseRequests from '../../components/PageChange/PurchaseRequests';
import { IUser } from '../../interfaces';
import Admin from '../../layouts/Admin';

const VendorPurchaseRequest = () => {
  const [user, setUser] = useState<IUser>();
  const [go, setGo] = useState(true);
  const [getPayload, setGetPayload] = useState({ paginate: true });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Initial hook to Get Localstorage 
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
        <PurchaseRequests business_id={null} go={go} get_payload={getPayload} />
      </Container>
    </>
  );
}

VendorPurchaseRequest.layout = Admin;

export default VendorPurchaseRequest;
