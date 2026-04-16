import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Head from "next/head";
import { toast } from "react-toastify";
import moment from "moment";
import Link from "next/link";
import { Col, Row, Card, Skeleton, Button, Modal } from "antd";
import { UilDownloadAlt, UilPrint, UilPen } from "@iconscout/react-unicons";
import { useRouter } from "next/router";
import { PartnerContractResponse } from "..";
import { PageHeaders } from "@/components/page-headers";
import {
  getServicePartnerContractDetail,
  signServicePartnerContract,
} from "@/functions/partnerContract";
import { getMasterContractSP } from "@/functions/masterContract";
import { ContractData } from "@/types/masterContract";
import ContractViewer from "@/components/custom/ContractViewer";
import { exportToPdfUtil } from "@/utils/exportToPdf";
import { printPdfUtil } from "@/utils/printPdf";

function DetailContract() {
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  const [partnerContract, setPartnerContract] =
    useState<PartnerContractResponse | null>(null);
  const [isContractCreated, setContractCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [template, setTemplate] = useState<string>("");
  const [dynamicContractData, setDynamicContractData] =
    useState<any | null>(null);
  const [loadingExportPdf, setLoadingExportPdf] = useState(false);
  const [loadingPrintPdf, setLoadingPrintPdf] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dynamicDataEditValue, setDynamicDataEditValue] =
    useState<ContractData | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadPartnerContract();
      loadMasterContract();
    }
  }, [id]);

  const loadPartnerContract = () => {
    setLoading(true);
    getServicePartnerContractDetail(token, id)
      .then((res) => {
        console.log("SERVICE PARTNER CONTRACT DETAIL: >>>", res.data);
        setPartnerContract(res.data.partnerContract);
        setContractCreated(res.data.partnerContract.signed);
        setLoading(false);
      })
      .catch((error) => {
        console.error("error get partner contract detail: >>>", error);
      });
  };

  function loadMasterContract() {
    getMasterContractSP(token)
      .then((res) => {
        console.log("nih template: ", res.data.contract.content);
        setTemplate(res.data.contract.content);
      })
      .catch((err) => {
        console.error("ERROR LOAD MASTER CONTRACT TEMPLATE: ", err);
      });
  }

  function handleSignServicePartner() {
    setLoadingModal(true);
    console.log("ID PARTNER CONTRACT: ", partnerContract?._id);
    signServicePartnerContract(
      { partnerContractId: partnerContract?._id },
      token,
    )
      .then(() => {
        toast.success("Update contract status success");
        loadPartnerContract();
      })
      .catch((error) => {
        console.log("ERROR SIGN BUSINESS PARTNER: ", error);
        toast.error("Update contract status failed");
      })
      .finally(() => {
        setLoadingModal(false);
        setModalOpen(false);
      });
  }

  const PageRoutes = [
    {
      path: "/manage",
      breadcrumbName: "Dashboard",
    },
    {
      path: "first",
      breadcrumbName: "Detail",
    },
  ];

  useEffect(() => {
    if (partnerContract?.contract) {
      handleSetDynamicDataInitial();
      setDynamicDataEditValue(dynamicContractData);
    }
  }, [partnerContract]);

  function handleSetDynamicDataInitial() {
    const contractStartDate = moment(
      partnerContract?.contract?.start_date,
    ).locale("id");
    const contractEndDate = moment(partnerContract?.contract?.end_date).locale(
      "id",
    );

    if (partnerContract?.contract) {
      setDynamicContractData({
        contractNumber: partnerContract.contract.number,
        contractDate: {
          day: contractStartDate.format("dddd"),
          date: contractStartDate.format("DD"),
          month: contractStartDate.format("MMMM"),
          year: contractStartDate.format("YYYY"),
        },
        secondParty: {
          companyName:
            partnerContract.contract.partner.companyName.toUpperCase(),
          address:
            partnerContract.contract.partner.companyAddress.toUpperCase(),
          representative:
            partnerContract.contract.partner.ownerFullName.toUpperCase(),
          position: "contract.partner",
        },
        contractDateNumbers: contractStartDate.format("Do-MM-YYYY"),
        contractDateNumbersEnd: contractEndDate.format("Do-MM-YYYY"),
        contractDuration: partnerContract?.contract?.duration,
        contractEndDate: {
          date: contractEndDate.format("DD"),
          month: contractEndDate.format("MMMM"),
          year: contractEndDate.format("YYYY"),
        },
        contractDateText: contractStartDate.format("Do MMMM YYYY"),
      });
    }
  }

  useEffect(
    () => setDynamicDataEditValue(dynamicContractData),
    [dynamicContractData],
  );

  async function exportPdf() {
    setLoadingExportPdf(true);
    exportToPdfUtil(
      {
        htmlTemplate: template,
        templateData: dynamicContractData as any,
        docName: "Service Partner Agreement",
        partnerType: "service"
      }
    )
      .then(() => toast.success("Generate PDF Success"))
      .catch(() => toast.error("Failed to generate PDF"))
      .finally(() => setLoadingExportPdf(false));
  }
  function printPdf() {
    setLoadingPrintPdf(true);
    printPdfUtil(template, dynamicContractData as any)
      .then(() => toast.success("Generate PDF Success"))
      .catch(() => toast.error("Failed to generate PDF"))
      .finally(() => setLoadingPrintPdf(false));
  }

  return (
    <>
      <Head>
        <title>Detail Service Partner Contract - Admin Service Hub</title>
      </Head>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Service Partner Contract"
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
              <Col xs={24}>
                <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b">
                  <h3 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                    Contract Data
                  </h3>
                </div>
              </Col>
              <Col xs={24} md={12} className="pt-4">
                <table>
                  <tr>
                    <td>Company Name</td>
                    <td>:</td>
                    <td>{partnerContract?.contract.customer.companyName}</td>
                  </tr>
                  <tr>
                    <td>Contract Name</td>
                    <td>:</td>
                    <td>{partnerContract?.contract.number}</td>
                  </tr>
                  <tr>
                    <td>Contract Duration</td>
                    <td>:</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {partnerContract?.contract.duration}{" "}
                      {partnerContract?.contract.durationUnit}
                    </td>
                  </tr>
                  <tr>
                    <td>Contract Value</td>
                    <td>:</td>
                    <td>
                      {"Rp"}
                      {partnerContract?.contract.values
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                    </td>
                  </tr>
                </table>
              </Col>
              <Col xs={24} md={12} className="pt-4">
                <table>
                  <tr>
                    <td>PIC</td>
                    <td>:</td>
                    <td>{partnerContract?.contract.customer?.fullName}</td>
                  </tr>
                  <tr>
                    <td>PIC Phone</td>
                    <td>:</td>
                    <td>{partnerContract?.contract.customer?.phone}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>:</td>
                    <td>{partnerContract?.contract.customer?.companyPhone}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>{partnerContract?.contract.customer?.email}</td>
                  </tr>
                </table>
              </Col>
            </Row>
          )}
        </Card>
        <Card className="my-5">
          <Row>
            <Col xs={24}>
              <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b flex items-center justify-between">
                <h3 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                  Service Partner Agreement
                </h3>
                <div className="flex items-center gap-2">
                  {isContractCreated ? (
                    <div className="text-green-700 mr-4">
                      Document already signed
                    </div>
                  ) : (
                    <Button
                      onClick={() =>
                        template.length <= 1
                          ? toast.error(
                              "Master Contract Doesn't exist yet!, please create it first",
                            )
                          : setModalOpen(true)
                      }
                      type="primary"
                      className="flex items-center gap-1.5 px-4 py-1.5"
                    >
                      <UilPen className="w-5 -translate-y-0.5" />
                      <span>Is Document Signed?</span>
                    </Button>
                  )}
                  <Button
                    onClick={() => (loadingExportPdf ? false : exportPdf())}
                    className="flex items-center gap-1.5 px-4 py-1.5"
                  >
                    <UilDownloadAlt className="w-5 -translate-y-0.5" />
                    {loadingExportPdf ? (
                      <span>Loading...</span>
                    ) : (
                      <span>Download PDF</span>
                    )}
                  </Button>
                  <Button
                    onClick={() => (loadingPrintPdf ? false : printPdf())}
                    className="flex items-center gap-1.5 px-4 py-1.5"
                  >
                    <UilPrint className="w-5 -translate-y-0.5" />
                    {loadingPrintPdf ? (
                      <span>Loading...</span>
                    ) : (
                      <span>Print PDF</span>
                    )}
                  </Button>
                  {/* {template.length > 1 && (
                    <Button
                      onClick={() => setModalEdit(true)}
                      className="flex items-center gap-1.5 px-4 py-1.5"
                    >
                      <UilPen className="w-5 -translate-y-0.5" />
                      Edit Values
                    </Button>
                  )} */}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <div className="w-full aspect-video bg-slate-200">
              {/* <iframe
                src={`/pdf/kontrak-service-hub.pdf`}
                width="100%"
                height="650px"
                style={{ border: "none" }}
              ></iframe> */}
              {template.length <= 1 ? (
                <div
                  ref={contentRef}
                  className="w-full h-fit p-20 overflow-auto flex flex-col items-center justify-center gap-4"
                >
                  <p className="text-slate-400">
                    No Master Contract for service partner Here
                  </p>
                  <Link
                    href={
                      "/admin/contracts/service-partner/create-master-contract"
                    }
                  >
                    <Button className="bg-blue-600 text-white active:bg-blue-900">
                      Create Master Contract
                    </Button>
                  </Link>
                </div>
              ) : (
                <div
                  ref={contentRef}
                  className="w-fit h-fit max-h-[600vh] overflow-auto p-5 bg-neutral-200"
                >
                  <ContractViewer
                    htmlTemplate={template}
                    data={dynamicContractData as ContractData}
                    partnerType="service"
                  />
                </div>
              )}
            </div>
          </Row>
        </Card>
        <Modal
          title={"Contract Signature Status"}
          open={modalOpen}
          onOk={() => handleSignServicePartner()}
          onCancel={() => setModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalOpen(false)}>
              No
            </Button>,
            <Button
              key="submit"
              type="primary"
              danger
              loading={loadingModal}
              onClick={handleSignServicePartner}
            >
              Yes
            </Button>,
          ]}
        >
          <div>
            Is the contract document fully signed by all involved parties?
          </div>
        </Modal>
      </div>
    </>
  );
}

export default DetailContract;
