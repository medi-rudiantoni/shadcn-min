import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { Button, Col, Empty, Row, Skeleton, Table } from "antd";
import Link from "next/link";
import {
  UilEye,
  UilEdit,
  UilTrashAlt,
  UilDownloadAlt,
  UilPen,
} from "@iconscout/react-unicons";
import { useSelector } from "react-redux";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";
import "moment/locale/id";
import {
  getServicePartnerContractList,
  getAllPartnerContractExceptBPList,
} from "@/functions/partnerContract";
import { ContractResponse } from "@/types/contract";
import { DeviceResponse } from "@/types/device";
import { getMasterContractSP } from "@/functions/masterContract";
moment.locale("id");

interface Contract {
  id: number;
  _id: string;
  name: string;
  customer: any;
  number: any;
  status: string;
  email: string;
  role: string;
  created_at: string;
}

interface RootState {
  users: Contract[];
}

interface ContractData {
  key: number;
  user: any;
  number: any;
  customer: any;
  joinDate: any;
  isSigned: any;
  action: any;
}

export interface PartnerContractResponse {
  _id: string;
  contract: ContractResponse;
  contractType: string | null;
  devices: DeviceResponse[];
  totalDevices: number;
  servicePartner: any;
  signed: boolean;
  startDate: Date;
  endDate: Date;
  updated_at: Date;
}

function ContractsList() {
  const [partnercontracts, setPartnerContracts] = useState<
    PartnerContractResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isThereMasterContract, setIsThereMasterContract] = useState(true);
  const token = Cookies.get("access_token");
  useEffect(() => {
    loadPartnerContract();
  }, [page]);

  function loadPartnerContract() {
    setLoading(true);
    // getServicePartnerContractList(token, page)
    getAllPartnerContractExceptBPList(token, page)
      .then((res) => {
        setPartnerContracts(res.data.partnerContract);
        setTotalItems(res.data.pagination.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error("ERROR LOAD PARTNER CONTRACT: ", error);
      });
  }

  useEffect(() => checkMasterContract(), [token]);
  function checkMasterContract() {
    getMasterContractSP(token)
      .then((res) => {
        if (res.data.contract === null) {
          setIsThereMasterContract(false);
        } else {
          setIsThereMasterContract(true);
        }
      })
      .catch((error) => {
        console.error("ERROR CHECKING MASTER CONTRACT: ", error);
      });
  }

  const { users } = useSelector((state: RootState) => {
    return {
      users: state.users,
    };
  });
  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "service-partner",
      breadcrumbName: "Contracts",
    },
    {
      path: "first",
      breadcrumbName: "Service Partner",
    },
  ];
  const usersTableData: ContractData[] = [];

  partnercontracts.map((partnerContract: PartnerContractResponse, id) => {
    const { _id, contract, signed } = partnerContract;

    return usersTableData.push({
      key: id,
      user: (
        <div className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {contract.name}
            </Heading>
          </figcaption>
        </div>
      ),
      customer: (
        <div className="flex items-center">
          <figcaption>
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {contract.customer && contract.customer.companyName}
            </Heading>
          </figcaption>
        </div>
      ),
      number: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {contract.number}
        </span>
      ),
      joinDate: (
        <span className="text-body dark:text-white/60 text-[15px] font-medium">
          {moment(contract.created_at).format("LL")}
        </span>
      ),
      isSigned: <div className="px-6">{signed ? "Yes" : "No"}</div>,
      action: (
        <div className="min-w-[150px] text-end -m-2">
          <Link
            className="inline-block m-2"
            href={`/admin/contracts/service-partner/detail/${_id}`}
          >
            <Button className="bg-primary text-white">
              <UilEye className="w-4" /> View
            </Button>
          </Link>
          {/* <Link
            className="inline-block m-2"
            href={`/manage/contracts/edit/${_id}`}
          >
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
      title: "Contract Name",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Company Name",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Contract Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Create Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    {
      title: "Signature",
      dataIndex: "isSigned",
      key: "isSigned",
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
        title="Contract List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <div className="w-full h-fit mb-5 flex items-center justify-end gap-2">
          {isThereMasterContract ? (
            <Link
              href={"/admin/contracts/service-partner/edit-master-contract"}
            >
              <Button className="flex items-center gap-2 bg-secondary text-white">
                <UilPen className="w-4 -translate-x-0.5" />
                <span>Edit Master Contract for SP</span>
              </Button>
            </Link>
          ) : (
            <Link
              href={"/admin/contracts/service-partner/create-master-contract"}
            >
              <Button className="flex items-center gap-2 bg-secondary text-white">
                <UilPen className="w-4 -translate-x-0.5" />
                <span>Create Master Contract for SP</span>
              </Button>
            </Link>
          )}
        </div>
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
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
                  current: page,
                  pageSize: 10,
                  total: totalItems,
                  onChange: (pageNumber) => setPage(pageNumber),
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  className:
                    "text-end [&>li]:margin-0 [&>li]:border [&>li]:margin-0 [&>li]:bg-white [&>li]:rounded-6 dark:[&>li]:bg-white/10 dark:[&>li]:margin-0 [&>li]:border-regular dark:[&>li]:border-white/10 [&>li>.ant-pagination-item-link]:flex [&>li>.ant-pagination-item-link]:items-center [&>li>.ant-pagination-item-link]:justify-center [&>li>.ant-pagination-item-link]:border-none [&>li>.ant-pagination-item-link>.anticon>svg]:text-light [&>li>.ant-pagination-item-link>.anticon>svg]:dark:text-white/30 [&>.ant-pagination-item>a]:text-body [&>.ant-pagination-item>a]:dark:text-white/60 [&>.ant-pagination-item-active]:bg-primary [&>.ant-pagination-item.ant-pagination-item-active>a]:text-white [&>.ant-pagination-item.ant-pagination-item-active>a]:dark:text-white/60 [&>.ant-pagination-options]:border-none [&>.ant-pagination-options>.ant-select:hover>.ant-select-selector]:border-primary [&>.ant-pagination-options>.ant-select>.ant-select-selector]:h-[33px] dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:text-white/[.60] dark:[&>.ant-pagination-options>.ant-select>.ant-select-arrow]:text-white/[.60] [&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-0 dark:[&>.ant-pagination-options>.ant-select>.ant-select-selector]:border-white/10 [&>.ant-pagination-options>.ant-select>.ant-select-selector]:rounded-6",
                }}
              />
              {/* {JSON.stringify(contract)} */}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ContractsList;
