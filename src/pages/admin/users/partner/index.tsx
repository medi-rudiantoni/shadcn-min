import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import moment from "moment";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ServerCookies from "cookies";
import { Button, Col, Empty, Row, Skeleton, Table, Modal, Input } from "antd";
import Link from "next/link";
import { UilEye, UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import { useSelector } from "react-redux";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";
import DataTable from "@/components/table/DataTable";
import { getPartners, deletePartner } from "@/functions/partner";
import "moment/locale/id";
moment.locale("id");

interface User {
  _id: string;
  id: number;
  companyName: string;
  designation: string;
  img: string;
  status: string;
  email: string;
  typeRegister: string;
  created_at: string;
}

interface RootState {
  users: User[];
}

interface UserData {
  key: number;
  user: any;
  email: any;
  typeRegister: any;
  joinDate: any;
  status: any;
  action: any;
}

interface Props {
  initialPartners: any[];
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

  let partnersData = [];
  let totalRow = 0;

  const res = await getPartners({
    authtoken: token,
    page,
    limit: pageSize,
    search: search ? search : undefined,
    sort: sortType,
    order: sortOrder,
  });
  partnersData = res.data.result;
  totalRow = res.data.pagination.total;

  return {
    props: {
      initialPartners: partnersData,
      initialTotalRow: totalRow,
      initialPage: page,
      initialPageSize: pageSize,
      initialSearch: search,
      initialSort: sort,
      token,
    },
  };
};

function PartnerList(props: Props) {
  const router = useRouter();
  const [partners, setPartners] = useState(props.initialPartners);
  const [page, setPage] = useState(props.initialPage);
  const [pageSize, setPageSize] = useState(props.initialPageSize);
  const [totalRow, setTotalRow] = useState(props.initialTotalRow);
  const [search, setSearch] = useState<string | undefined>(
    props.initialSearch || undefined,
  );
  const [sort, setSort] = useState<string>(props.initialSort);
  const [loading, setLoading] = useState(true);
  const [idDelete, setIdDelete] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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

    loadPartners(newPage, newSize, newSearch, newSort);
  }, [router.isReady, router.query]);

  async function loadPartners(
    newPage = page,
    newPageSize = pageSize,
    newSearch = search,
    newSort = sort,
  ) {
    setLoading(true);
    try {
      const sortType = newSort.split("-")[0];
      const sortOrder = newSort.split("-")[1];
      const res = await getPartners({
        authtoken: props.token,
        page: newPage,
        limit: newPageSize,
        search: newSearch,
        sort: sortType,
        order: sortOrder,
      });

      if (res.data.success) {
        setPartners(res.data.result);
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

    loadPartners(newPage, newPageSize);
  }

  function handleDeletePartner(id: any) {
    deletePartner(id, props.token)
      .then((res) => {
        if (res.data.success) {
          loadPartners();
          setModalOpen(false);
          setIdDelete("");
          toast.success("Partner deleted successfully!", {
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
        } else {
          setModalOpen(false);
          setIdDelete("");
          toast.error(res.data.message, {
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
      .catch((err) => {
        setModalOpen(false);
        setIdDelete("");
        toast.error(err.response?.data?.message || "Gagal menghapus partner.", {
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
      });
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
      breadcrumbName: "Partner",
    },
  ];
  const usersTableData: UserData[] = [];

  partners.map((user: User) => {
    const {
      _id,
      id,
      companyName,
      typeRegister,
      img,
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
              {companyName}
            </Heading>
          </figcaption>
        </div>
      ),
      email: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {email}
        </span>
      ),
      typeRegister: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {typeRegister}
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
            href={`/admin/users/partner/${_id}`}
          >
            <Button className="bg-primary text-white">
              <UilEye className="w-4 text-white" /> View
            </Button>
          </Link>
          <Link
            className="inline-block m-2"
            href={`/admin/users/partner/edit/${_id}`}
          >
            <Button className="bg-sky-500 text-white">
              <UilEdit className="w-4 text-white" /> Edit
            </Button>
          </Link>
          <Link className="inline-block m-2" href="#">
            <Button
              className="bg-danger text-white"
              onClick={() => {
                setIdDelete(_id);
                setModalOpen(true);
              }}
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
      title: "Partner Type",
      dataIndex: "typeRegister",
      key: "typeRegister",
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
        title="Partner List"
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
                locale={{
                  emptyText: loading ? <Skeleton active={true} /> : <Empty />,
                }}
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
          <Modal
            title={"Confirmation"}
            open={modalOpen}
            onOk={() => handleDeletePartner(idDelete)}
            onCancel={() => setModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                danger
                loading={loading}
                onClick={() => handleDeletePartner(idDelete)}
              >
                Delete
              </Button>,
            ]}
          >
            <div>Really want to delete this data?</div>
          </Modal>
        </Row>
      </div>
    </>
  );
}

export default PartnerList;
