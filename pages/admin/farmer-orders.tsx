import AdminOrders from '../../components/PageChange/AdminOrders';
import Admin from '../../layouts/Admin';
// layout for this page

function FarmerOrders() {
  return (
      <AdminOrders  
        vendor={1}
      />
  );
}

FarmerOrders.layout = Admin;

export default FarmerOrders;