// reactstrap components
import { useState } from 'react'
import Image from 'next/image';
import {
  Badge,
  Card, CardFooter, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress, Row, Table, UncontrolledDropdown, UncontrolledTooltip
} from "reactstrap";
// layout for this page
import PageHeader from '../../components/Headers/PageHeader';
// core components
import Admin from '../../layouts/Admin';


function Sales() {
  const [business_products, setBusinessProducts] = useState([
      {
          "id": 1,
          "business_id": 1,
          "product_id": 1,
          "product_price": 1000,
          "default_unit_package": 11,
          "product_description": "The best arosoir which is used to irrigate a small part.",
          "opening_stock": 240,
          "minimum_order_quantity": 1,
          "minimum_order_indicator": 1,
          "product_published": "Yes",
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-12T08:27:48.000000Z",
          "updated_at": "2022-09-12T08:27:48.000000Z",
          "deleted_at": null,
          "sub_category_id": 1,
          "group_id": null,
          "product_name": "Arosoir",
          "default_description": "The best arosoir which is used to irrigate a small part.",
          "unit_id": 3,
          "published": "Yes",
          "package_name": "Dozen",
          "sub_category_name": "Farming Equipments",
          "category_name": "Farm Inputs",
          "category_id": 2,
          "group_name": null,
          "stock_quantity": 240,
          "images": [
              {
                  "id": 1,
                  "product_id": 1,
                  "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\Arosoir_1662971722_0_16.tmp",
                  "image_type": "Featured",
                  "created_by": 1,
                  "updated_by": null,
                  "created_at": "2022-09-12T08:35:22.000000Z",
                  "updated_at": "2022-09-12T08:35:22.000000Z"
              },
              {
                  "id": 2,
                  "product_id": 1,
                  "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\Arosoir_1662971723_1_40.tmp",
                  "image_type": "Gallery",
                  "created_by": 1,
                  "updated_by": null,
                  "created_at": "2022-09-12T08:35:23.000000Z",
                  "updated_at": "2022-09-12T08:35:23.000000Z"
              },
              {
                  "id": 3,
                  "product_id": 1,
                  "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\Arosoir_1662971723_2_91.tmp",
                  "image_type": "Gallery",
                  "created_by": 1,
                  "updated_by": null,
                  "created_at": "2022-09-12T08:35:23.000000Z",
                  "updated_at": "2022-09-12T08:35:23.000000Z"
              }
          ],
          "tags": []
      },
      {
          "id": 3,
          "business_id": 1,
          "product_id": 3,
          "product_price": 1000,
          "default_unit_package": 11,
          "product_description": "The best arosoir which is used to irrigate a small part.",
          "opening_stock": 240,
          "minimum_order_quantity": 1,
          "minimum_order_indicator": 1,
          "product_published": "Yes",
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-14T11:17:41.000000Z",
          "updated_at": "2022-09-14T11:17:41.000000Z",
          "deleted_at": null,
          "sub_category_id": 1,
          "group_id": null,
          "product_name": "Botte",
          "default_description": "The best botte which is used to irrigate a small part.",
          "unit_id": 3,
          "published": "Yes",
          "package_name": "Dozen",
          "sub_category_name": "Farming Equipments",
          "category_name": "Farm Inputs",
          "category_id": 2,
          "group_name": null,
          "stock_quantity": 240,
          "images": [
              {
                  "id": 4,
                  "product_id": 3,
                  "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_Botte_1663154261_0_54.tmp",
                  "image_type": "Featured",
                  "created_by": 1,
                  "updated_by": null,
                  "created_at": "2022-09-14T11:17:41.000000Z",
                  "updated_at": "2022-09-14T11:17:41.000000Z"
              },
              {
                  "id": 5,
                  "product_id": 3,
                  "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_Botte_1663154261_1_87.tmp",
                  "image_type": "Gallery",
                  "created_by": 1,
                  "updated_by": null,
                  "created_at": "2022-09-14T11:17:41.000000Z",
                  "updated_at": "2022-09-14T11:17:41.000000Z"
              },
              {
                  "id": 6,
                  "product_id": 3,
                  "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_Botte_1663154261_2_59.tmp",
                  "image_type": "Gallery",
                  "created_by": 1,
                  "updated_by": null,
                  "created_at": "2022-09-14T11:17:41.000000Z",
                  "updated_at": "2022-09-14T11:17:41.000000Z"
              }
          ],
          "tags": []
      }
  ]);
  const [sales, setSales] = useState([
      {
          "id": 1,
          "order_id": 1,
          "business_product_id": 1,
          "delivery_id": 1,
          "delivery_code": null,
          "buyer_code": null,
          "quantity": 27,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 0,
          "payment_status": "success",
          "order_status": "success",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-14T16:56:18.000000Z",
          "updated_at": "2022-09-14T16:56:18.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 1,
              "business_id": 1,
              "product_id": 1,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-12T14:07:57.000000Z",
              "updated_at": "2022-09-12T14:07:57.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Arosoir",
              "default_description": "The best arosoir which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 1,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1662991677_0_38.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 1,
              "order_invoice": "2022-695307",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Offline",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T16:56:18.000000Z",
              "updated_at": "2022-09-14T16:56:18.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 2,
          "order_id": 1,
          "business_product_id": 4,
          "delivery_id": 1,
          "delivery_code": null,
          "buyer_code": null,
          "quantity": 17,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 20,
          "payment_status": "success",
          "order_status": "success",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-14T16:56:18.000000Z",
          "updated_at": "2022-09-14T16:56:18.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 4,
              "business_id": 1,
              "product_id": 3,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T11:19:03.000000Z",
              "updated_at": "2022-09-14T11:19:03.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Botte",
              "default_description": "The best botte which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 4,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1663154343_0_52.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 1,
              "order_invoice": "2022-695307",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Offline",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T16:56:18.000000Z",
              "updated_at": "2022-09-14T16:56:18.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 3,
          "order_id": 2,
          "business_product_id": 1,
          "delivery_id": 1,
          "delivery_code": null,
          "buyer_code": null,
          "quantity": 27,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 0,
          "payment_status": "success",
          "order_status": "success",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-14T17:47:32.000000Z",
          "updated_at": "2022-09-14T17:47:32.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 1,
              "business_id": 1,
              "product_id": 1,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-12T14:07:57.000000Z",
              "updated_at": "2022-09-12T14:07:57.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Arosoir",
              "default_description": "The best arosoir which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 1,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1662991677_0_38.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 2,
              "order_invoice": "2022-175126",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Offline",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T17:47:31.000000Z",
              "updated_at": "2022-09-14T17:47:31.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 4,
          "order_id": 2,
          "business_product_id": 4,
          "delivery_id": 1,
          "delivery_code": null,
          "buyer_code": null,
          "quantity": 17,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 20,
          "payment_status": "success",
          "order_status": "success",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-14T17:47:32.000000Z",
          "updated_at": "2022-09-14T17:47:32.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 4,
              "business_id": 1,
              "product_id": 3,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T11:19:03.000000Z",
              "updated_at": "2022-09-14T11:19:03.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Botte",
              "default_description": "The best botte which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 4,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1663154343_0_52.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 2,
              "order_invoice": "2022-175126",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Offline",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T17:47:31.000000Z",
              "updated_at": "2022-09-14T17:47:31.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 5,
          "order_id": 3,
          "business_product_id": 1,
          "delivery_id": 1,
          "delivery_code": null,
          "buyer_code": null,
          "quantity": 27,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 0,
          "payment_status": "success",
          "order_status": "success",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-27T12:37:44.000000Z",
          "updated_at": "2022-09-27T12:37:44.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 1,
              "business_id": 1,
              "product_id": 1,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-12T14:07:57.000000Z",
              "updated_at": "2022-09-12T14:07:57.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Arosoir",
              "default_description": "The best arosoir which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 1,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1662991677_0_38.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 3,
              "order_invoice": "2022-651710",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Offline",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-27T12:37:44.000000Z",
              "updated_at": "2022-09-27T12:37:44.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 6,
          "order_id": 3,
          "business_product_id": 4,
          "delivery_id": 1,
          "delivery_code": null,
          "buyer_code": null,
          "quantity": 17,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 20,
          "payment_status": "success",
          "order_status": "success",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-27T12:37:45.000000Z",
          "updated_at": "2022-09-27T12:37:45.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 4,
              "business_id": 1,
              "product_id": 3,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T11:19:03.000000Z",
              "updated_at": "2022-09-14T11:19:03.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Botte",
              "default_description": "The best botte which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 4,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1663154343_0_52.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 3,
              "order_invoice": "2022-651710",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Offline",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-27T12:37:44.000000Z",
              "updated_at": "2022-09-27T12:37:44.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 7,
          "order_id": 4,
          "business_product_id": 1,
          "delivery_id": 1,
          "delivery_code": "2232",
          "buyer_code": "7604",
          "quantity": 27,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 0,
          "payment_status": "success",
          "order_status": "pending",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-28T09:23:27.000000Z",
          "updated_at": "2022-09-28T09:23:27.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 1,
              "business_id": 1,
              "product_id": 1,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-12T14:07:57.000000Z",
              "updated_at": "2022-09-12T14:07:57.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Arosoir",
              "default_description": "The best arosoir which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 1,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1662991677_0_38.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 4,
              "order_invoice": "2022-816779",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Online",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-28T09:23:27.000000Z",
              "updated_at": "2022-09-28T09:23:27.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 8,
          "order_id": 4,
          "business_product_id": 4,
          "delivery_id": 1,
          "delivery_code": "4163",
          "buyer_code": "2759",
          "quantity": 17,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 20,
          "payment_status": "success",
          "order_status": "pending",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-28T09:23:27.000000Z",
          "updated_at": "2022-09-28T09:23:27.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 4,
              "business_id": 1,
              "product_id": 3,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T11:19:03.000000Z",
              "updated_at": "2022-09-14T11:19:03.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Botte",
              "default_description": "The best botte which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 4,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1663154343_0_52.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 4,
              "order_invoice": "2022-816779",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Online",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-28T09:23:27.000000Z",
              "updated_at": "2022-09-28T09:23:27.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 9,
          "order_id": 5,
          "business_product_id": 1,
          "delivery_id": 1,
          "delivery_code": "4443",
          "buyer_code": "9556",
          "quantity": 27,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 0,
          "payment_status": "success",
          "order_status": "pending",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-28T09:24:05.000000Z",
          "updated_at": "2022-09-28T09:24:05.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 1,
              "business_id": 1,
              "product_id": 1,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-12T14:07:57.000000Z",
              "updated_at": "2022-09-12T14:07:57.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Arosoir",
              "default_description": "The best arosoir which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 1,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1662991677_0_38.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 5,
              "order_invoice": "2022-815359",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Online",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-28T09:24:04.000000Z",
              "updated_at": "2022-09-28T09:24:04.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 10,
          "order_id": 5,
          "business_product_id": 4,
          "delivery_id": 1,
          "delivery_code": "1828",
          "buyer_code": "6835",
          "quantity": 17,
          "unit_package": 11,
          "unit_price": 1000,
          "delivery_amount": 3000,
          "product_discount": 20,
          "payment_status": "success",
          "order_status": "pending",
          "order_intransit_updates": null,
          "delivery_estimated_time": null,
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-28T09:24:05.000000Z",
          "updated_at": "2022-09-28T09:24:05.000000Z",
          "deleted_at": null,
          "business_product": {
              "id": 4,
              "business_id": 1,
              "product_id": 3,
              "product_price": 1000,
              "default_unit_package": 11,
              "product_description": "The best arosoir which is used to irrigate a small part.",
              "opening_stock": 240,
              "minimum_order_quantity": 1,
              "minimum_order_indicator": 1,
              "product_published": "Yes",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-14T11:19:03.000000Z",
              "updated_at": "2022-09-14T11:19:03.000000Z",
              "deleted_at": null,
              "sub_category_id": 1,
              "group_id": null,
              "product_name": "Botte",
              "default_description": "The best botte which is used to irrigate a small part.",
              "unit_id": 3,
              "published": "Yes",
              "business_product_id": 4,
              "image_path": "C:\\xampp\\htdocs\\Ehaho\\public/images/products\\ehaho_1663154343_0_52.tmp",
              "image_type": "Featured",
              "owner_type": "Business"
          },
          "order": {
              "id": 5,
              "order_invoice": "2022-815359",
              "buyer_id": 1,
              "order_paid_amount": 1700,
              "order_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "sale_channel": "Online",
              "sale_platform": "Web",
              "sale_date": "2022-09-12",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-28T09:24:04.000000Z",
              "updated_at": "2022-09-28T09:24:04.000000Z",
              "deleted_at": null
          }
      }
  ]);
  const [updating, setUpdating] = useState(false);
  const [updatingSale, setUpdatingSale] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState("");
  const [updatingMessage, setUpdatingMessage] = useState("");
  const [savingSale, setSavingSale] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [savingMessage, setSavingMessage] = useState("");

  return (
    <>
      <PageHeader page="Sales" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Sales table</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col" className="no-wrap">Product Image</th>
                        <th scope="col" className="no-wrap">Product Name</th>
                        <th scope="col" className="no-wrap">Quantity</th>
                        <th scope="col" className="no-wrap">Unit Price</th>
                        <th scope="col" className="no-wrap">Discount</th>
                        <th scope="col" className="no-wrap">Total Amount</th>
                        <th scope="col" className="no-wrap">Payment method</th>
                        <th scope="col" className="no-wrap">Payment status</th>
                        <th scope="col" className="no-wrap">Order status</th>
                        <th scope="col" className="no-wrap">Order invoice</th>
                        <th scope="col" className="no-wrap">Customer</th>
                        <th scope="col" className="no-wrap">Shipping address</th>
                        <th scope="col" className="no-wrap">Sale channel</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sales.map((order,index) => (
                            <tr key={index}>
                                <td scope="row">{(index+1)}</td>
                                <td scope="row"><Image layout="fill" src="/{order.business_product.image_path}" alt="" /></td>
                                <td scope="row" className="no-wrap">{order.business_product.product_name}</td>
                                <td scope="row" className="no-wrap">{order.quantity}</td>
                                <td scope="row" className="no-wrap">{order.unit_price} RWF</td>
                                <td scope="row" className="no-wrap">{order.product_discount}%</td>
                                <td scope="row" className="no-wrap">{((order.unit_price-(order.product_discount/100*order.unit_price))*order.quantity)} RWF</td>
                                <td scope="row" className="no-wrap">{order.order.payment_method}</td>
                                <td scope="row" className="no-wrap">{order.payment_status}</td>
                                <td scope="row" className="no-wrap">{order.order_status} {(order.order_status=="intransit")?(order.order_intransit_updates):(null)}</td>
                                <td scope="row" className="no-wrap">{order.order.order_invoice}</td>
                                {/*<td scope="row">{order.order.first_name} {order.order.last_name} {order.order.phone}</td>*/}
                                <td scope="row" className="no-wrap">{<button className="btn btn-sm form-control waves-effect waves-light btn-outline-success">View Customer</button>}</td>
                                <td scope="row" className="no-wrap">{(order.order.shipping_address_id)?(<button className="btn btn-sm form-control waves-effect waves-light btn-outline-success">View Shipping Info</button>):("No Address")}</td>
                                <td scope="row">{order.order.sale_channel}</td>
                                <td scope="row">
                                    <div className=" btn-actions">
                                        <a href={void(0)}><i className="mdi mdi-pencil text-primary mr-1 ml-1"></i></a>
                                        <a href={void(0)}><i className="mdi mdi-delete-forever text-danger mr-1 ml-1"></i></a>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th>ID</th>
                        <th className="no-wrap">Product Image</th>
                        <th className="no-wrap">Product Name</th>
                        <th className="no-wrap">Quantity</th>
                        <th className="no-wrap">Unit Price</th>
                        <th className="no-wrap">Discount</th>
                        <th className="no-wrap">Total Amount</th>
                        <th className="no-wrap">Payment method</th>
                        <th className="no-wrap">Payment status</th>
                        <th className="no-wrap">Order status</th>
                        <th className="no-wrap">Order invoice</th>
                        <th className="no-wrap">Customer</th>
                        <th className="no-wrap">Shipping address</th>
                        <th className="no-wrap">Sale channel</th>
                        <th>Action</th>
                    </tr>
                </tfoot>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex={-1}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

Sales.layout = Admin;

export default Sales;
