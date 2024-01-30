import AdminOrders from '../../components/PageChange/AdminOrders';
import Admin from '../../layouts/Admin';
// layout for this page

function AgrodealerOrders() {
  return (
      <AdminOrders  
        vendor={2}
      />
  );
}

AgrodealerOrders.layout = Admin;

export default AgrodealerOrders;