import AdminOrders from '../../components/PageChange/AdminOrders';
import Admin from '../../layouts/Admin';
// layout for this page

function ProcessorOrders() {
  return (
      <AdminOrders  
        vendor={3}
      />
  );
}

ProcessorOrders.layout = Admin;

export default ProcessorOrders;