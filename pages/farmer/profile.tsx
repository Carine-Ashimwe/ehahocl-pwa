import Profile from '../../components/PageChange/Profile';
// reactstrap components
// layout for this page
import Farmer from '../../layouts/Farmer';

// core components

function FarmerProfile() {
  let user = localStorage.getItem("user");
  let business = localStorage.getItem("active_shop");
  if (user !== null) {
    user = JSON.parse(user)
  }
  return (
    <>
      <Profile user={user} business={business} />
    </>
  );
}


FarmerProfile.layout = Farmer;

export default FarmerProfile;