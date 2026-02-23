import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import moment from "moment";
import { Col, Row, Card, Skeleton, Button } from "antd";
import { useRouter } from "next/router";
import { PageHeaders } from "@/components/page-headers";
import { getSkill } from "@/functions/skill";

interface SkillTypeResponse {
  _id: string;
  name: string;
  shortName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function DetailSkill() {
  const [skill, setSkill] = useState<SkillTypeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) retrieveSkillById();
  }, [id]);

  function retrieveSkillById() {
    if (!id || !token) return;

    getSkill(id, token)
      .then((res) => {
        console.log("skill api response: ", res);
        if (res.data.success) {
          setSkill(res.data.skill);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error: ", error);
        setLoading(false);
      });
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
    { path: "/admin/skills", breadcrumbName: "Skills" },
    { path: "detail", breadcrumbName: "Detail Skill" },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Skill"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />

      <div className="min-h-[400px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <Card>
          {loading ? (
            <div style={{ padding: 20 }}>
              <Skeleton active />
            </div>
          ) : (
            <Row gutter={[32, 24]}>
              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Skill Info</h3>
                <table>
                  {renderRow("Skill Name", skill?.name)}
                  {renderRow("Short Name", skill?.shortName)}
                  {renderRow("Status", skill?.status)}
                  {renderRow(
                    "Created At",
                    moment(skill?.createdAt).format("LL"),
                  )}
                  {renderRow(
                    "Updated At",
                    moment(skill?.updatedAt).format("LL"),
                  )}
                </table>
              </Col>

              <Col span={24}>
                <Button type="primary" className="mt-4">
                  <Link href="/admin/skills">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailSkill;
