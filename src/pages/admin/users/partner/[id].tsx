import { Col, Row, Form, Input, Button, Select, Card, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { UilSave } from "@iconscout/react-unicons";
import { PageHeaders } from "@/components/page-headers";
import { getPartnerById } from "@/functions/partner";
const { TextArea } = Input;
const { Option } = Select;

function DetailPartner() {
  const [partner, setPartner] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  useEffect(() => {
    if (id) {
      getPartnerById(id, token).then((res) => {
        console.log("PARTNER DATA", res.data.partner);
        if (res.data.success) {
          setPartner(res.data.partner);
          setLoading(false);
        }
      });
    }
  }, [id]);

  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Detail Partner",
    },
  ];
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Partner"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Card>
          {loading ? (
            <div style={{ padding: 20 }}>
              <Skeleton active />
            </div>
          ) : (
            <Row gutter={15}>
              <Col xs={24} className="mb-[15px]">
                {/* {JSON.stringify(partner)} */}
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    Company Data
                  </h4>
                </div>
                <table>
                  <tr>
                    <td>Company Name</td>
                    <td>:</td>
                    <td>{partner?.companyName}</td>
                  </tr>
                  <tr>
                    <td>Company Address</td>
                    <td>:</td>
                    <td>
                      {partner?.companyAddress},{" "}
                      {partner?.subdistrict?.subdistrict_name},{" "}
                      {partner?.city?.city_name}, {partner?.province?.province}
                    </td>
                  </tr>
                  <tr>
                    <td>Company Phone</td>
                    <td>:</td>
                    <td>{partner?.companyPhone}</td>
                  </tr>
                  <tr>
                    <td>Company Email</td>
                    <td>:</td>
                    <td>{partner?.companyEmail}</td>
                  </tr>

                  <tr>
                    <td>Tax Number</td>
                    <td>:</td>
                    <td>{partner?.taxNumber}</td>
                  </tr>
                </table>
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    PIC Data
                  </h4>
                </div>
                <table>
                  <tr>
                    <td>PIC Name</td>
                    <td>:</td>
                    <td>{partner?.fullName}</td>
                  </tr>
                  <tr>
                    <td>PIC Phone</td>
                    <td>:</td>
                    <td>{partner?.phone}</td>
                  </tr>
                  <tr>
                    <td>Company Email</td>
                    <td>:</td>
                    <td>{partner?.companyEmail}</td>
                  </tr>

                  <tr>
                    <td>Tax Number</td>
                    <td>:</td>
                    <td>{partner?.tax_id}</td>
                  </tr>
                </table>
              </Col>

              <Col xs={24}>
                <Button type="primary" className="mb-3 mt-5">
                  <Link href="/admin/users/partner">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailPartner;
