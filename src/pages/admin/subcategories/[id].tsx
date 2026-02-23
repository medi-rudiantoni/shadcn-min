import { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { Col, Row, Card, Skeleton, Button } from "antd";
import { useRouter } from "next/router";
import { PageHeaders } from "@/components/page-headers";
import { getSubCategory } from "@/functions/subcategory";

interface SubCategoryTypeResponse {
  _id: string;
  subcategory_id: string;
  name: string;
  slug: string;
  status: string;
  image: string;
  parent: string;
  createdAt: string;
  updatedAt: string;
}

function DetailSubCategory() {
  const [subCategory, setSubCategory] =
    useState<SubCategoryTypeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) retrieveSubCategoryById();
  }, [id]);

  function retrieveSubCategoryById() {
    if (!id) return;

    getSubCategory(id)
      .then((res) => {
        console.log("sub category api response: ", res);
        if (res.data.success) {
          setSubCategory(res.data.subcategory);
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
    { path: "/admin/sub-categories", breadcrumbName: "Sub Categories" },
    { path: "detail", breadcrumbName: "Detail Sub Category" },
  ];

  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Sub Category"
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
                <h3 className="text-2xl font-bold mb-2">Sub Category Info</h3>
                <table>
                  {renderRow("Name", subCategory?.name)}
                  {renderRow("Slug", subCategory?.slug)}
                  {renderRow("Status", subCategory?.status)}
                  {renderRow("Parent ID", subCategory?.parent)}
                  {renderRow("Image", subCategory?.image)}
                  {renderRow(
                    "Created At",
                    moment(subCategory?.createdAt).format("LL"),
                  )}
                  {renderRow(
                    "Updated At",
                    moment(subCategory?.updatedAt).format("LL"),
                  )}
                </table>
              </Col>

              <Col span={24}>
                <Button type="primary" className="mt-4">
                  <Link href="/admin/subcategories">Back</Link>
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
}

export default DetailSubCategory;
