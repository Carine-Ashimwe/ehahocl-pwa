import AdminProducts from '../../components/PageChange/AdminProducts';
import Admin from '../../layouts/Admin';
// layout for this page

function ProcessorProducts() {
    return (
        <AdminProducts  
            vendor={3}
        />
    );
}

ProcessorProducts.layout = Admin;

export default ProcessorProducts;