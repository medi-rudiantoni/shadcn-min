import { useEffect, useState } from "react";
import { Button } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { PageHeaders } from "@/components/page-headers";
import TinyMCEEditor from "@/components/custom/textEditor/TinyMCEEditor";
import { createMasterContract } from "@/functions/masterContract";

export default function CreateMasterContract() {
  const token = Cookies.get("access_token");
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [content, setContent] = useState("");

  function handlecreateMasterContract() {
    setLoadingSubmit(true);
    const data = {
      contractType: "SP",
      contractName: "Service Partner Contract",
      content,
    };
    console.log("DATA CREATE CONTRACT: ", data);
    createMasterContract(data, token)
      .then((res) => {
        console.log("CREATE CONTRACT SUCCESS: ", res.data);
        toast.success("Create Contract Success");
        router.back();
      })
      .catch((error) => {
        console.error("ERROR CREATE CONTRACT: ", error);
        toast.error("Create Contract Failed");
      })
      .finally(() => setLoadingSubmit(false));
  }

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
      breadcrumbName: "Business Partner",
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
          onClick={() => (loadingSubmit ? false : handlecreateMasterContract())}
          className="bg-blue-600 text-white"
        >
          {loadingSubmit ? "Loading" : "Submit"}
        </Button>
      </div>
    </>
  );
}
