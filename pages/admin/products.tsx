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


function Products() {
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
  const [products, setProducts] = useState([
      {
          "id": 1,
          "sub_category_id": 1,
          "group_id": null,
          "product_name": "Arosoir",
          "default_description": "The best arosoir which is used to irrigate a small part.",
          "unit_id": 3,
          "published": "Yes",
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-12T08:27:48.000000Z",
          "updated_at": "2022-09-12T08:27:48.000000Z",
          "deleted_at": null,
          "sub_category_name": "Farming Equipments",
          "category_name": "Farm Inputs",
          "category_id": 2,
          "group_name": null,
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
          "unit": {
              "id": 3,
              "unit_name": "Piece",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-09T13:05:48.000000Z",
              "updated_at": "2022-09-09T13:05:48.000000Z",
              "deleted_at": null
          }
      },
      {
          "id": 3,
          "sub_category_id": 1,
          "group_id": null,
          "product_name": "Botte",
          "default_description": "The best botte which is used to irrigate a small part.",
          "unit_id": 3,
          "published": "Yes",
          "created_by": 1,
          "updated_by": null,
          "deleted_by": null,
          "created_at": "2022-09-14T11:17:41.000000Z",
          "updated_at": "2022-09-14T11:17:41.000000Z",
          "deleted_at": null,
          "sub_category_name": "Farming Equipments",
          "category_name": "Farm Inputs",
          "category_id": 2,
          "group_name": null,
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
          "unit": {
              "id": 3,
              "unit_name": "Piece",
              "created_by": 1,
              "updated_by": null,
              "deleted_by": null,
              "created_at": "2022-09-09T13:05:48.000000Z",
              "updated_at": "2022-09-09T13:05:48.000000Z",
              "deleted_at": null
          }
      }
  ]);
  const [updating, setUpdating] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState("");
  const [updatingMessage, setUpdatingMessage] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [savingMessage, setSavingMessage] = useState("");

  return (
    <>
      <PageHeader page="Products" />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Products table</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                      <tr>
                          <th>ID</th>
                          <th className="no-wrap">Product Image</th>
                          <th className="no-wrap">Product Name</th>
                          <th className="no-wrap">Product Category</th>
                          <th>Stock</th>
                          <th className="no-wrap">Product Price</th>
                          <th className="no-wrap">Active Discount</th>
                          <th className="no-wrap">Product description</th>
                          <th className="no-wrap">Minimum Orders</th>
                          <th className="no-wrap">Minimum Indicator</th>
                          <th className="no-wrap">Published</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                        business_products.map((product,index) => (
                            <tr key={index}>
                                <td>{(index+1)}</td>
                                <td><Image layout="fill" src="/{product.images[0].image_path}" alt="" /></td>
                                <td className="no-wrap">{product.product_name}</td>
                                <td className="no-wrap">{product.sub_category_name}</td>
                                <td className="no-wrap">{product.stock_quantity}</td>
                                <td>{product.product_price} RWF</td>
                                <td>-</td>
                                <td className="no-wrap">{product.product_description}</td>
                                <td className="no-wrap">{product.minimum_order_quantity} Orders</td>
                                <td className="no-wrap">{product.minimum_order_indicator} Orders</td>
                                <td>{product.published}</td>
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
                          <th className="no-wrap">Product Category</th>
                          <th>Stock</th>
                          <th className="no-wrap">Product Price</th>
                          <th className="no-wrap">Active Discount</th>
                          <th className="no-wrap">Product description</th>
                          <th className="no-wrap">Minimum Orders</th>
                          <th className="no-wrap">Minimum Indicator</th>
                          <th className="no-wrap">Published</th>
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

Products.layout = Admin;

export default Products;
