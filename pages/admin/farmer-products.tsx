import AdminProducts from '../../components/PageChange/AdminProducts';
import Admin from '../../layouts/Admin';
// layout for this page

function FarmerProducts() {
  return (
    <AdminProducts
      vendor={1}
    />
  );
}

FarmerProducts.layout = Admin;

export default FarmerProducts;