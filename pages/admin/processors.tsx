import AdminVendors from '../../components/PageChange/AdminVendors';
import Admin from '../../layouts/Admin';
// layout for this page

function FarmerVendors() {
  return (
      <AdminVendors  
        vendor={3}
      />
  );
}

FarmerVendors.layout = Admin;

export default FarmerVendors;