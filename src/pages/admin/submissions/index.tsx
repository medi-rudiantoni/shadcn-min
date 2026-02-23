import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { Bounce, toast } from "react-toastify";
import { Tabs, Col, Empty, Row, Skeleton, Table, Button, Modal } from "antd";
import type { TabsProps } from "antd";
import Link from "next/link";
import { UilEye, UilTrashAlt } from "@iconscout/react-unicons";
import Heading from "@/components/heading";
import { PageHeaders } from "@/components/page-headers";
import {
  getSubmissionsList,
  hardDeleteSubmission,
} from "@/functions/submission";
import "moment/locale/id";
moment.locale("id");

export interface Submission {
  _id: string;
  partnerType: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  coverageAreas: City[];
  engineerCount: number;
  PICName: string;
  PICEmail?: string;
  PICEmailForBP?: string;
  PICEmailForSP?: string;
  PICPhone: string;
  status: string;
  created_at: string;
}

interface City {
  _id: string;
  city_id: string | number;
  city_name: string;
  province: string;
  province_id: string;
  type: string;
}

interface RootState {
  users: any[];
}

interface SubmissionData {
  key: number;
  partnerType: any;
  companyName: any;
  PICName: any;
  status: any;
  createDate: any;
  action: any;
}

function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  const [isDeleteModal, setDeleteModal] = useState<null | string>(null);
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false);
  const token = Cookies.get("access_token");

  useEffect(() => {
    retrieveSubmission();
  }, []);

  function retrieveSubmission() {
    getSubmissionsList(token, 1).then((res) => {
      if (res.data.success) {
        setSubmissions(res.data.result);
        setLoading(false);
      }
    });
  }

  function handleHardDelete(id: string) {
    setDeleteLoading(true);
    hardDeleteSubmission(id, token)
      .then((res) => {
        if (res.data.success) {
          toast.success("Delete Submission Success", {
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
        retrieveSubmission();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Delete Submission Failed", {
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
      path: "first",
      breadcrumbName: "Submissions",
    },
  ];

  const usersTableColumns = [
    {
      title: "Partner Type",
      dataIndex: "partnerType",
      key: "partnerType",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "PIC Name",
      dataIndex: "PICName",
      key: "PICName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
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
      disabled: record.name === "Disabled Submission",
      name: record.name,
    }),
  };

  // Helper untuk buat data table
  const getFilteredData = (statusFilter?: string): SubmissionData[] => {
    return submissions
      .filter((item) => (statusFilter ? item.status === statusFilter : true))
      .map((letter, idx) => {
        const { _id, partnerType, companyName, status, PICName, created_at } =
          letter;

        return {
          key: idx,
          partnerType: (
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {partnerType}
            </Heading>
          ),
          companyName: (
            <Heading
              className="mb-1 text-sm font-medium text-dark dark:text-white/[.87]"
              as="h6"
            >
              {companyName}
            </Heading>
          ),
          PICName: (
            <span className="text-body dark:text-white/60 text-[15px] font-medium">
              {PICName}
            </span>
          ),
          status: (
            <span
              className={`${
                status === "Approved"
                  ? "text-green-700"
                  : status === "Rejected"
                    ? "text-red-600"
                    : "text-blue-400"
              } dark:text-white/60 text-[15px] font-medium`}
            >
              {status}
            </span>
          ),
          createDate: (
            <span className="text-body dark:text-white/60 text-[15px] font-medium">
              {moment(created_at)
                .format("LLL")
                .split(" ")
                .map((e, i) => (i !== 2 ? e : e + ","))
                .join(" ")}
            </span>
          ),
          action: (
            <div className="min-w-[150px] flex -m-2">
              <Link
                className="inline-block m-2 group"
                href={`/admin/submissions/detail/${_id}`}
              >
                <Button className="bg-primary text-white">
                  <UilEye className="w-4" /> View
                </Button>
              </Link>
              <Link
                className={`inline-block m-2 p-0 ${
                  status.toLowerCase() !== "rejected" && "cursor-not-allowed"
                }`}
                href="#"
              >
                <Button
                  onClick={() => status === "Rejected" && setDeleteModal(_id)}
                  className={`bg-danger text-white ${
                    status.toLowerCase() !== "rejected" && "opacity-20"
                  }`}
                >
                  <UilTrashAlt className={`w-4`} /> Delete
                </Button>
              </Link>
            </div>
          ),
        };
      });
  };

  const renderTable = (statusFilter?: string) => (
    <Table
      rowSelection={rowSelection}
      dataSource={getFilteredData(statusFilter)}
      columns={usersTableColumns}
      locale={{
        emptyText: loading ? <Skeleton active={true} /> : <Empty />,
      }}
      pagination={{
        defaultPageSize: 10,
        total: getFilteredData(statusFilter).length,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} dari ${total} data`,
        className: "text-end",
      }}
    />
  );

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "All Submissions",
      children: renderTable(),
    },
    {
      key: "2",
      label: "Pending",
      children: renderTable("Pending"),
    },
    {
      key: "3",
      label: "Approved",
      children: renderTable("Approved"),
    },
    {
      key: "4",
      label: "Rejected",
      children: renderTable("Rejected"),
    },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Submission List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={15}>
          <Col xs={24} className="mb-[25px]">
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              items={tabItems}
            />
          </Col>
        </Row>
      </div>
      <Modal
        title={"Reject"}
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
            onClick={() => handleHardDelete(isDeleteModal as string)}
          >
            Yes
          </Button>,
        ]}
      >
        <div>Are you sure want to Delete this submission?</div>
      </Modal>
    </>
  );
}

export default SubmissionsList;
