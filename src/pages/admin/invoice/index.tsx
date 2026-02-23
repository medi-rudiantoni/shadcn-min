import { GetServerSideProps } from "next";
import ServerCookies from "cookies";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, DatePicker, Input, Modal, Row, Table } from "antd";
import {
  UilEye,
  UilEdit,
  UilTrashAlt,
  UilPlus,
} from "@iconscout/react-unicons";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { deleteInvoice, getInvoiceList } from "@/functions/invoice";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";

interface Invoice {
  _id: string;
  contract: any;
  partner: any;
  devices: any[];
  totalDevices: number | string;
  due_date: Date;
  invoice_date: Date;
  payment_method: {
    method_name: string;
    bank_name: string;
    account_number: string;
  };
  status: string;
  base_price: number;
  total_discount: number;
  total_amount: number;
  total_tax: number;
  total_payment: number;
  transaction_id: string;
  type: string | null;
  updated_at: Date;
}

interface InvoiceTableData {
  key: number;
  partner: string | any;
  devices: number | any;
  created_at: string | any;
  due_date: string | any;
  status: string | any;
  action: any | any;
}

interface Props {
  initialInvoices: any[];
  initialMonth: number;
  initialYear: number;
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

  // const month = new Date().getMonth() + 1;
  // const year = new Date().getFullYear();
  const month = Number(context.query.month) || new Date().getMonth() + 1;
  const year = Number(context.query.year) || new Date().getFullYear();

  const page = Number(context.query.page) || 1;
  const pageSize = Number(context.query.size) || 10;
  const search = (context.query.search as string) || "";
  const sort = (context.query.sort as string) || "";
  const sortType = sort.split("-")[0];
  const sortOrder = sort.split("-")[1];

  let invoicesData = [];
  let totalRow = 0;
  const res = await getInvoiceList({
    authtoken: token,
    month,
    year,
    page,
    limit: pageSize,
    search: search ? search : undefined,
    sort: sortType,
    order: sortOrder,
  });
  invoicesData = res.data.result;
  totalRow = res.data.pagination.total;

  return {
    props: {
      initialInvoices: invoicesData,
      initialMonth: month,
      initialYear: year,
      initialTotalRow: totalRow,
      initialPage: page,
      initialPageSize: pageSize,
      initialSearch: search,
      initialSort: sort,
      token,
    },
  };
};

export default function Invoices(props: Props) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(props.initialInvoices);
  const [initialMonth, setInitialMonth] = useState(props.initialMonth);
  const [initialYear, setInitialYear] = useState(props.initialYear);
  const [page, setPage] = useState(props.initialPage);
  const [pageSize, setPageSize] = useState(props.initialPageSize);
  const [totalRow, setTotalRow] = useState(props.initialTotalRow);
  const [search, setSearch] = useState<string | undefined>(
    props.initialSearch || undefined,
  );
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "unpaid") return "bg-red-100 text-red-700";
    if (statusLower === "paid") return "bg-green-100 text-green-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };
  const [sort, setSort] = useState<string>(props.initialSort);
  const [month, setMonth] = useState<number>(props.initialMonth);
  const [year, setYear] = useState<number>(props.initialYear);
  const [loading, setLoading] = useState(true);
  const [isDeleteModal, setDeleteModal] = useState<any | null>(null);
  const [isDeleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => refreshData(), [router.isReady, router.query]);

  function refreshData() {
    if (!router.isReady) return;
    const {
      page: queryPage,
      size: querySize,
      search: querySearch,
      sort: querySort,
      month: queryMonth,
      year: queryYear,
    } = router.query;

    const newPage = Number(queryPage) || 1;
    const newSize = Number(querySize) || 10;
    const newSearch = typeof querySearch === "string" ? querySearch : "";
    const newSort =
      typeof querySort === "string" ? querySort : "created_at-desc";
    const newMonth = Number(queryMonth) || initialMonth;
    const newYear = Number(queryYear) || initialYear;

    // update local state

    setMonth(newMonth);
    setYear(newYear);
    setPage(newPage);
    setPageSize(newSize);
    setSearch(newSearch);
    setSort(newSort);

    loadInvoice(newPage, newSize, newSearch, newSort, newMonth, newYear);
  }

  async function loadInvoice(
    newPage = page,
    newPageSize = pageSize,
    newSearch = search,
    newSort = sort,
    newMonth = month,
    newYear = year,
  ) {
    setLoading(true);
    try {
      const sortType = newSort.split("-")[0];
      const sortOrder = newSort.split("-")[1];
      const res = await getInvoiceList({
        authtoken: props.token,
        page: newPage,
        limit: newPageSize,
        search: newSearch,
        sort: sortType,
        order: sortOrder,
        month: newMonth,
        year: newYear,
      });

      if (res.data.success) {
        setInvoices(res.data.result);
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
        query: { ...router.query, page: newPage, size: newPageSize, search },
      },
      undefined,
      { shallow: true },
    );
    loadInvoice(newPage, newPageSize, search);
  }

  function handleDeleteInvoice(id: string) {
    if (!id) return;
    setDeleteLoading(true);
    deleteInvoice(id, props.token)
      .then(() => {
        toast.success("Invoice deleted successfully");
        loadInvoice();
        setDeleteModal(null);
      })
      .catch((error) => {
        console.log("DELETE INVOICE FAILED: ", error);
        toast.error("Delete invoice failed");
      })
      .finally(() => {
        setDeleteLoading(false);
        setDeleteModal(null);
      });
  }

  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "invoice",
      breadcrumbName: "Transaction",
    },
    {
      path: "/",
      breadcrumbName: "Invoice",
    },
  ];
  const invoicesTableData: InvoiceTableData[] = [];

  invoices.map((invoice: Invoice, idx) => {
    const {
      _id,
      invoice_date,
      partner,
      devices,
      status,
      totalDevices,
      due_date,
    } = invoice;

    return invoicesTableData.push({
      key: idx,
      partner: (
        <div className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {partner && partner.companyName}
            </Heading>
          </figcaption>
        </div>
      ),
      devices: (
        <div className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {totalDevices}
            </Heading>
          </figcaption>
        </div>
      ),
      created_at: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {moment(invoice_date).format("LL")}
        </span>
      ),
      due_date: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {moment(due_date).format("LL")}
        </span>
      ),
      status: (
        <span
          className={`text-body dark:text-white/60 text-[15px] font-medium capitalize ${getStatusColor(status)}`}
        >
          {status}
        </span>
      ),
      action: (
        <div className="min-w-[150px] text-end -m-2">
          <Link
            className="inline-block m-2 mr-0"
            href={`/admin/invoice/detail/${_id}`}
          >
            <Button className="bg-primary text-white">
              <UilEye className="w-4" /> View
            </Button>
          </Link>
          <Link
            className="inline-block m-2 group-hover:text-blue-600"
            href={`/admin/invoice/edit/${_id}`}
          >
            <Button className="bg-sky-500 text-white">
              <UilEdit className="w-4 text-white" /> Edit
            </Button>
          </Link>
          <Button
            className="bg-danger text-white"
            onClick={() => setDeleteModal(_id)}
          >
            <UilTrashAlt className="w-4 text-white" /> Delete
          </Button>
        </div>
      ),
    });
  });

  const usersTableColumns = [
    {
      title: "Company Name",
      dataIndex: "partner",
      key: "partner",
    },
    {
      title: "Total Devices",
      dataIndex: "devices",
      key: "devices",
    },
    {
      title: "Invoice date",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
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
      disabled: record.name === "Disabled Contract",
      name: record.name,
    }),
  };

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Invoices"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <Row>
              <Col span={24}>
                <Link href="/admin/invoice/create">
                  <Button type="primary" className="mb-3">
                    <UilPlus />
                    Create Invoice
                  </Button>
                </Link>
                <div className="w-full my-4 flex gap-2 justify-between">
                  <DatePicker
                    picker="month"
                    className="max-w-[250px]"
                    onChange={(date) => {
                      if (!date) return;
                      const month = date.month() + 1;
                      const year = date.year();

                      setMonth(month);
                      setYear(year);

                      router.replace(
                        {
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            month,
                            year,
                            page: 1, // reset paging jika perlu
                          },
                        },
                        undefined,
                        { shallow: true },
                      );
                    }}
                    value={moment(`${year}-${month}`, "YYYY-MM")}
                  />

                  <div className="flex gap-2 w-fit">
                    {/* <div className="flex-1 max-w-lg flex gap-2">
                      <Input.Search
                        placeholder="Search Invoice name..."
                        className="flex-1"
                        allowClear
                        enterButton="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={handleSearch}
                      />
                    </div> */}
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
                    dataSource={invoicesTableData}
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
          </Col>
        </Row>
        <Modal
          title={"Delete Invoice"}
          open={isDeleteModal !== null ? true : false}
          loading={isDeleteLoading}
          // onOk={() => }
          onCancel={() => setDeleteModal(null)}
          footer={[
            <Button key={"cancel"} onClick={() => setDeleteModal(null)}>
              No
            </Button>,
            <Button
              key={"submit"}
              type="primary"
              danger
              loading={isDeleteLoading}
              onClick={() => handleDeleteInvoice(isDeleteModal as string)}
            >
              Yes
            </Button>,
          ]}
        >
          <div>Are you sure want to Delete this Invoice?</div>
        </Modal>
      </div>
    </>
  );
}
