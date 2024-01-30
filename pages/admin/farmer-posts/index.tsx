import FarmerPosts from '../../../components/PageChange/FarmerPosts';
import Admin from '../../../layouts/Admin';
// layout for this page

function Posts() {
  const shopId = undefined;
  const sectorId = undefined;

  return (
    <FarmerPosts userType="Admin" shopId={shopId} sectorId={sectorId} />
  );
}

Posts.layout = Admin;

export default Posts;