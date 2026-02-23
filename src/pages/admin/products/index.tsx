import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { Button, Col, Empty, Row, Skeleton, Table } from "antd";
import Link from "next/link";
import { UilEye, UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import { useSelector } from "react-redux";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";
import DataTable from "@/components/table/DataTable";
import { getProducts } from "@/functions/product";
import "moment/locale/id";
moment.locale("id");

function ProductsList() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const token = Cookies.get("access_token");
  useEffect(() => {
    // if(!product){
    getProducts("created_at", "desc", page, token).then((res) => {
      if (res) {
        console.log("Products", res);
        setProduct(res.data);
        setLoading(false);
      }
    });
    // }
  }, []);
  interface Product {
    _id: string;
    id: number;
    productName: string;
    brand: any;
    category: any;
    images: string;
    status: string;
    email: string;
    role: string;
    created_at: string;
  }

  interface RootState {
    users: Product[];
  }

  interface ProductData {
    key: number;
    user: any;
    brand: any;
    category: any;
    joinDate: any;
    action: any;
  }

  const { users } = useSelector((state: RootState) => {
    return {
      users: state.users,
    };
  });
  const PageRoutes = [
    {
      path: "index",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Products",
    },
  ];
  const usersTableData: ProductData[] = [];

  !loading &&
    product.map((user: Product) => {
      const {
        _id,
        id,
        productName,
        category,
        brand,
        images,
        status,
        email,
        created_at,
      } = user;

      return usersTableData.push({
        key: id,
        user: (
          <div className="flex items-center">
            <figcaption>
              <Heading
                className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
                as="h6"
              >
                {productName}
              </Heading>
            </figcaption>
          </div>
        ),
        category: (
          <span className="text-body dark:text-white/60 text-[15px] font-medium">
            {category.name}
          </span>
        ),
        brand: (
          <span className="text-body dark:text-white/60 text-[15px] font-medium">
            {brand.name}
          </span>
        ),
        joinDate: (
          <span className="text-body dark:text-white/60 text-[15px] font-medium">
            {moment(created_at).format("LL")}
          </span>
        ),
        action: (
          <div className="min-w-[150px] text-end -m-2">
            <Link className="inline-block m-2" href="#">
              <UilEye className="w-4 text-light-extra dark:text-white/60" />
            </Link>
            <Link
              className="inline-block m-2"
              href={`/admin/products/edit/${_id}`}
            >
              <UilEdit className="w-4 text-light-extra dark:text-white/60" />
            </Link>
            <Link className="inline-block m-2" href="#">
              <UilTrashAlt className="w-4 text-light-extra dark:text-white/60" />
            </Link>
          </div>
        ),
      });
    });

  const usersTableColumns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Create Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "90px",
    },
  ];

  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled Product", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Product                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <Button type="primary" className="mb-3">
              <Link href="/admin/products/add">Add Product</Link>
            </Button>
            <div className="ant-pagination-custom-style table-responsive hover-tr-none table-th-shape-none table-last-th-text-right table-th-border-none table-head-rounded table-selection-col-pl-25 table-tr-selected-background-transparent table-td-border-none bg-white dark:bg-transparent rounded-[10px] ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-none ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-none">
              <Table
                className="[&>div>div>.ant-table]:mb-7 [&>div>div>.ant-table]:pb-5 [&>div>div>.ant-table]:border-b [&>div>div>.ant-table]:border-regular dark:[&>div>div>.ant-table]:border-white/10 ltr:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pl-[20px] ltr:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pl-[20px] rtl:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pr-[20px] rtl:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pr-[20px]"
                rowSelection={rowSelection}
                dataSource={usersTableData}
                columns={usersTableColumns}
                locale={{
                  emptyText: loading ? <Skeleton active={true} /> : <Empty />,
                }}
                pagination={{
                  defaultPageSize: 10,
                  total: usersTableData.length,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  className:
                    "text-end [&>li]:margin-0 [&>li]:border [&>li]:margin-0 [&>li]:bg-white [&>li]:rounded-6 dark:[&>li]:bg-white/10 dark:[&>li]:margin-0 [&>li]:border-regular dark:[&>li]:border-white/10 [&>li>.ant-pagination-item-link]:flex [&>li>.ant-pagination-item-link]:items-center [&>li>.ant-pagination-item-link]:justify-center [&>li>.ant-pagination-item-link]:border-none [&>li>.ant-pagination-item-link>.anticon>svg]:text-light [&>li>.ant-pagination-item-link>.anticon>svg]:dark:text-white/30 [&>.ant-pagination-item>a]:text-body [&>.ant-pagination-item>a]:dark:text-white/60 [&>.ant-pagination-item-active]:bg-primary [&>.ant-pagination-item.ant-pagination-item-active>a]:text-white [&>.ant-pagination-item.ant-pagination-item-active>a]:dark:text-white/60 [&>.ant-pagination-options]:border-none [&>.ant-pagination-options>.ant-select:hover>.ant-select-selector]:border-primary [&>.ant-pagination-options>.ant-select>.ant-select-selector]:h-[33px] dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:text-white/[.60] dark:[&>.ant-pagination-options>.ant-select>.ant-select-arrow]:text-white/[.60] [&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-0 dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-white/10 [&>.ant-pagination-options>.ant-select>.ant-select-selector]:rounded-6",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProductsList;
