import { Col, Row, Card, Skeleton, Button } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { UilUser } from "@iconscout/react-unicons";

import { PageHeaders } from "@/components/page-headers";
import { getEngineer } from "@/functions/engineer";

interface CityTypeResponse {
  _id: string;
  city_id: string;
  city_name: string;
  postal_code: string;
  province: string;
  province_id: string;
  type: string;
}

interface EngineerTypeResponse {
  _id: string;
  fullname: string;
  username: string;
  verified: boolean;
  email: string;
  mainPhone: string;
  secondPhone: string;
  role: string;
  idCard: string | null;
  typeEngineer: string;
  skill: string;
  workExperience: any[];
  step: number;
  onDuty: boolean;
  orders: string;
  partners: string[];
  pendingStatus: string;
  pin: string | number | null;
  position: {
    latitude: string | null;
    longitude: string | null;
  };
  profilePicture: string | null;
  province: string;
  subdistrict: string;
  rating: number;
  regCode: string;
  address: string;
  city: CityTypeResponse;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

function DetailEngineer() {
  const [engineer, setEngineer] = useState<EngineerTypeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) retrieveEngineerById();
  }, [id]);

  function retrieveEngineerById() {
    getEngineer(id, token)
      .then((res) => {
        if (res.data.success) {
          setEngineer(res.data.engineer);
          setLoading(false);
        }
      })
      .catch((error) => console.log("error: ", error));
  }

  const renderRow = (label: string, value: any) => (
    <tr>
      <td className="text-sm text-gray-600 py-1">{label}</td>
      <td className="px-2">:</td>
      <td className="text-sm font-medium text-black">
        {value !== null && value !== undefined && value !== "" ? value : "-"}
      </td>
    </tr>
  );

  const PageRoutes = [
    { path: "/admin", breadcrumbName: "Dashboard" },
    { path: "/admin/engineer", breadcrumbName: "Engineer" },
    { path: "detail", breadcrumbName: "Detail Engineer" },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Engineer"
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
              <Col span={24} className="flex mb-8">
                {engineer?.profilePicture ? (
                  <Image
                    src={engineer.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-md object-cover border"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-md bg-gray-200 flex items-center justify-center border">
                    <UilUser size="48" className="text-gray-500" />
                  </div>
                )}
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Profile Info</h3>
                <table>
                  {renderRow("Full Name", engineer?.fullname)}
                  {renderRow("Username", engineer?.username)}
                  {renderRow("Verified", engineer?.verified ? "Yes" : "No")}
                  {renderRow("Role", engineer?.role)}
                  {renderRow("Type", engineer?.typeEngineer)}
                  {renderRow("Skill", engineer?.skill)}
                  {renderRow(
                    "Experience",
                    `${engineer?.workExperience?.length || 0} entries`,
                  )}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Contact</h3>
                <table>
                  {renderRow("Email", engineer?.email)}
                  {renderRow("Main Phone", engineer?.mainPhone)}
                  {renderRow("Second Phone", engineer?.secondPhone)}
                  {renderRow("ID Card", engineer?.idCard)}
                  {renderRow("PIN", engineer?.pin)}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Location</h3>
                <table>
                  {renderRow("Address", engineer?.address)}
                  {renderRow("Subdistrict", engineer?.subdistrict)}
                  {renderRow("City", engineer?.city?.city_name)}
                  {renderRow("Province", engineer?.province)}
                  {renderRow("Postal Code", engineer?.city?.postal_code)}
                  {renderRow("Latitude", engineer?.position?.latitude)}
                  {renderRow("Longitude", engineer?.position?.longitude)}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Status</h3>
                <table>
                  {renderRow("Status", engineer?.status)}
                  {renderRow("Step", engineer?.step)}
                  {renderRow("On Duty", engineer?.onDuty ? "Yes" : "No")}
                  {renderRow("Pending Status", engineer?.pendingStatus)}
                  {renderRow("Orders", engineer?.orders)}
                  {renderRow("Rating", engineer?.rating)}
                  {renderRow("Reg Code", engineer?.regCode)}
                </table>
              </Col>

              <Col span={24}>
                <Button type="primary" className="mt-4">
                  <Link href="/admin/users/engineer">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailEngineer;
