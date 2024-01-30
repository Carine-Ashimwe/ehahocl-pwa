import { IRoute } from './interfaces';

const routes: IRoute[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-grey',
    layout: '/farmer',
  },
  {
    path: '/products',
    name: 'Products',
    icon: 'ni ni-box-2 text-grey',
    layout: '/farmer',
  },
  {
    path: '/posts',
    name: 'Posts',
    icon: 'ni ni-box-2 text-grey',
    layout: '/farmer',
  },
  {
    path: '/orders',
    name: 'Orders',
    icon: 'ni ni-delivery-fast text-grey',
    layout: '/farmer',
  },
  {
    path: '/pre-harvest',
    name: 'Pre Harvests',
    icon: 'ni ni-box-2 text-grey',
    layout: '/farmer',
  },
  {
    path: '/pre-orders',
    name: 'Pre Orders',
    icon: 'ni ni-box-2 text-grey',
    layout: '/farmer',
  },
  {
    path: '/purchase-requests',
    name: 'Purchase Requests',
    icon: 'ni ni-delivery-fast text-grey',
    layout: '/farmer',
  },
  // {
  //   path: '/purchase-orders',
  //   name: 'Purchase Orders',
  //   icon: 'ni ni-money-coins text-grey',
  //   layout: '/client',
  // },
  // {
  //   path: '/damages',
  //   name: 'Damages',
  //   icon: 'ni ni-archive-2 text-grey',
  //   layout: '/farmer',
  // },
  {
    path: '/profile',
    name: 'Settings',
    icon: 'fas fa-gears text-grey',
    layout: '/farmer',
  },
];
export default routes;
