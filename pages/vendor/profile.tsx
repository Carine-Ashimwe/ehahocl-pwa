import Profile from '../../components/PageChange/Profile';
// reactstrap components
// layout for this page
import Vendor from '../../layouts/Vendor';

// core components

function VendorProfile() {
  let user = localStorage.getItem("user");
  let Business = localStorage.getItem("active_shop");
  if (user !== null) {
    user = JSON.parse(user)
  }
  return (
    <>
      <Profile business={Business} user={user} />
    </>
  );
}

VendorProfile.layout = Vendor;

export default VendorProfile;