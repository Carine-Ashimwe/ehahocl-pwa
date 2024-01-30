import AdminProducts from '../../components/PageChange/AdminProducts';
import Admin from '../../layouts/Admin';
// layout for this page

function AgrodealerProducts() {
    return (
        <AdminProducts  
            vendor={2}
        />
    );
}

AgrodealerProducts.layout = Admin;

export default AgrodealerProducts;