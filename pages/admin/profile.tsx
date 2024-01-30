import Profile from '../../components/PageChange/Profile';
// reactstrap components
// layout for this page
import Admin from '../../layouts/Admin';

// core components

function AdminProfile() {
  let user = localStorage.getItem("user");
  if (user !== null) {
    user = JSON.parse(user)
  }
  return (
    <>
      <Profile user={user} business={null} />
    </>
  );
}


AdminProfile.layout = Admin;

export default AdminProfile;
