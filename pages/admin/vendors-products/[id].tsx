import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import VendorProducts from '../../../components/PageChange/VendorProducts';
import axios from '../../../helpers/axios';
import Admin from '../../../layouts/Admin';
// layout for this page

function Products() {
  const [greenLight, setGreenLight] = useState(false);
  const [sectorId, setSectorId] = useState();
  const router = useRouter();
  const params = router.query;
  const shopId: number | undefined = params.id ? parseInt(params.id as string) : undefined;

  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const get_business_info = async () => {
          try {
              axios.get('/user_businesses/'+shopId)
              .then((res) => {
                setSectorId(res.data.sector_id);
              })
              .catch((error:any) => {
              })
          } 
          catch (error) {
              console.log('Something went wrong to retrieve business info.',error);
          }
      };
      setGreenLight(true);
    }
  }, []);
  return (
    greenLight === false ? <div>loading....</div> : 
    <VendorProducts userType="Admin" shopId={shopId} sectorId={sectorId} />
  );
}

Products.layout = Admin;

export default Products;