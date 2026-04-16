import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Bounce, toast } from "react-toastify";
import Head from "next/head";
import {
  Col,
  Row,
  Input,
  Button,
  Select,
  Card,
  Skeleton,
  Table,
  Empty,
  Modal,
} from "antd";
import { useRouter } from "next/router";
import {
  UilSave,
  UilEdit,
  UilDownloadAlt,
  UilPrint,
  UilPen,
} from "@iconscout/react-unicons";
import moment from "moment";
import "moment/locale/id";
import { PageHeaders } from "@/components/page-headers";
import {
  getContractDetail,
  getServicePartner,
  updateServicePartner,
} from "@/functions/contract";
import {
  createBusinessPartnerContract,
  createServicePartnerContract,
  signBusinessPartnerContract,
} from "@/functions/partnerContract";
import { ContractResponse } from "@/types/contract";
import { ContractData } from "@/types/masterContract";
import {
  getAllMasterContracts,
  getMasterContractBP,
} from "@/functions/masterContract";
import ContractViewer from "@/components/custom/ContractViewer";
import { exportToPdfUtil } from "@/utils/exportToPdf";
import { printPdfUtil } from "@/utils/printPdf";

function DetailBusinessContract() {
  const token = Cookies.get("access_token");
  const router = useRouter();
  let { id } = router.query;
  const [contract, setContract] = useState<ContractResponse | null>();
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [data, setData] = useState<any>({});
  const [isContractCreated, setContractCreated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [template, setTemplate] = useState("");
  const [dynamicContractData, setDynamicContractData] =
    useState<any | null>(null);
  const [loadingExportPdf, setLoadingExportPdf] = useState(false);
  const [loadingPrintPdf, setLoadingPrintPdf] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadContract();
      loadMasterContract();
    }
  }, [id]);

  function loadContract() {
    setLoading(true);
    getContractDetail(id, token).then((res) => {
      if (res.data.success) {
        setContract(res.data.contract);
        console.log("CONTRACT DATA: >>> ", res.data);
        setData({ ...data, customer: res.data?.contract?.customer?._id });
        // if(res.data.contract.partner.partnerContract.length > 0){
        if (res.data.contract.partnerContract.length >= 1) {
          setContractCreated(true);
        }
        setLoading(false);
      } else {
        toast.error(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setLoading(false);
      }
    });
  }

  function loadMasterContract() {
    getMasterContractBP(token)
      .then((res) => {
        setTemplate(res.data.contract.content);
      })
      .catch((err) => {
        console.error("ERROR LOAD MASTER CONTRACT TEMPLATE: ", err);
      });
  }

  function handleCreateContract() {
    setLoading(true);
    const data = {
      contractId: contract?._id,
      businessPartnerId: contract?.partner._id,
    };
    createBusinessPartnerContract(data, token)
      .then((res) => {
        toast.success("Create Contract Success");
        setContractCreated(true);
        console.log(res);
        loadContract();
      })
      .catch((error) => {
        console.error("ERROR CREATE CONTRACT BUSINESS PARTNER: ", error);
        toast.error("Create Contract Failed");
      })
      .finally(() => setLoading(false));
  }

  function handleSignBusinessPartner() {
    setLoadingModal(true);
    signBusinessPartnerContract(
      { partnerContractId: contract?.partnerContract[0]._id },
      token,
    )
      .then(() => {
        toast.success("Update contract status success");
        loadContract();
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
      breadcrumbName: "Detail Contract",
    },
  ];

  useEffect(() => {
    if (contract) {
      handleSetDynamicDataInitial();
    }
  }, [contract]);

  function handleSetDynamicDataInitial() {
    const contractStartDate = moment(contract?.start_date).locale("id");
    const contractEndDate = moment(contract?.end_date).locale("id");

    if (contract) {
      setDynamicContractData({
        contractNumber: contract.number,
        contractDate: {
          day: contractStartDate.format("dddd"),
          date: contractStartDate.format("DD"),
          month: contractStartDate.format("MMMM"),
          year: contractStartDate.format("YYYY"),
          numbers: contractStartDate.format("Do-MM-YYYY"),
          text: contractStartDate.format("Do MMMM YYYY"),
          location: "Jakarta"
        },
        endDate: {
          day: contractEndDate.format("dddd"),
          date: contractEndDate.format("DD"),
          month: contractEndDate.format("MMMM"),
          year: contractEndDate.format("YYYY"),
          numbers: contractEndDate.format("Do-MM-YYYY"),
          text: contractEndDate.format("Do MMMM YYYY"),
        },
        duration: contract?.duration,
        // firstParty: {
        //   companyName: "PT Rumah Aplikasi Kita".toUpperCase(),
        //   address: "Tanah Sereal, Bogor".toUpperCase(),
        //   representative: "Aryo".toUpperCase(),
        //   position: "PIC",
        // },
        secondParty: {
          companyName: contract.partner.companyName.toUpperCase(),
          address: contract.partner.companyAddress.toUpperCase(),
          person: {
            name: contract.partner.ownerFullName.toUpperCase(),
            position: "Direktur"
          }
        },
        bankDetails: {
          bankName: "................",
          branch: "................",
          accountNumber: "................",
          accountHolder: "................",
        },
        contractEndDate: {
          date: contractEndDate.format("DD"),
          month: contractEndDate.format("MMMM"),
          year: contractEndDate.format("YYYY"),
        }
      });
    }
  }

  function exportPdf() {
    setLoadingExportPdf(true);
    exportToPdfUtil(
      // template,
      // dynamicContractData as any,
      // "Business Partner Agreement",
      {
        htmlTemplate: template,
        templateData: dynamicContractData as any,
        docName: "Business Partner Agreement",
        partnerType: "business"
      }
    )
      .then(() => toast.success("Generate PDF Success"))
      .catch(() => toast.error("Generate PDF Failed"))
      .finally(() => setLoadingExportPdf(false));
  }
  function printPdf() {
    setLoadingPrintPdf(true);
    printPdfUtil(template, dynamicContractData as any)
      .then(() => toast.success("Generate PDF Success"))
      .catch(() => toast.error("Generate PDF Failed"))
      .finally(() => setLoadingPrintPdf(false));
  }

  return (
    <>
      <Head>
        <title>Detail Contract - Admin Service Hub</title>
      </Head>
      <PageHeaders
        routes={PageRoutes}
        title="Detail Contract - Business Partner"
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
              <Col xs={24} md={12}>
                <table>
                  <tr>
                    <td>Company Name</td>
                    <td>:</td>
                    <td>{contract?.customer?.companyName}</td>
                  </tr>
                  <tr>
                    <td>Contract Name</td>
                    <td>:</td>
                    <td>{contract?.number}</td>
                  </tr>
                  <tr>
                    <td>Contract Duration</td>
                    <td>:</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {contract?.duration} {contract?.durationUnit}
                    </td>
                  </tr>
                  <tr>
                    <td>Contract Value</td>
                    <td>:</td>
                    <td>
                      {"Rp"}
                      {contract?.values
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                    </td>
                  </tr>
                </table>
              </Col>
              <Col xs={24} md={12}>
                <table>
                  <tr>
                    <td>PIC</td>
                    <td>:</td>
                    <td>{contract?.customer?.fullName}</td>
                  </tr>
                  <tr>
                    <td>PIC Phone</td>
                    <td>:</td>
                    <td>{contract?.customer?.phone}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>:</td>
                    <td>{contract?.customer?.companyPhone}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>{contract?.customer?.email}</td>
                  </tr>
                </table>
              </Col>
              {/* {JSON.stringify(data)}
                {JSON.stringify(devices)} */}
              {/* <Button type="primary" className="mb-3 mt-5 mr-3">
                <Link href="/admin/contracts">Back</Link>
              </Button> */}
            </Row>
          )}
        </Card>
        <Card className="my-5 border">
          <Row>
            <Col xs={24}>
              <div className="h-[60px] text-dark dark:text-white/[.87] font-medium text-[17px] border-regular dark:border-white/10 border-b flex items-center justify-between">
                <h3 className="mb-0 inline-block py-[16px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold">
                  Business Partner Agreement
                </h3>
                {isContractCreated ? (
                  <div className="flex items-center gap-2">
                    {contract?.partnerContract[0] &&
                    contract.partnerContract[0].signed ? (
                      <div className="text-green-700 mr-4">
                        Document has been signed
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-1.5"
                      >
                        <UilPen className="w-5 -translate-y-0.5" />
                        <span>Signature Status</span>
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
                        <span>Print</span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* create contract */}
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {isContractCreated ? (
            <Row>
              <div className="w-full aspect-video bg-slate-200 p-5 overflow-auto flex justify-center">
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
                      No Master Contract For Business Partner Here
                    </p>
                    <Link
                      href={
                        "/admin/contracts/business-partner/create-master-contract"
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
                    className="w-fit h-fit max-h-[600vh] overflow-auto"
                  >
                    <ContractViewer
                      htmlTemplate={template}
                      data={dynamicContractData as ContractData}
                      partnerType="business"
                    />
                  </div>
                )}
              </div>
            </Row>
          ) : (
            <div className="w-full aspect-[8/1] flex items-center justify-center">
              <Button
                onClick={() =>
                  template.length <= 1
                    ? toast.error(
                        "Master Contract Doesn't exist yet!, please create it first",
                      )
                    : handleCreateContract()
                }
                type="primary"
                className="flex items-center gap-1.5 px-4 py-1.5"
              >
                <UilPen className="w-5 -translate-y-0.5" />
                <span>Create Contract</span>
              </Button>
            </div>
          )}
        </Card>
        <Modal
          title={"Contract Signature Status"}
          open={modalOpen}
          onOk={() => handleSignBusinessPartner()}
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
              onClick={handleSignBusinessPartner}
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

export default DetailBusinessContract;
