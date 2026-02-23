import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Col, Row, Card, Skeleton, Button } from "antd";
import { useRouter } from "next/router";
import { PageHeaders } from "@/components/page-headers";
import { getCustomer } from "@/functions/customer";

interface CustomerTypeResponse {
  _id: string;
  customerId: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  partner: string[];
  fullName: string;
  username: string;
  email: string;
  phone: string;
  industry: string;
  address: string;
  pic_fina_email: string;
  pic_fina_name: string;
  pic_fina_phone: string;
  pic_it_email: string;
  pic_it_name: string;
  pic_it_phone: string;
  pin: string;
  position: object;
  province: string;
  subdistrict: string;
  city: string;
  postalCode: string;
  role: string;
  tax_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

function DetailCustomer() {
  const [customer, setCustomer] = useState<CustomerTypeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) retrieveCustomerById();
  }, [id]);

  function retrieveCustomerById() {
    getCustomer(id, token)
      .then((res) => {
        if (res.data.success) {
          setCustomer(res.data.result);
          setLoading(false);
        }
      })
      .catch((error) => console.log("error: ", error));
  }

  const renderRow = (label: string, value: any) => (
    <tr>
      <td className="text-sm text-gray-600 py-1">{label}</td>
      <td className="px-2">:</td>
      <td className="text-sm font-medium text-black">{value || "-"}</td>
    </tr>
  );

  const PageRoutes = [
    { path: "/admin", breadcrumbName: "Dashboard" },
    { path: "first", breadcrumbName: "Detail Customer" },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Customer"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Card>
          {loading ? (
            <div style={{ padding: 20 }}>
              <Skeleton active />
            </div>
          ) : (
            <Row gutter={[32, 24]}>
              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Company</h3>
                <table>
                  {renderRow("Customer ID", customer?.customerId)}
                  {renderRow("Company Name", customer?.companyName)}
                  {renderRow("Company Email", customer?.companyEmail)}
                  {renderRow("Company Phone", customer?.companyPhone)}
                  {renderRow("Industry", customer?.industry)}
                  {renderRow("Tax ID", customer?.tax_id)}
                  {renderRow("PIN", customer?.pin)}
                </table>
              </Col>

              <Col span={12}>
                {customer?.pic_fina_name && (
                  <>
                    <h3 className="text-2xl font-bold mb-2">PIC Finance</h3>
                    <table>
                      {renderRow("Name", customer?.pic_fina_name)}
                      {renderRow("Email", customer?.pic_fina_email)}
                      {renderRow("Phone", customer?.pic_fina_phone)}
                    </table>
                  </>
                )}

                <h3 className="text-2xl font-bold mt-6 mb-2">PIC IT</h3>
                <table>
                  {renderRow("Name", customer?.pic_it_name)}
                  {renderRow("Email", customer?.pic_it_email)}
                  {renderRow("Phone", customer?.pic_it_phone)}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">User Info</h3>
                <table>
                  {renderRow("Full Name", customer?.fullName)}
                  {renderRow("Username", customer?.username)}
                  {renderRow("Email", customer?.email)}
                  {renderRow("Phone", customer?.phone)}
                  {renderRow("Role", customer?.role)}
                  {renderRow("Status", customer?.status)}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Alamat</h3>
                <table>
                  {renderRow("Address", customer?.address)}
                  {renderRow("Province", customer?.province)}
                  {renderRow("City", customer?.city)}
                  {renderRow("Subdistrict", customer?.subdistrict)}
                  {renderRow("Postal Code", customer?.postalCode)}
                </table>
              </Col>

              <Col span={24}>
                <Button type="primary" className="mt-4">
                  <Link href="/admin/users/customer">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailCustomer;
