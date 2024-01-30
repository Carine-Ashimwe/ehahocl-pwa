import { IRoute } from './interfaces';

const routes: IRoute[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-grey',
    layout: '/vendor',
  },
  {
    path: '/products',
    name: 'Products',
    icon: 'ni ni-box-2 text-grey',
    layout: '/vendor',
  },
  {
    path: '/purchases',
    name: 'Purchases',
    icon: 'ni ni-money-coins text-grey',
    layout: '/vendor',
  },
  {
    path: '/sales',
    name: 'Sales',
    icon: 'ni ni-delivery-fast text-grey',
    layout: '/vendor',
  },
  {
    path: '/purchase-requests',
    name: 'PurchaseRequests',
    icon: 'ni ni-delivery-fast text-grey',
    layout: '/vendor',
  },
  {
    path: '/damages',
    name: 'Damages',
    icon: 'ni ni-archive-2 text-grey',
    layout: '/vendor',
  },
  {
    path: '/profile',
    name: 'Settings',
    icon: 'fas fa-gears text-grey',
    layout: '/vendor',
  },
];
export default routes;
