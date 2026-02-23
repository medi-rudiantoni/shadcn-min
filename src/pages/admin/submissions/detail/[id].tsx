import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import moment from "moment";
import { Bounce, toast } from "react-toastify";
import { Col, Row, Button, Card, Skeleton, Modal } from "antd";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { UilThumbsDown, UilThumbsUp } from "@iconscout/react-unicons";
import { Submission } from "..";
import { PageHeaders } from "@/components/page-headers";
import { confirmSubmission, getSubmissionDetail } from "@/functions/submission";
import "moment/locale/id";
import generatePassword from "@/utils/generatePassword";
import { createPartner, deletePartner, updatePartner } from "@/functions/partner";
moment.locale("id");

function DetailSubmission() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAcceptModal, setAcceptModal] = useState<boolean>(false);
  const [isRejectModal, setRejectModal] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;

  useEffect(() => {
    if (id) {
      getSubmissionDetail(id, token).then((res) => {
        if (res.data.success) {
          setSubmission(res.data.result);
          setLoading(false);
        }
      });
    }
  }, [id]);

  function handleDeletePartner(id: string) {
    deletePartner(id, token)
      .then(() => {
        toast.error("creating partner canceled");
      })
      .catch((err) => console.log(err));
  }

  async function handleCreatePartner({
    partnerType,
  }: {
    partnerType: string;
  }): Promise<boolean> {
    try {
      const payload = {
        ...submission,
        phone: submission?.PICPhone,
        password: generatePassword(12),
        status: "active",
        ticketingMode: "auto",
      };

      if (partnerType !== "Both") {
        const data = {
          ...payload,
          typeRegister: submission?.partnerType,
          email: submission?.PICEmail,
        };

        await toast.promise(createPartner(data, token), {
          pending: `Processing create ${partnerType}...`,
          success: `Partner data has been successfully created`,
          error: {
            render({ data }) {
              const err = data as AxiosError<{ message?: string }>;
              return (
                err?.response?.data?.message || `Create ${partnerType} Failed`
              );
            },
          },
        });

        return true;
      }

      // ==== CASE BOTH (Sequential Execution) ====

      const dataBP = {
        ...payload,
        typeRegister: "Business Partner",
        email: submission?.PICEmailForBP,
      };
      const dataSP = {
        ...payload,
        typeRegister: "Service Partner",
        email: submission?.PICEmailForSP,
      };

      let createdBpId: string | null = null;

      try {
        // 1️⃣ Create BP
        const bpResponse = await createPartner(dataBP, token);
        createdBpId = bpResponse.data.data._id;

        toast.success("Business Partner created");

        // 2️⃣ Create SP
        await createPartner(dataSP, token);
        toast.success("Service Partner created");

        return true;
      } catch (error) {
        // 🔥 Kalau SP gagal dan BP sudah dibuat → rollback
        console.log(" CREATED BP ID: ", createdBpId);
        if (createdBpId) {
          try {
            await updatePartner(createdBpId, { status: "inactive" }, token)
            await deletePartner(createdBpId, token);
            toast.error(
              "Service Partner failed. Business Partner rolled back.",
            );
          } catch {
            toast.error("Rollback failed. Manual intervention required.");
          }
        }

        const err = error as AxiosError<{ message?: string }>;
        toast.error(err?.response?.data?.message || "Create Partner Failed");

        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async function handleConfirmation(value: string): Promise<boolean> {
    try {
      await toast.promise(confirmSubmission(id, { status: value }, token), {
        pending: `Processing ${value === "Approved" ? "approval" : "rejection"}...`,
        success: `The Submission has been Successfully ${value.toUpperCase()}`,
        error: `${value === "Approved" ? "APPROVE" : "REJECT"} confirmation failed`,
      });

      return true;
    } catch {
      return false;
    }
  }

  async function confirm(value: string) {
    setConfirmLoading(true);

    try {
      if (value === "Approved") {
        // 1️⃣ Create Partner dulu
        const created = await handleCreatePartner({
          partnerType: submission?.partnerType!,
        });

        if (!created) {
          toast.error(
            "Can't approve submission because partner data creation failed",
          );
          return; // stop kalau gagal
        }
      }

      // 2️⃣ Baru confirm submission
      const confirmed = await handleConfirmation(value);

      if (confirmed) {
        router.push("/admin/submissions");
      }
    } finally {
      setConfirmLoading(false);
    }
  }

  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Detail Submission",
    },
  ];
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Submission"
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
              <Col xs={12} className="mb-[15px]">
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    Company Data
                  </h4>
                </div>
                <table>
                  <tr className="bg-slate-100">
                    <td>
                      <p className="w-fit whitespace-nowrap">Company Name</p>
                    </td>
                    <td className="px-2">:</td>
                    <td>{submission?.companyName}</td>
                  </tr>
                  <tr>
                    <td>
                      <p className="w-fit whitespace-nowrap">Company Address</p>
                    </td>
                    <td className="px-2">:</td>
                    <td>{submission?.companyAddress}, </td>
                  </tr>
                  <tr className="bg-slate-100">
                    <td>
                      <p className="w-fit whitespace-nowrap">Company Phone</p>
                    </td>
                    <td className="px-2">:</td>
                    <td>{submission?.companyPhone}</td>
                  </tr>
                  <tr>
                    <td>
                      <p className="w-fit whitespace-nowrap">Company Email</p>
                    </td>
                    <td className="px-2">:</td>
                    <td>{submission?.companyEmail}</td>
                  </tr>
                </table>

                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    PIC Data
                  </h4>
                </div>
                <table className="mb-10">
                  <tr className="bg-slate-100">
                    <td>PIC Name</td>
                    <td className="px-2">:</td>
                    <td>{submission?.PICName}</td>
                  </tr>
                  <tr>
                    <td>PIC Phone</td>
                    <td className="px-2">:</td>
                    <td>{submission?.PICPhone}</td>
                  </tr>
                  {submission?.partnerType !== "Both" ? (
                    <tr className="bg-slate-100">
                      <td>PIC Email</td>
                      <td className="px-2">:</td>
                      <td>{submission?.PICEmail}</td>
                    </tr>
                  ) : (
                    <>
                      <tr className="bg-slate-100">
                        <td>PIC Email for Business Partner</td>
                        <td className="px-2">:</td>
                        <td>{submission?.PICEmailForBP}</td>
                      </tr>
                      <tr>
                        <td>PIC Email for Service Partner</td>
                        <td className="px-2">:</td>
                        <td>{submission?.PICEmailForSP}</td>
                      </tr>
                    </>
                  )}
                </table>
              </Col>
              <Col xs={12}>
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    Partnership
                  </h4>
                </div>
                <table>
                  <tr className=" bg-slate-100">
                    <td>Submission Status</td>
                    <td className="px-2">:</td>
                    <td
                      className={`font-bold ${submission?.status === "Approved" ? "text-green-700" : submission?.status === "Rejected" ? "text-red-600" : "text-blue-500"}`}
                    >
                      {submission?.status}
                    </td>
                  </tr>
                  <tr>
                    <td>Submission Date</td>
                    <td className="px-2">:</td>
                    <td>{moment(submission?.created_at).format("LL")}</td>
                  </tr>
                  <tr className=" bg-slate-100">
                    <td>Partner Type</td>
                    <td className="px-2">:</td>
                    <td className="font-bold">{submission?.partnerType}</td>
                  </tr>
                  {submission?.partnerType !== "Business Partner" && (
                    <>
                      <tr>
                        <td>Coverage Area Count </td>
                        <td className="px-2">:</td>
                        <td className="font-bold">
                          {submission?.coverageAreas.length}
                        </td>
                      </tr>
                      <tr>
                        <td>Total technician </td>
                        <td className="px-2">:</td>
                        <td className="font-bold">
                          {submission?.engineerCount}
                        </td>
                      </tr>
                    </>
                  )}
                </table>
                {(submission?.partnerType === "Service Partner" ||
                  submission?.partnerType === "Both") && (
                  <>
                    <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                      <h4 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                        Coverage Area List
                      </h4>
                    </div>
                    <table className="w-full">
                      {submission.coverageAreas.map((area, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 && "bg-slate-100"}`}
                        >
                          <td className="pr-2">{index + 1}.</td>
                          <td className="md:pl-[28.5%] w-full">
                            {area.city_name}
                          </td>
                        </tr>
                      ))}
                    </table>
                  </>
                )}
              </Col>

              <Col xs={24} className="flex items-center justify-between">
                <Button type="primary" className="mb-3 mt-5">
                  <Link href="/admin/submissions">Back</Link>
                </Button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      submission?.status !== "Rejected" && setRejectModal(true)
                    }
                    className={`py-1.5 px-3 rounded-md flex items-center gap-2 bg-red-600 text-white ${submission?.status === "Rejected" ? "opacity-20 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:bg-red-700"}`}
                  >
                    <UilThumbsDown />
                    <p>Reject</p>
                  </button>
                  <button
                    onClick={() =>
                      submission?.status !== "Approved" && setAcceptModal(true)
                    }
                    className={`py-1.5 px-3 rounded-md flex items-center gap-2 bg-green-600 text-white ${submission?.status === "Approved" ? "opacity-20 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:bg-green-700"}`}
                  >
                    <UilThumbsUp />
                    <p>Approve</p>
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Card>
      </div>
      <Modal
        title={"Reject"}
        open={isRejectModal}
        // onOk={() => }
        onCancel={() => setRejectModal(false)}
        footer={[
          <Button key={"cancel"} onClick={() => setRejectModal(false)}>
            No
          </Button>,
          <Button
            key={"submit"}
            type="primary"
            danger
            loading={confirmLoading}
            onClick={() => confirm("Rejected")}
          >
            Yes
          </Button>,
        ]}
      >
        <div>Are you sure want to reject this submission?</div>
      </Modal>
      <Modal
        title={"Accept"}
        open={isAcceptModal}
        // onOk={() => }
        onCancel={() => setAcceptModal(false)}
        footer={[
          <Button key={"cancel"} onClick={() => setAcceptModal(false)}>
            Cancel
          </Button>,
          <Button
            key={"submit"}
            type="primary"
            danger
            loading={confirmLoading}
            onClick={() => confirm("Approved")}
          >
            Approve
          </Button>,
        ]}
      >
        <div>
          If you accept this submission, the system will automatically send an
          Email to inform the Client about this confirmation
        </div>
      </Modal>
    </>
  );
}

export default DetailSubmission;
