import dynamic from "next/dynamic";
import { Row, Col, Skeleton } from "antd";
import Head from "next/head";
import { PageHeaders } from "@/components/page-headers";

const OverviewDataList = dynamic(
  () => import("@/dashboard/dashboard-1/OverviewDataList"),
  {
    loading: () => (
      <>
        <Skeleton active />
      </>
    ),
  },
);
const SalesByLocation = dynamic(
  () => import("@/dashboard/dashboard-1/SalesByLocation"),
  {
    loading: () => (
      <>
        <Skeleton active />
      </>
    ),
  },
);
const TopSellingProduct = dynamic(
  () => import("@/dashboard/dashboard-1/TopSellingProducts"),
  {
    loading: () => (
      <>
        <Skeleton active />
      </>
    ),
  },
);
const BrowserState = dynamic(
  () => import("@/dashboard/dashboard-1/BrowserState"),
  {
    loading: () => (
      <>
        <Skeleton active />
      </>
    ),
  },
);

const DemoOne = () => {
  const PageRoutes = [
    {
      path: "admin",
      breadcrumbName: "Dashboard",
    },
  ];
  return (
    <>
      <Head>
        <title>Admin Dashboard - Service Hub Indonesia</title>
      </Head>
      <PageHeaders
        routes={PageRoutes}
        title="Dashboard"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Row gutter={25}>
          <Col xxl={24} xs={24} className="mb-[25px]">
            <SalesByLocation />
          </Col>
          <Col xxl={24} xs={24}>
            <OverviewDataList />
          </Col>
        </Row>
        {/* <Row gutter={25}>
          <Col xl={12} xs={24} className="mb-[25px]">
            <TopSellingProduct />
          </Col>
          <Col xl={12} xs={24} className="mb-[25px]">
            <BrowserState />
          </Col>
        </Row> */}
      </div>
    </>
  );
};

export default DemoOne;
