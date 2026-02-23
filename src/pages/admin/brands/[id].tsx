import { Col, Row, Card, Skeleton, Button } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import moment from "moment";
import { PageHeaders } from "@/components/page-headers";
import { getBrand } from "@/functions/brand";

interface Brand {
  _id: string;
  brandId: string;
  brandDetail: string;
  brandLogo: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: string;
}

function DetailBrand() {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) retrieveBrandById();
  }, [id]);

  function retrieveBrandById() {
    if (!id || !token) return;

    getBrand(id, token)
      .then((res) => {
        console.log("brand api response: ", res);
        if (res?.data?.brand) {
          setBrand(res.data.brand);
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
    { path: "/admin/brands", breadcrumbName: "Brands" },
    { path: "detail", breadcrumbName: "Detail Brand" },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Brand"
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
                <h3 className="text-2xl font-bold mb-2">Brand Info</h3>
                <table>
                  {renderRow("Brand ID", brand?.brandId)}
                  {renderRow("Name", brand?.name)}
                  {renderRow("Category ID", brand?.category)}
                  {renderRow("Status", brand?.status)}
                  {renderRow(
                    "Created At",
                    moment(brand?.createdAt).format("LL"),
                  )}
                  {renderRow(
                    "Updated At",
                    moment(brand?.updatedAt).format("LL"),
                  )}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Detail & Logo</h3>
                <table>
                  {renderRow("Detail", brand?.brandDetail)}
                  {renderRow(
                    "Logo",
                    brand?.brandLogo ? (
                      <Image
                        src={brand.brandLogo}
                        alt="Brand Logo"
                        className="h-12 mt-1"
                      />
                    ) : (
                      "No logo"
                    ),
                  )}
                </table>
              </Col>

              <Col span={24}>
                <Button type="primary" className="mt-4">
                  <Link href="/admin/brands">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailBrand;
