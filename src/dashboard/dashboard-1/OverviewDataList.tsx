import React, { useEffect, useState } from "react";
import { Row, Col, Skeleton } from "antd";
import Cookies from "js-cookie";
import OverviewCard from "@/components/cards/OverviewCard";

// import OverviewData from '../../demoData/overviewData.json';
import { OverviewData } from "@/functions/dashboard";

const OverviewDataList = React.memo((column: any) => {
  const [data, setData] = useState<any>([]);
  const token = Cookies.get("access_token");
  useEffect(() => {
    OverviewData(token).then((res) => {
      setData(res.data);
    });
  }, []);
  // partner, customer, engineer, transaction
  const OverviewDataSorted = [
    {
      id: 1,
      type: "primary",
      icon: "briefcase.svg",
      label: "Total Partner",
      total: data && data.partner,
      suffix: "",
      prefix: "",
      status: "",
      statusRate: "",
      decimal: 0,
      dataPeriod: "",
      statusColor: "success",
    },
    {
      id: 2,
      type: "info",
      icon: "user.svg",
      label: "Total Engineer",
      total: data && data.engineer,
      suffix: "",
      prefix: "",
      status: "growth",
      statusRate: "25.36",
      decimals: 0,
      separator: ",",
      dataPeriod: "Since last month",
      statusColor: "success",
    },
    {
      id: 3,
      type: "secondary",
      icon: "dollar-circle.svg",
      label: "Total Transaction",
      total: data && data.transaction,
      suffix: "",
      prefix: "",
      status: "down",
      statusRate: "25.36",
      decimals: 0,
      separator: ",",
      dataPeriod: "Since last month",
      statusColor: "danger",
    },
    {
      id: 4,
      type: "warning",
      icon: "users-alt.svg",
      label: "Total Customer",
      total: data && data.customer,
      suffix: "",
      prefix: "",
      status: "growth",
      statusRate: "25.36",
      decimals: 0,
      separator: ",",
      dataPeriod: "Since last month",
      statusColor: "success",
    },
  ];
  return (
    <Row gutter={25}>
      {OverviewDataSorted.map((item: {}, i: number) => {
        return (
          <Col className="mb-[25px]" xxl={6} md={12} xs={24} key={i}>
            {data ? (
              <OverviewCard data={item} contentFirst />
            ) : (
              <Skeleton active />
            )}
          </Col>
        );
      })}
    </Row>
  );
});
OverviewDataList.displayName = "OverviewDataList";
export default OverviewDataList;
