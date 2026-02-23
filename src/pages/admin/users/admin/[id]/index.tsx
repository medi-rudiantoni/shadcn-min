import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Col, Row, Button, Card, Skeleton } from "antd";
import { useRouter } from "next/router";
import { PageHeaders } from "@/components/page-headers";
import { getAdmin } from "@/functions/admin";

interface AdminTypeResponse {
  _id: string;
  displayName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

function DetailAdmin() {
  const [admin, setAdmin] = useState<AdminTypeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  useEffect(() => {
    if (id) {
      getAdmin(id, token).then((res) => {
        if (res.data.success) {
          setAdmin(res.data.result);
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
      breadcrumbName: "Detail Admin",
    },
  ];
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Admin"
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
                {/* {JSON.stringify(Admin)} */}
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    Admin Data
                  </h4>
                </div>
                <table className="mt-2">
                  <tbody>
                    <tr>
                      <td>Username</td>
                      <td className="px-2">:</td>
                      <td>{admin?.username}</td>
                    </tr>
                    {admin?.displayName && (
                      <tr>
                        <td>Display Name</td>
                        <td className="px-2">:</td>
                        <td>{admin?.displayName}</td>
                      </tr>
                    )}
                    <tr>
                      <td>Email</td>
                      <td className="px-2">:</td>
                      <td>{admin?.email}</td>
                    </tr>
                    <tr>
                      <td>Role</td>
                      <td className="px-2">:</td>
                      <td>{admin?.role}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td className="px-2">:</td>
                      <td>{admin?.status}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>

              <Col xs={24}>
                <Button type="primary" className="mb-3 mt-5">
                  <Link href="/admin/users/admin">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailAdmin;
