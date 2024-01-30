import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FarmerPosts from '../../../components/PageChange/FarmerPosts';
import Admin from '../../../layouts/Admin';
// layout for this page

function Posts() {
  const [greenLight, setGreenLight] = useState(false);
  const router = useRouter();
  const params = router.query;
  const shopId: number | undefined = params.id ? parseInt(params.id as string) : undefined;

  // Initial hook to Get Localstorage  
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
        setGreenLight(true);
    }
  }, []);
  return (
    greenLight === false ? <div>loading....</div> : 
    <FarmerPosts userType="Admin" shopId={shopId} sectorId={1} />
  );
}

Posts.layout = Admin;

export default Posts;