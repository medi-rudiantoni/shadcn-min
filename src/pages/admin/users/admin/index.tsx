import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { Bounce, toast } from "react-toastify";
import { Button, Col, Row, Table } from "antd";
import Link from "next/link";
import { UilEye, UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import { useSelector } from "react-redux";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";
import DataTable from "@/components/table/DataTable";
import { getAllAdmins, removeAdmin } from "@/functions/admin";
import "moment/locale/id";

moment.locale("id");

interface User {
  _id: number;
  displayName: string;
  username: string;
  designation: string;
  img: string;
  status: string;
  email: string;
  role: string;
  created_at: string;
}

interface RootState {
  users: User[];
}

interface UserData {
  key: number;
  user: any;
  email: any;
  role: any;
  joinDate: any;
  status: any;
  action: any;
}

function AdminList() {
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const token = Cookies.get("access_token");
  useEffect(() => {
    // if(!admin){
    retrieveAllAdmin();
    // }
  }, []);

  function retrieveAllAdmin() {
    getAllAdmins("created_at", "desc", page, token).then((res) => {
      console.log("res admins: ", res.data);
      if (res) {
        setAdmin(res.data);
        setLoading(false);
      }
    });
  }

  function deleteAdmin(_id: string) {
    removeAdmin(_id, token)
      .then((res) => {
        if (res.data.success) {
          retrieveAllAdmin();
          toast.success("Delete Admin Success", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Delete Admin Failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      })
      .finally(() => setDeleteLoading(false));
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
      breadcrumbName: "Admin",
    },
  ];
  const usersTableData: UserData[] = [];

  admin.map((user: User) => {
    const { _id, displayName, username, role, img, status, email, created_at } =
      user;

    return usersTableData.push({
      key: _id,
      user: (
        <div className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {displayName || username}
            </Heading>
          </figcaption>
        </div>
      ),
      email: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {email}
        </span>
      ),
      role: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {role}
        </span>
      ),
      joinDate: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {moment(created_at).format("LL")}
        </span>
      ),
      status: (
        <span
          className={`inline-flex items-center justify-center bg-${status}-transparent text-${status} min-h-[24px] px-3 text-xs font-medium rounded-[15px]`}
        >
          {status}
        </span>
      ),
      action: (
        <div className="min-w-[150px] text-end -m-2">
          <Link
            className="inline-block m-2 group"
            href={`/admin/users/admin/${_id}`}
          >
            <Button className="bg-primary text-white">
              <UilEye className="w-4 text-white" /> View
            </Button>
          </Link>
          <Link
            className="inline-block m-2 group-hover:text-blue-600"
            href={`/admin/users/admin/${_id}/edit`}
          >
            <Button className="bg-sky-500 text-white">
              <UilEdit className="w-4 text-white" /> Edit
            </Button>
          </Link>
          <Link className="inline-block m-2" href="#">
            <Button
              className="bg-danger text-white"
              onClick={() => deleteAdmin(String(_id))}
            >
              <UilTrashAlt className="w-4 text-white" /> Delete
            </Button>
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Create Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Admin List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <Button type="primary" className="mb-3">
              <Link href="/admin/users/admin/add">Add Admin</Link>
            </Button>
            <div className="ant-pagination-custom-style table-responsive hover-tr-none table-th-shape-none table-last-th-text-right table-th-border-none table-head-rounded table-selection-col-pl-25 table-tr-selected-background-transparent table-td-border-none bg-white dark:bg-transparent rounded-[10px] ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-none ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-none">
              <Table
                className="[&>div>div>.ant-table]:mb-7 [&>div>div>.ant-table]:pb-5 [&>div>div>.ant-table]:border-b [&>div>div>.ant-table]:border-regular dark:[&>div>div>.ant-table]:border-white/10 ltr:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pl-[20px] ltr:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pl-[20px] rtl:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pr-[20px] rtl:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pr-[20px]"
                rowSelection={rowSelection}
                dataSource={usersTableData}
                columns={usersTableColumns}
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

export default AdminList;
