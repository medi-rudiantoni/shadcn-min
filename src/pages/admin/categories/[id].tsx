import { Col, Row, Card, Skeleton, Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import moment from "moment";
import { PageHeaders } from "@/components/page-headers";
import { getCategory } from "@/functions/category";

interface CategoryTypeResponse {
  _id: string;
  category_id: number;
  name: string;
  slug: string;
  commonProblems: string[];
  createdAt: string;
  updatedAt: string;
}

function DetailCategory() {
  const [category, setCategory] = useState<CategoryTypeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access_token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) retrieveCategoryById();
  }, [id]);

  function retrieveCategoryById() {
    if (!id || !token) return;

    getCategory(id, token)
      .then((res) => {
        console.log("category api response: ", res);
        if (res.data.success) {
          setCategory(res.data.category);
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
    { path: "/admin/categories", breadcrumbName: "Categories" },
    { path: "detail", breadcrumbName: "Detail Category" },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Category"
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
                <h3 className="text-2xl font-bold mb-2">Category Info</h3>
                <table>
                  {renderRow("Category ID", category?.category_id)}
                  {renderRow("Name", category?.name)}
                  {renderRow("Slug", category?.slug)}
                  {renderRow(
                    "Created At",
                    moment(category?.createdAt).format("LL"),
                  )}
                  {renderRow(
                    "Updated At",
                    moment(category?.updatedAt).format("LL"),
                  )}
                </table>
              </Col>

              <Col span={12}>
                <h3 className="text-2xl font-bold mb-2">Common Problems</h3>
                <ul className="list-disc ml-5 text-sm text-black">
                  {category?.commonProblems?.length ? (
                    category.commonProblems.map((problem, idx) => (
                      <li key={idx}>{problem}</li>
                    ))
                  ) : (
                    <li>-</li>
                  )}
                </ul>
              </Col>

              <Col span={24}>
                <Button type="primary" className="mt-4">
                  <Link href="/admin/categories">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailCategory;
