import { useEffect, useState } from "react";
import { Button } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { PageHeaders } from "@/components/page-headers";
import TinyMCEEditor from "@/components/custom/textEditor/TinyMCEEditor";
import {
  createMasterContract,
  getMasterContractBP,
  getMasterContractSP,
  updateMasterContract,
} from "@/functions/masterContract";

interface MasterContractResponse {
  _id: string;
  contractType: "BP" | "SP";
  contractName: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export default function EditMasterContract() {
  const token = Cookies.get("access_token");
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [content, setContent] = useState("");
  const [currentData, setCurrentData] = useState<MasterContractResponse | null>(
    null,
  );

  useEffect(() => {
    if (token) loadMasterContract();
  }, []);

  function loadMasterContract() {
    getMasterContractSP(token)
      .then((res) => {
        setCurrentData(res.data.contract);
        setContent(res.data.contract.content);
      })
      .catch((err) => {
        console.error("MASTER CONTRACTS ERROR: ", err);
      });
  }

  function handleSubmitUpdate() {
    setLoadingSubmit(true);
    const data = {
      contractType: currentData?.contractType,
      contractName: currentData?.contractName,
      content,
    };
    console.log("DATA UPDATE MASTER CONTRACT: ", data);
    updateMasterContract(currentData?._id, data, token)
      .then((res) => {
        console.log("UPDATE MASTER DATA SUCCESS: ", res);
        toast.success("Update Master Contract Success");
        router.back();
      })
      .catch((err) => {
        console.error("UPDATE MASTER CONTRACT FAILED: ", err);
        toast.error("Update Master Contract Failed");
      })
      .finally(() => setLoadingSubmit(false));
  }

  // function handlecreateMasterContract(){
  //   setLoadingSubmit(true);
  //   const data = {
  //     contractType: "SP",
  //     contractName: "Service Partner Contract",
  //     content
  //   }
  //   console.log("DATA CREATE CONTRACT: ", data);
  //   createMasterContract(data, token)
  //     .then((res) => {
  //       console.log("CREATE CONTRACT SUCCESS: ", res.data)
  //       toast.success("Create Contract Success")
  //     })
  //     .catch((error) => {
  //       console.error("ERROR CREATE CONTRACT: ", error);
  //       toast.error("Create Contract Failed")
  //     })
  //     .finally(() => setLoadingSubmit(false));
  // };

  const PageRoutes = [
    {
      path: "/admin",
      breadcrumbName: "Dashboard",
    },
    {
      path: "",
      breadcrumbName: "Contracts",
    },
    {
      path: "first",
      breadcrumbName: "Service Partner",
    },
  ];
  return (
    <>
      <PageHeaders
        routes={PageRoutes}
        title="Contract List"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-[18px] pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
        <TinyMCEEditor currentContent={content} result={setContent} />
      </div>
      <div className="w-full flex items-center justify-end gap-2 py-4 px-10">
        <Button onClick={() => router.back()} className="bg-white">
          Cancel
        </Button>
        <Button
          onClick={() => (loadingSubmit ? false : handleSubmitUpdate())}
          className="bg-blue-600 text-white"
        >
          {loadingSubmit ? "Loading" : "Save Changes"}
        </Button>
      </div>
    </>
  );
}
