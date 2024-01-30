import { IRoute } from './interfaces';

const routes: IRoute[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-grey',
    layout: '/delivery',
  },
  {
    path: '/delivery-routes',
    name: 'Delivery Routes',
    icon: 'fas fa-truck text-grey',
    layout: '/delivery',
  },
  {
    path: '/deliveries',
    name: 'Deliveries',
    icon: 'fas fa-shopping-cart text-grey',
    layout: '/delivery',
  },
  {
    path: '/trucks',
    name: 'Trucks',
    icon: 'fas fa-truck text-grey',
    layout: '/delivery',
  },
];
export default routes;
