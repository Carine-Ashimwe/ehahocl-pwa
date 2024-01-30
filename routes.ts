import { IRoute } from './interfaces';

const routes: IRoute[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-grey',
    layout: '/admin',
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'ni ni-circle-08',
    layout: '/admin',
  },
  {
    path: '/markets',
    name: 'Markets',
    icon: 'fas fa-store text-grey',
    layout: '/admin',
  },
  {
    path: '/market-prices',
    name: 'Market Prices',
    icon: 'fas fa-chart-line text-grey',
    layout: '/admin',
  },
  {
    path: '/farmers',
    name: 'Farmers',
    icon: 'ni ni-satisfied text-grey',
    layout: '/admin',
  },
  {
    path: '/farmer-products',
    name: 'Farmer Products',
    icon: 'fas fa-list text-grey',
    layout: '/admin',
  },
  {
    path: '/farmer-posts',
    name: 'Farmer Posts',
    icon: 'fas fa-list text-grey',
    layout: '/admin',
  },
  {
    path: '/farmer-orders',
    name: 'Farmer Orders',
    icon: 'fas fa-cutlery text-grey',
    layout: '/admin',
  },
  {
    path: '/agrodealers',
    name: 'Agrodealers',
    icon: 'ni ni-box-2 text-grey',
    layout: '/admin',
  },
  {
    path: '/agrodealer-products',
    name: 'Agrodealer Products',
    icon: 'fas fa-list-ol text-grey',
    layout: '/admin',
  },
  {
    path: '/agrodealer-orders',
    name: 'Agrodealer Orders',
    icon: 'fas fa-credit-card text-grey',
    layout: '/admin',
  },
  {
    path: '/processors',
    name: 'Processors',
    icon: 'ni ni-box-2 text-grey',
    layout: '/admin',
  },
  {
    path: '/processor-products',
    name: 'Processor Products',
    icon: 'fas fa-list-check text-grey',
    layout: '/admin',
  },
  {
    path: '/processor-orders',
    name: 'Processor Orders',
    icon: 'ni ni-basket text-grey',
    layout: '/admin',
  },
  {
    path: '/delivery-providers',
    name: 'Delivery Providers',
    icon: 'ni ni-delivery-fast text-grey',
    layout: '/admin',
  },
  {
    path: '/delivery-trucks',
    name: 'Delivery Trucks',
    icon: 'fas fa-truck text-grey',
    layout: '/admin',
  },
  {
    path: '/delivery-orders',
    name: 'Delivery Orders',
    icon: 'fas fa-shopping-cart text-grey',
    layout: '/admin',
  },
  {
    path: '/purchase-requests',
    name: 'Purchase Requests',
    icon: 'fas fa-shopping-cart text-grey',
    layout: '/admin',
  },
  {
    path: '/product-categories',
    name: 'Product Categories',
    icon: 'fas fa-table text-grey',
    layout: '/admin',
  },
  {
    path: '/product-sub-categories',
    name: 'Product Sub Categories',
    icon: 'ni ni-collection text-grey',
    layout: '/admin',
  },
  {
    path: '/product-groups',
    name: 'Product Groups',
    icon: 'fas fa-object-group text-grey',
    layout: '/admin',
  },
  {
    path: '/product-tags',
    name: 'Product Tags',
    icon: 'fas fa-tags text-grey',
    layout: '/admin',
  },
  {
    path: '/unit-of-measurements',
    name: 'Units',
    icon: 'fas fa-scale-balanced text-grey',
    layout: '/admin',
  },
  {
    path: '/farm-resource-categories',
    name: 'Farm Resource Categories',
    icon: 'fa-solid fa-bars',
    layout: '/admin',
  },
  {
    path: '/farm-resource-sub-categories',
    name: 'Farm Resource Sub Categories',
    icon: 'fa-solid fa-bars-staggered',
    layout: '/admin',
  },
  {
    path: '/farm-resources',
    name: 'Farm Resources',
    icon: 'fa-regular fa-rectangle-list',
    layout: '/admin',
  },
  // {
  //   path: '/farms',
  //   name: 'Farms',
  //   icon: 'fa fa-home',
  //   layout: '/admin',
  // },
  // {
  //   path: '/parameters',
  //   name: 'Parameters',
  //   icon: 'fa fa-crosshairs',
  //   layout: '/admin',
  // },
  // {
  //   path: '/sensors',
  //   name: 'Sensors',
  //   icon: 'fa fa-eyedropper',
  //   layout: '/admin',
  // },
  // {
  //   path: '/sensor-data',
  //   name: 'Sensor Data',
  //   icon: 'fa fa-line-chart',
  //   layout: '/admin',
  // },
];
export default routes;