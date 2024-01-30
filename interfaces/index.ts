export interface ILogin {
  phoneoremail: string;
  password: string;
}

export interface IRoute {
  path: string;
  name: string;
  icon: string;
  layout: string;
}

export interface IUser {
  user: any;
  approved: string;
  active: string;
  created_at?: String;
  id?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  gender?: string;
  email?: string;
  phone?: string;
  role?: string;
  user_picture?: string;
  profile?: IProfile;
  businesses?: [IShop];
  password?: string;
  password_confirmation?: string;
  register_platform?: string;
}

export interface ILocation {
  id: number;
  name: string;
}

export interface IbizSec {
  id: number;
  sector_name: string;
}

export interface IResponse {
  data: any;
  status: Boolean;
  message: string;
  token?: string;
  user?: IUser;
  profile?: IProfile;
}

export interface IProductPayload {
  product_category: number;
  product_sub_category: number;
  product_group: number;
}

export interface IUserSector {
  id: number;
  user_id: number;
  sector_id: number;
  active: string;
  user: IUser;
  sector: IbizSec;
}

export interface IShop {
  id?: number;
  user_sector_id?: number;
  user_id?: number;
  sector_id?: number;
  business_name: string;
  business_phone: string;
  business_email: string;
  business_logo: string;
  banner_image: string;
  country: string;
  province?: any | ILocation;
  district?: any | ILocation;
  sector?: any | ILocation;
  cell?: any | ILocation;
  village?: any | ILocation;
  street_number?: string;
  common_place?: string;
  address_1?: string;
  address_2?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  user_sector?: IUserSector;
  page_published?: String | null;
  active?: String;
  created_at?: String;
}

export interface IProfile {
  id?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  gender?: string;
  user_picture?: string;
  country?: string;
  province?: number;
  district?: number;
  sector?: number;
  cell?: number;
  village?: number;
  street_number?: string;
  common_place?: string;
  address_1?: string;
  address_2?: string;
  state?: string;
  city?: string;
  zip_code?: string;
}

export interface IProductCategory {
  id?: number;
  category_name: string;
  products?: [IProduct];
  business_products?: [IBusinessProduct];
  sub_categories?: [IProductSubCategory];
  created_at?: string;
}

export interface IProductSubCategory {
  id?: number;
  category?: IProductCategory;
  category_id: number;
  sub_category_name: string;
}

export interface IProGroup {
  id?: number;
  group_name: string;
  created_at?: string;
}

export interface IProTag {
  id?: number;
  tag_name: string;
  created_at?: string;
}

export interface IUnit {
  id?: number;
  unit_name: string;
  packages: [IPackage];
}

export interface IPackage {
  id?: number;
  package_name: string;
  smallest_unit_conversion: number;
}

export interface IProduct {
  id?: number;
  sub_category_id: number;
  sub_category_name?: string;
  group_id?: number;
  group_name?: string;
  product_name: string;
  default_description: string;
  unit_id: number;
  unit?: IUnit;
  images?: IImage[];
  product_images?: string[];
  packages?: IPackage[];
  group?: IProGroup;
  sub_category?: IProductSubCategory;
  published?: String;
}

export interface IImage {
  id?: number;
  product_id?: number;
  business_product_id?: number;
  image_path: string;
  image_type?: string;
}

export interface OrderProduct {
  id: number;
  order_id: number;
  business_product_id: number;
  delivery_id?: number;
  delivery_code: string;
  buyer_code: string;
  quantity: number;
  unit_package: number;
  unit_price: number;
  delivery_amount: number;
  product_discount: number;
  payment_status: string;
  order_status: string;
  order_intransit_updates: string;
  delivery_estimated_time: string;
  created_at: string;
  business_product: IBusinessProduct;
  order: {
    id: number;
    order_invoice: string;
    buyer_id: number;
    order_paid_amount: number;
    order_status: string;
    payment_status: string;
    payment_method: string;
    shipping_address_id?: number;
    sale_channel: string;
    sale_platform: string;
    sale_date: string;
  };
}

export interface ProOrder {
  id: number;
  order_id: number;
  business_product_id: number;
  delivery_id: number;
  delivery_code: string | number;
  buyer_code: string | number;
  quantity: number;
  unit_package: number;
  unit_price: number;
  delivery_amount: number;
  product_discount: number;
  payment_status: string;
  order_status: string;
  order_intransit_updates: string;
  delivery_estimated_time: string;
}

export interface ISAddress {
  id?: number;
  user_id: number;
  phone: string;
  email: string;
  country: string;
  province: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  sector: {
    id: number;
    name: string;
  };
  cell: {
    id: number;
    name: string;
  };
  village: {
    id: number;
    name: string;
  };
  street_number: string;
  common_place: string;
  address_1: string;
  address_2: string;
  state: string;
  city: string;
  zip_code: string;
  default_address: string;
}

export interface IOrder {
  id?: number;
  order_invoice: string;
  buyer_id: number;
  order_paid_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  shipping_address_id?: number;
  sale_channel: string;
  sale_platform: string;
  sale_date: string;
  created_at: string;
  products: [ProOrder];
  shipping_address: ISAddress;
}

export interface IBusinessProduct {
  id?: number;
  business_id: number;
  product_id: number;
  product_price: number;
  default_unit_package: number;
  product_description: string;
  opening_stock: number;
  minimum_order_quantity: number;
  minimum_order_indicator?: number;
  created_at?: string;
  product_published?: string;
  tags?: any;
  packages?: [IPackage];
  images?: any;
  business_images?: [IImage];
  default_package?: IPackage;
  product?: IProduct;
  business?: IShop;
  product_stock?: {
    stock_quantity: number;
  };
  updated_by?: number;
  disabled_by?: number;
}

export interface IPurchase {
  id?: number;
  business_id: number;
  supplier_id: number;
  purchase_paid_amount: number;
  payment_status: string;
  purchase_status: string;
  payment_method: string;
  purchase_channel: string;
  purchase_platform: string;
  purchase_date: string;
  purchase_products: [IPurchaseProduct];
}

export interface IPurchaseProduct {
  business_product_id: number;
  quantity: number;
  unit_package: number;
  unit_price: number;
  product_discount: number;
  packages: [IPackage];
}

export interface IDonePurchase {
  id?: number;
  business_id: number;
  supplier_id: number;
  purchase_paid_amount: number;
  payment_status: string;
  purchase_status: string;
  payment_method: string;
  receipt_number: string;
  purchase_channel: string;
  purchase_platform: string;
  purchase_date: string;
  supplier: {
    id: number;
    phone: string;
    email?: string;
    profile: IProfile;
  };
  products: [IDonePurchaseProduct];
}

export interface IDonePurchaseProduct {
  business_product_id: number;
  quantity: number;
  unit_package: number;
  unit_price: number;
  product_discount: number;
  packages?: [IPackage];
  package: IPackage;
  business_product: IBusinessProduct;
}

export interface ISale {
  id?: number;
  business_id: number;
  buyer_id: number;
  order_paid_amount: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  sale_channel: string;
  sale_platform: string;
  sale_date: string;
  order_products: [ISaleProduct];
}

export interface ISaleProduct {
  business_product_id: number;
  delivery_id?: number | null;
  quantity: number;
  unit_package: number;
  unit_price: number;
  product_discount: number;
  delivery_amount?: number | null;
  packages: [IPackage];
}

export interface IDoneSale {
  id?: number;
  business_id: number;
  supplier_id: number;
  order_paid_amount: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  order_invoice: string;
  sale_channel: string;
  sale_platform: string;
  sale_date: string;
  products: [IDoneSaleProduct];
  buyer: {
    id: number;
    phone: string;
    email?: string;
    profile: IProfile;
  };
  shipping_address: ISAddress;
  created_at?: string;
}

export interface IDoneSaleProduct {
  id: number;
  business_product_id: number;
  quantity: number;
  unit_package: number;
  unit_price: number;
  product_discount: number;
  payment_status?: string;
  delivery_id?: number;
  delivery_amount?: number;
  delivery_estimated_time?: string;
  order_status?: string;
  order_intransit_updates?: string;
  packages?: [IPackage];
  package: IPackage;
  business_product: IBusinessProduct;
}

export interface IPreHarvest {
  id?: number;
  product_id: number;
  business_id: number;
  harvest_quantity: number;
  harvest_date: string;
  harvest_package: number;
  harvest_frequency: string;
  harvest_details: string;
  created_at?: string;
  package?: IPackage;
  product?: IProduct;
  pre_harvest_images?: [IImage | string];
  packages?: [IPackage];
}

export interface IDamage {
  id?: number;
  business_product_id: number;
  quantity: number;
  unit_package: number;
  damage_date: string;
  packages?: [IPackage];
  package?: IPackage;
  business_product?: IBusinessProduct;
}

export interface IDeliveryRoute {
  id: number;
  from: ILocation;
  to: ILocation;
  active: string;
}

export interface IBusinessDeliveryRoute {
  id?: number;
  from?: number;
  business_id?: number;
  route_id: number;
  estimated_days: number;
  estimated_hours: number;
  estimated_minutes: number;
  active?: string;
  packages?: [IDeliveryRoutePackage];
  route?: IDeliveryRoute;
  business?: IShop;
}

export interface IDeliveryRoutePackage {
  id?: number;
  business_route_id?: number;
  minimum_quantity: number;
  maximum_quantity: number;
  delivery_fees: number;
  active?: string;
}

export interface IOrderRequest {
  id: number;
  order_request_number: string;
  buyer_id: number;
  product_id: number;
  product: IProduct;
  package_id: number;
  package: IPackage;
  quantity: number;
  order_request_frequency: string;
  request_status: string;
  request_details: string;
  client: IUser;
  created_at: string;
}

export interface IPurchaseRequest {
  id: number;
  order_request_number: string;
  buyer_id: number;
  product_id: number;
  product: IProduct;
  package_id: number;
  package: IPackage;
  quantity: number;
  order_request_frequency: string;
  request_status: string;
  request_details: string;
  client: IUser;
  created_at: string;
}

export interface IPreOrder {
  pre_order_invoice: string;
  buyer_id: number;
  pre_harvest_id: number;
  pre_order_quantity: number;
  order_request_frequency: string;
  pre_order_status: string;
  shipping_address_id: number;
  comment: string;
  order_platform: string;
  buyer: [IUser];
  created_at: string;
}

export interface IFarmResourceCategory {
  id?: number;
  category_name: string;
  farm_resource_sub_categories?: [IFarmResourceSubCategory];
  farm_resource?: [IFarmResource];
  created_at?: string;
}

export interface IFarmResourceSubCategory {
  id?: number;
  sub_category_name: string;
  category_id: number;
  farm_resource_category?: IFarmResourceCategory;
  resources?: [IFarmResource];
  created_at?: string;
}

export interface IFarmResource {
  id?: number;
  farm_resource_title: string;
  farm_resource_summary: string;
  sub_category_id: number;
  farm_resource_banner: string;
  farm_resource_file: string;
  farm_resource_link: string;
  farm_resource_category?: IFarmResourceCategory;
  farm_resource_sub_category?: IFarmResourceSubCategory;
  created_at?: string;
}

export interface IFarm {
  id?: number;
  farm_name: string;
  created_at?: string;
}

export interface IMarket {
  id?: number;
  market_name: string;
  country?: string;
  province?: number;
  district?: number;
  sector?: number;
  cell?: number;
  village?: number;
  created_at?: string;
}

export interface IMarketPrice {
  updated_at?: string;
  group: any;
  id?: number;
  market_id?: number;
  market?: IMarket;
  product_id?: number;
  product?: IProduct;
  product_group_id?: number;
  productGroup?: IProGroup;
  wholesale_price: number;
  retail_price: number;
  created_at?: string;
}

export interface IParameter {
  id?: number;
  symbol: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  rounding: number;
}

export interface ISensor {
  id?: number;
  serial_number: string;
  farm_id: number | undefined;
  description: string;
  farm?: IFarm;
  created_at?: string;
}

export interface ISensorData {
  id: number;
  sensor_id: number;
  parameter_id: number;
  value: number;
  sensored_date: string;
  status: string;
  created_at: string;
  sensor: ISensor;
  parameter: IParameter;
}
