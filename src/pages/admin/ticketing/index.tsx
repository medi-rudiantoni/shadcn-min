import React, { useState, useEffect } from "react";
import { UilEye, UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import Link from "next/link";
import {
  Pagination,
  Spin,
  Table,
  Button,
  Image,
  Tabs,
  Modal,
  Skeleton,
  Row,
  Col,
} from "antd";
import moment from "moment";
import Cookies from "js-cookie";
import type { TableProps } from "antd";
import "moment/locale/id";
moment.locale("id");

import { getAllTickets } from "@/functions/ticketing";
import { Cards } from "@/components/cards/frame/cards-frame";
import { PageHeaders } from "@/components/page-headers";

const { TabPane } = Tabs;

const TicketingList = () => {
  const [tickets, setTickets] = useState<any>([]);
  const [filteredTicket, setFilteredTicket] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("dispatch");
  const [loading, setLoading] = useState(true);

  // const { user } = useSelector((state) => ({ ...state }));
  const authtoken = Cookies.get("access_token");

  const loadTicketingList = (status: any) => {
    setLoading(true);
    getAllTickets(authtoken, "_id", "desc", page, status).then((res) => {
      setTickets(res.data.result);
      const dataTicket = res.data.result;
      console.log("TICKETS: " + JSON.stringify(res.data.result));
      // setFilteredTicket([]);
      // dataTicket
      //   // .filter((ticket: any) => ticket.status.includes(status))
      //   .map((t: any, i: number) =>
      //     setFilteredTicket([
      //       {
      //         key: t._id,
      //         number: t.number,
      //         created_at: t.created_at,
      //         company_name: t.customer?.companyName,
      //         problem: t.problemType,
      //         description: t.description,
      //         type: t.type,
      //         status: t.status,
      //       },
      //     ])
      //   );
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTicketingList(status);
  }, []);

  const onChange = (key: string) => {
    setStatus(key);
    loadTicketingList(key);
  };
  const NewTable = () => {
    return (
      <Table<DataType>
        className="[&>div>div>.ant-table]:mb-7 [&>div>div>.ant-table]:pb-5 [&>div>div>.ant-table]:border-b [&>div>div>.ant-table]:border-regular dark:[&>div>div>.ant-table]:border-white/10 ltr:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pl-[20px] ltr:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pl-[20px] rtl:[&>div>div>div>div>div>table>thead>tr>th:first-child]:pr-[20px] rtl:[&>div>div>div>div>div>table>tbody>tr>td:first-child]:pr-[20px]"
        virtual
        scroll={{ y: 1000 }}
        columns={columns}
        dataSource={tickets}
        pagination={{
          defaultPageSize: 10,
          total: tickets.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          className:
            "text-end [&>li]:margin-0 [&>li]:border [&>li]:margin-0 [&>li]:bg-white [&>li]:rounded-6 dark:[&>li]:bg-white/10 dark:[&>li]:margin-0 [&>li]:border-regular dark:[&>li]:border-white/10 [&>li>.ant-pagination-item-link]:flex [&>li>.ant-pagination-item-link]:items-center [&>li>.ant-pagination-item-link]:justify-center [&>li>.ant-pagination-item-link]:border-none [&>li>.ant-pagination-item-link>.anticon>svg]:text-light [&>li>.ant-pagination-item-link>.anticon>svg]:dark:text-white/30 [&>.ant-pagination-item>a]:text-body [&>.ant-pagination-item>a]:dark:text-white/60 [&>.ant-pagination-item-active]:bg-primary [&>.ant-pagination-item.ant-pagination-item-active>a]:text-white [&>.ant-pagination-item.ant-pagination-item-active>a]:dark:text-white/60 [&>.ant-pagination-options]:border-none [&>.ant-pagination-options>.ant-select:hover>.ant-select-selector]:border-primary [&>.ant-pagination-options>.ant-select>.ant-select-selector]:h-[33px] dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:text-white/[.60] dark:[&>.ant-pagination-options>.ant-select>.ant-select-arrow]:text-white/[.60] [&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-0 dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-white/10 [&>.ant-pagination-options>.ant-select>.ant-select-selector]:rounded-6",
        }}
      />
    );
  };
  interface DataType {
    key: string;
    number: string;
    created_at: string;
    companyName: string;
    problem: string;
    description: string;
    type: string;
    status: string;
    // action: string[];
  }
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "No. Ticket",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => moment(text).format("LLL"),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Constraint",
      dataIndex: "problem",
      key: "problem",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "capitalize",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Link
          href={`/admin/ticketing/detail/${record.key}`}
          type="button"
          className="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary"
        >
          <Button className="bg-primary text-white">
            <UilEye className="w-4" /> View
          </Button>
        </Link>
      ),
    },
  ];
  let n = 1;
  let m = 1;
  let o = 1;
  const PageRoutes = [
    {
      path: "/manage",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Ticketing",
    },
  ];
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Ticket List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Cards
          className="h-full border-none ant-card-body-p-25 ant-card-head-px-25 ant-card-head-b-none ant-card-body-pt-0 ant-card-head-title-lg mb-5"
          size="large"
          title="All Ticket"
        >
          {/* {JSON.stringify(filteredTicket)} */}
          <Tabs defaultActiveKey="dispatch" onChange={onChange}>
            <TabPane tab="Dispatch" key="dispatch">
              <div className="table-pl-0 hover-tr-none table-pt-15 table-responsive [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-s-4 [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-e-4">
                {!loading ? <NewTable /> : <Skeleton active />}
              </div>
            </TabPane>
            <TabPane tab="Pending" key="pending">
              <div className="table-pl-0 hover-tr-none table-pt-15 table-responsive [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-s-4 [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-e-4">
                {!loading ? <NewTable /> : <Skeleton active />}
              </div>
            </TabPane>
            <TabPane tab="Scheduled" key="scheduled">
              <div className="table-pl-0 hover-tr-none table-pt-15 table-responsive [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-s-4 [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-e-4">
                {!loading ? <NewTable /> : <Skeleton active />}
              </div>
            </TabPane>
            <TabPane tab="On Going" key="on going">
              <div className="table-pl-0 hover-tr-none table-pt-15 table-responsive [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-s-4 [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-e-4">
                {!loading ? <NewTable /> : <Skeleton active />}
              </div>
            </TabPane>
            <TabPane tab="Working" key="working">
              <Row gutter={15}>
                <Col xs={24} className="mb-[25px]">
                  <div className="table-pl-0 hover-tr-none table-pt-15 table-responsive [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:first-child]:rounded-s-4 [&>div>div>div>div>div>.ant-table-content>table>thead>tr>th:last-child]:rounded-e-4">
                    {!loading ? <NewTable /> : <Skeleton active />}
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Finish" key="finish">
              <div className="table-responsive">
                {!loading ? <NewTable /> : <Skeleton active />}
              </div>
            </TabPane>
          </Tabs>
        </Cards>
      </div>
    </>
  );
};

export default TicketingList;
