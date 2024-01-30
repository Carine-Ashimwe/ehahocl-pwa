import VendorProducts from '../../../components/PageChange/VendorProducts';
import Admin from '../../../layouts/Admin';
// layout for this page

function Products() {
  const shopId = undefined;
  const sectorId = undefined;

  return (
    <VendorProducts userType="Admin" shopId={shopId} sectorId={sectorId} />
  );
}

Products.layout = Admin;

export default Products;