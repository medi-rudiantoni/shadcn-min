import { Button, Col, Input, Row, Table } from "antd";
import Link from "next/link";
import { UilEye, UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { GetServerSideProps } from "next";
import ServerCookies from "cookies";
import { useRouter } from "next/router";
import "moment/locale/id";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";
import DataTable from "@/components/table/DataTable";
import { getEngineers } from "@/functions/engineer";
moment.locale("id");

interface User {
  _id: string;
  id: number;
  fullName: string;
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

interface Props {
  initialEngineers: any[];
  initialTotalRow: number;
  initialPage: number;
  initialPageSize: number;
  initialSearch: string;
  initialSort: string;
  token: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new ServerCookies(context.req, context.res);
  const token = cookies.get("access_token");

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const page = Number(context.query.page) || 1;
  const pageSize = Number(context.query.size) || 10;
  const search = (context.query.search as string) || "";
  const sort = (context.query.sort as string) || "";
  const sortType = sort.split("-")[0];
  const sortOrder = sort.split("-")[1];

  let engineersData = [];
  let totalRow = 0;

  const res = await getEngineers({
    authtoken: token,
    page,
    limit: pageSize,
    search: search ? search : undefined,
    sort: sortType,
    order: sortOrder,
  });
  engineersData = res.data.result;
  totalRow = res.data.pagination.total;

  return {
    props: {
      initialEngineers: engineersData,
      initialTotalRow: totalRow,
      initialPage: page,
      initialPageSize: pageSize,
      initialSearch: search,
      initialSort: sort,
      token,
    },
  };
};

function EngineerList(props: Props) {
  const router = useRouter();
  const [admin, setEngineer] = useState(props.initialEngineers);
  const [page, setPage] = useState(props.initialPage);
  const [pageSize, setPageSize] = useState(props.initialPageSize);
  const [totalRow, setTotalRow] = useState(props.initialTotalRow);
  const [search, setSearch] = useState<string | undefined>(
    props.initialSearch || undefined,
  );
  const [sort, setSort] = useState<string>(props.initialSort);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (!router.isReady) return;
    const {
      page: queryPage,
      size: querySize,
      search: querySearch,
      sort: querySort,
    } = router.query;

    const newPage = Number(queryPage) || 1;
    const newSize = Number(querySize) || 10;
    const newSearch = typeof querySearch === "string" ? querySearch : "";
    const newSort =
      typeof querySort === "string" ? querySort : "created_at-desc";

    // update local state
    setPage(newPage);
    setPageSize(newSize);
    setSearch(newSearch);
    setSort(newSort);

    loadEngineers(newPage, newSize, newSearch, newSort);
  }, [router.isReady, router.query]);

  async function loadEngineers(
    newPage = page,
    newPageSize = pageSize,
    newSearch = search,
    newSort = sort,
  ) {
    setLoading(true);
    try {
      const sortType = newSort.split("-")[0];
      const sortOrder = newSort.split("-")[1];
      const res = await getEngineers({
        authtoken: props.token,
        page: newPage,
        limit: newPageSize,
        search: newSearch,
        sort: sortType,
        order: sortOrder,
      });

      if (res.data.success) {
        setEngineer(res.data.result);
        setTotalRow(res.data.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(newSearch: string) {
    setPage(1);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, search: newSearch, page: 1 },
      },
      undefined,
      { shallow: true },
    );
  }

  async function handleSort(newSort: string) {
    setPage(1);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: newSort, page: 1 },
      },
      undefined,
      { shallow: true },
    );
  }

  function handleChangePage(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);

    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage, size: newPageSize },
      },
      undefined,
      { shallow: true },
    );

    loadEngineers(newPage, newPageSize);
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
      breadcrumbName: "Engineer",
    },
  ];
  const usersTableData: UserData[] = [];

  admin.map((user: User) => {
    const { _id, id, fullName, role, img, status, email, created_at } = user;

    return usersTableData.push({
      key: id,
      user: (
        <div className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {fullName}
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
            className="inline-block m-2"
            href={`/admin/users/engineer/${_id}`}
          >
            <Button className="bg-primary text-white">
              <UilEye className="w-4" /> View
            </Button>
          </Link>
          {/* <Link className="inline-block m-2" href="#">
            <UilEdit className="w-4 text-light-extra dark:text-white/60" />
          </Link>
          <Link className="inline-block m-2" href="#">
            <UilTrashAlt className="w-4 text-light-extra dark:text-white/60" />
          </Link> */}
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
        title="Engineer List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <div className="w-full h-fit flex justify-between items-center">
              <Button type="primary" className="mb-3">
                <Link href="/admin/users/partner/add">Add Partner</Link>
              </Button>
              <div className="flex-1 flex gap-2 justify-end h-fit mb-2">
                <div className="flex-1 max-w-lg flex gap-2 h-fit">
                  <Input.Search
                    placeholder="Search contract name..."
                    className="flex-1"
                    allowClear
                    enterButton="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                  />
                </div>
                <div className="w-fit flex items-center gap-2">
                  <select
                    name="order"
                    className="py-[7px] px-4 border rounded-lg"
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value={"created_at-desc"}>Newest</option>
                    <option value={"created_at-asc"}>Oldest</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="ant-pagination-custom-style table-responsive hover-tr-none table-th-shape-none table-last-th-text-right table-th-border-none table-head-rounded table-selection-col-pl-25 table-tr-selected-background-transparent table-td-border-none bg-white dark:bg-transparent rounded-[10px] ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-none ltr:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-r-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-l-10 rtl:[&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-none">
              <Table
                className="[&>div>div>.ant-table]:mb-7 [&>div>div>.ant-table]:pb-5 [&>div>div>.ant-table]:border-b [&>div>div>.ant-table]:border-regular dark:[&>div>div>.ant-table]:border-white/10 ltr:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pl-[20px] ltr:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pl-[20px] rtl:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pr-[20px] rtl:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pr-[20px]"
                rowSelection={rowSelection}
                dataSource={usersTableData}
                columns={usersTableColumns}
                pagination={{
                  defaultPageSize: 10,
                  total: totalRow,
                  current: page,
                  pageSize,
                  pageSizeOptions: [10, 20, 30, 40, 50],
                  showSizeChanger: true,
                  onChange: handleChangePage,
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

export default EngineerList;
