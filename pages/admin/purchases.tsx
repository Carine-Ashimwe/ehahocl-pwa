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


function Purchases() {
  const [business_products, setBusinessProducts] = useState([
      {
          "id": 1,
          "business_id": 1,
          "product_id": 1,
          "product_price": 1000,
          "default_unit_package": 11,
          "product_description": "The best arosoir which is used to irrigate a small part.",
          "opening_stock": 240,
          "minimum_purchase_quantity": 1,
          "minimum_purchase_indicator": 1,
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
          "minimum_purchase_quantity": 1,
          "minimum_purchase_indicator": 1,
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
  const [purchases, setPurchases] = useState([
      {
          "id": 1,
          "purchase_id": 1,
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
          "purchase_status": "success",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 1,
              "purchase_invoice": "2022-695307",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Offline",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 1,
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
          "purchase_status": "success",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 1,
              "purchase_invoice": "2022-695307",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Offline",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 2,
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
          "purchase_status": "success",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 2,
              "purchase_invoice": "2022-175126",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Offline",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 2,
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
          "purchase_status": "success",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 2,
              "purchase_invoice": "2022-175126",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Offline",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 3,
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
          "purchase_status": "success",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 3,
              "purchase_invoice": "2022-651710",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Offline",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 3,
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
          "purchase_status": "success",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 3,
              "purchase_invoice": "2022-651710",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "success",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Offline",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 4,
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
          "purchase_status": "pending",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 4,
              "purchase_invoice": "2022-816779",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Online",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 4,
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
          "purchase_status": "pending",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 4,
              "purchase_invoice": "2022-816779",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Online",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 5,
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
          "purchase_status": "pending",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 5,
              "purchase_invoice": "2022-815359",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Online",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
          "purchase_id": 5,
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
          "purchase_status": "pending",
          "purchase_intransit_updates": null,
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
              "minimum_purchase_quantity": 1,
              "minimum_purchase_indicator": 1,
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
          "purchase": {
              "id": 5,
              "purchase_invoice": "2022-815359",
              "buyer_id": 1,
              "purchase_paid_amount": 1700,
              "purchase_status": "pending",
              "payment_status": "success",
              "payment_method": "Mobile_money",
              "shipping_address_id": 1,
              "purchase_channel": "Online",
              "purchase_platform": "Web",
              "purchase_date": "2022-09-12",
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
  const [updatingPurchase, setUpdatingPurchase] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState("");
  const [updatingMessage, setUpdatingMessage] = useState("");
  const [savingPurchase, setSavingPurchase] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [savingMessage, setSavingMessage] = useState("");

  return (
    <>
      <PageHeader page="Purchases" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Purchases table</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
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
                        <th className="no-wrap">purchase status</th>
                        <th className="no-wrap">purchase invoice</th>
                        <th className="no-wrap">Customer</th>
                        <th className="no-wrap">Shipping address</th>
                        <th className="no-wrap">Purchase channel</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        purchases.map((purchase,index) => (
                            <tr key={index}>
                                <td>{(index+1)}</td>
                                <td><Image layout="fill" src="/{purchase.business_product.image_path}" alt="" /></td>
                                <td className="no-wrap">{purchase.business_product.product_name}</td>
                                <td className="no-wrap">{purchase.quantity}</td>
                                <td className="no-wrap">{purchase.unit_price} RWF</td>
                                <td className="no-wrap">{purchase.product_discount}%</td>
                                <td className="no-wrap">{((purchase.unit_price-(purchase.product_discount/100*purchase.unit_price))*purchase.quantity)} RWF</td>
                                <td className="no-wrap">{purchase.purchase.payment_method}</td>
                                <td className="no-wrap">{purchase.payment_status}</td>
                                <td className="no-wrap">{purchase.purchase_status} {(purchase.purchase_status=="intransit")?(purchase.purchase_intransit_updates):(null)}</td>
                                <td className="no-wrap">{purchase.purchase.purchase_invoice}</td>
                                {/*<td>{purchase.purchase.first_name} {purchase.purchase.last_name} {purchase.purchase.phone}</td>*/}
                                <td className="no-wrap">{<button className="btn btn-sm form-control waves-effect waves-light btn-outline-success">View Customer</button>}</td>
                                <td className="no-wrap">{(purchase.purchase.shipping_address_id)?(<button className="btn btn-sm form-control waves-effect waves-light btn-outline-success">View Shipping Info</button>):("No Address")}</td>
                                <td>{purchase.purchase.purchase_channel}</td>
                                <td>
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
                        <th className="no-wrap">purchase status</th>
                        <th className="no-wrap">purchase invoice</th>
                        <th className="no-wrap">Customer</th>
                        <th className="no-wrap">Shipping address</th>
                        <th className="no-wrap">Purchase channel</th>
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

Purchases.layout = Admin;

export default Purchases;
