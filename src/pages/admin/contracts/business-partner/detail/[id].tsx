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
import ContractViewer3 from "@/components/custom/ContractViewer3";
import { exportToPdfUtil } from "@/utils/exportToPdf";
import { printPdfUtil } from "@/utils/printPdf";
// const { Option } = Select;

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
    useState<ContractData | null>(null);
  const [loadingExportPdf, setLoadingExportPdf] = useState(false);
  const [loadingPrintPdf, setLoadingPrintPdf] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dynamicDataEditValue, setDynamicDataEditValue] =
    useState<ContractData | null>(null);

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
        // console.log("TEMPLATE: ", res.data.contract.content);
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
        },
        firstParty: {
          companyName: "PT Rumah Aplikasi Kita".toUpperCase(),
          address: "Tanah Sereal, Bogor".toUpperCase(),
          representative: "Aryo".toUpperCase(),
          position: "PIC",
        },
        secondParty: {
          companyName: contract.partner.companyName.toUpperCase(),
          address: contract.partner.companyAddress.toUpperCase(),
          representative: contract.partner.ownerFullName.toUpperCase(),
          position: "Direktur",
        },
        pricing: {
          registrationFee: ".......................",
          monitoringPerDevice: ".......................",
          perTicket: ".......................",
          onsiteInstallation: ".......................",
          onsiteRemoval: ".......................",
          onsiteRepair: ".......................",
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
        },
        signingLocation: "................",
        signingDate: moment().locale("id").format("DD MMMM YYYY"),
        regionalCourt: "Depok",
      });
    }
  }

  useEffect(
    () => setDynamicDataEditValue(dynamicContractData),
    [dynamicContractData],
  );

  function handleSetDynamicDataUpdate() {
    const contractStartDate = moment(contract?.start_date).locale("id");
    const contractEndDate = moment(contract?.end_date).locale("id");

    if (dynamicDataEditValue) {
      setDynamicContractData({
        contractNumber: dynamicDataEditValue.contractNumber,
        contractDate: {
          day: contractStartDate.format("dddd"),
          date: contractStartDate.format("DD"),
          month: contractStartDate.format("MMMM"),
          year: contractStartDate.format("YYYY"),
        },
        firstParty: {
          companyName:
            dynamicDataEditValue.firstParty.companyName.toUpperCase(),
          address: dynamicDataEditValue.firstParty.address.toUpperCase(),
          representative:
            dynamicDataEditValue.firstParty.representative.toUpperCase(),
          position: dynamicDataEditValue.firstParty.position,
        },
        secondParty: {
          companyName:
            dynamicDataEditValue.secondParty.companyName.toUpperCase(),
          address: dynamicDataEditValue.secondParty.address.toUpperCase(),
          representative:
            dynamicDataEditValue.secondParty.representative.toUpperCase(),
          position: dynamicDataEditValue.secondParty.position,
        },
        pricing: {
          registrationFee: dynamicDataEditValue.pricing.registrationFee,
          monitoringPerDevice: dynamicDataEditValue.pricing.monitoringPerDevice,
          perTicket: dynamicDataEditValue.pricing.perTicket,
          onsiteInstallation: dynamicDataEditValue.pricing.onsiteInstallation,
          onsiteRemoval: dynamicDataEditValue.pricing.onsiteRemoval,
          onsiteRepair: dynamicDataEditValue.pricing.onsiteRepair,
        },
        bankDetails: {
          bankName: dynamicDataEditValue.bankDetails.bankName,
          branch: dynamicDataEditValue.bankDetails.branch,
          accountNumber: dynamicDataEditValue.bankDetails.accountNumber,
          accountHolder: dynamicDataEditValue.bankDetails.accountHolder,
        },
        contractEndDate: {
          date: contractEndDate.format("DD"),
          month: contractEndDate.format("MMMM"),
          year: contractEndDate.format("YYYY"),
        },
        signingLocation: dynamicDataEditValue.signingLocation,
        signingDate: moment().locale("id").format("DD MMMM YYYY"),
        regionalCourt: dynamicDataEditValue.regionalCourt,
      });
      setModalEdit(false);
    }
  }

  function exportPdf() {
    setLoadingExportPdf(true);
    exportToPdfUtil(
      template,
      dynamicContractData as any,
      "Business Partner Agreement",
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
                    {template.length > 1 && (
                      <Button
                        onClick={() => setModalEdit(true)}
                        className="flex items-center gap-1.5 px-4 py-1.5"
                      >
                        <UilPen className="w-5 -translate-y-0.5" />
                        Edit Values
                      </Button>
                    )}
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
                    <ContractViewer3
                      htmlTemplate={template}
                      data={dynamicContractData as ContractData}
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
        <Modal
          title={"Edit Contract Document Values"}
          open={modalEdit}
          onOk={() => handleSetDynamicDataUpdate()}
          onCancel={() => setModalEdit(false)}
          footer={[
            <Button
              type="default"
              key="cancel"
              className="mt-4"
              onClick={() => setModalEdit(false)}
            >
              Cancel
            </Button>,
            <Button
              type="primary"
              key="submit"
              disabled={loadingModal}
              onClick={handleSetDynamicDataUpdate}
              className="mt-4"
            >
              Update
            </Button>,
          ]}
        >
          <div className="flex flex-col gap-2 pt-4">
            <p className="w-full py-1.5 px-3 bg-red-50 border border-red-200 mb-4 rounded-md">
              The edited values are <strong>temporary</strong> and will{" "}
              <span className="text-red-950 font-bold">revert</span> to the
              default values if the page is closed or refreshed.
            </p>

            {/* Contract Number */}
            <label>
              <p>Contract Number : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.contractNumber || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      contractNumber: e.target.value,
                    },
                  )
                }
              />
            </label>

            {/* FIRST PARTY */}
            <h4 className="w-full mt-5 mb-1 pb-1.5 border-b border-gray-200">
              First Party
            </h4>
            <label>
              <p>Company Name : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.firstParty?.companyName || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      firstParty: {
                        ...dynamicDataEditValue.firstParty,
                        companyName: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Address : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.firstParty?.address || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      firstParty: {
                        ...dynamicDataEditValue.firstParty,
                        address: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Representative : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.firstParty?.representative || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      firstParty: {
                        ...dynamicDataEditValue.firstParty,
                        representative: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Position : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.firstParty?.position || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      firstParty: {
                        ...dynamicDataEditValue.firstParty,
                        position: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>

            {/* SECOND PARTY */}
            <h4 className="w-full mt-5 mb-1 pb-1.5 border-b border-gray-200">
              Second Party
            </h4>
            <label>
              <p>Company Name : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.secondParty?.companyName || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      secondParty: {
                        ...dynamicDataEditValue.secondParty,
                        companyName: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Address : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.secondParty?.address || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      secondParty: {
                        ...dynamicDataEditValue.secondParty,
                        address: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Representative : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.secondParty?.representative || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      secondParty: {
                        ...dynamicDataEditValue.secondParty,
                        representative: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Position : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.secondParty?.position || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      secondParty: {
                        ...dynamicDataEditValue.secondParty,
                        position: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>

            {/* PRICING */}
            <h4 className="w-full mt-5 mb-1 pb-1.5 border-b border-gray-200">
              Pricing
            </h4>
            {(
              [
                "registrationFee",
                "monitoringPerDevice",
                "perTicket",
                "onsiteInstallation",
                "onsiteRemoval",
                "onsiteRepair",
              ] as (keyof ContractData["pricing"])[]
            ).map((field) => (
              <label key={field}>
                <p>{field}</p>
                <input
                  type="text"
                  value={dynamicDataEditValue?.pricing?.[field] || ""}
                  className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                  onChange={(e) =>
                    setDynamicDataEditValue(
                      dynamicDataEditValue && {
                        ...dynamicDataEditValue,
                        pricing: {
                          ...dynamicDataEditValue?.pricing,
                          [field]: e.target.value,
                        },
                      },
                    )
                  }
                />
              </label>
            ))}

            {/* BANK DETAILS */}
            <h4 className="w-full mt-5 mb-1 pb-1.5 border-b border-gray-200">
              Bank Details
            </h4>
            <label>
              <p>Bank Name : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.bankDetails?.bankName || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      bankDetails: {
                        ...dynamicDataEditValue.bankDetails,
                        bankName: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Branch : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.bankDetails?.branch || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      bankDetails: {
                        ...dynamicDataEditValue.bankDetails,
                        branch: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Account Number : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.bankDetails?.accountNumber || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      bankDetails: {
                        ...dynamicDataEditValue.bankDetails,
                        accountNumber: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Account Holder : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.bankDetails?.accountHolder || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      bankDetails: {
                        ...dynamicDataEditValue.bankDetails,
                        accountHolder: e.target.value,
                      },
                    },
                  )
                }
              />
            </label>

            {/* OTHER FIELDS */}
            <h4 className="w-full mt-5 mb-1 pb-1.5 border-b border-gray-200">
              Other
            </h4>
            <label>
              <p>Signing Location : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.signingLocation || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      signingLocation: e.target.value,
                    },
                  )
                }
              />
            </label>
            <label>
              <p>Regional Court : </p>
              <input
                type="text"
                className="py-1.5 px-3 border border-gray-400 bg-gray-100 rounded-md w-full mt-0.5 mb-1"
                value={dynamicDataEditValue?.regionalCourt || ""}
                onChange={(e) =>
                  setDynamicDataEditValue(
                    dynamicDataEditValue && {
                      ...dynamicDataEditValue,
                      regionalCourt: e.target.value,
                    },
                  )
                }
              />
            </label>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default DetailBusinessContract;
