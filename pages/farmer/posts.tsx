import { useEffect, useState } from 'react';
import FarmerPosts from '../../components/PageChange/FarmerPosts';
import Farmer from '../../layouts/Farmer';
// layout for this page

function Posts() {
  const [shopId, setShopId] = useState<number|undefined>();
  const [sectorId, setSectorId] = useState<number|undefined>();
  const [greenLight, setGreenLight] = useState(false);

  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const active_shop = localStorage.getItem('active_shop');
      if(active_shop) {
        setShopId(JSON.parse(active_shop).id);
        setSectorId(JSON.parse(JSON.parse(active_shop).user_sector.sector_id));
        setGreenLight(true);
      }
    }
  }, []);
  return (
    greenLight === false ? <div>loading....</div> : 
    <FarmerPosts userType="Vendor" shopId={shopId} sectorId={sectorId} />
  );
}

Posts.layout = Farmer;

export default Posts;