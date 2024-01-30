import AdminVendors from '../../components/PageChange/AdminVendors';
import Admin from '../../layouts/Admin';
// layout for this page

function FarmerVendors() {
  return (
      <AdminVendors  
        vendor={4}
      />
  );
}

FarmerVendors.layout = Admin;

export default FarmerVendors;