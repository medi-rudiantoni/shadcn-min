import Image from "next/image";
import React from "react";

type ContractViewerProps = {
  htmlTemplate: string;
  data: Record<string, any>;
  partnerType: "service" | "business";
};

function getValueByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}

function replacePlaceholders(template: string, data: Record<string, any>) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    const value = getValueByPath(data, key.trim());
    return value != null ? value : "";
  });
}

const ContractViewer: React.FC<ContractViewerProps> = ({
  htmlTemplate,
  data,
  partnerType,
}) => {
  const renderedHtml = replacePlaceholders(htmlTemplate, data);

  console.log("DATA: >> ", data);

  return (
    <>
      <div className="contract-viewer p-20 bg-white rounded shadow prose border-b border-dashed">
        <Image
          src={"/logo_rak.png"}
          width={500}
          height={500}
          alt=""
          className="w-52 mb-6"
        />
        <div className="w-full flex gap-5 mb-20">
          <div className="w-2/5">
            <p className="text-4xl uppercase">
              MOU Kerjasama {partnerType} partner service hub
            </p>
          </div>
          <div className="flex-1">
            <p className="mb-2">Prepared for</p>
            <p className="mb-8">{data?.secondParty?.companyName}</p>
            <p>
              {data?.secondParty?.address}
            </p>
          </div>
          <div className="flex-1">
            <p className="mb-2">Prepared by</p>
            <p className="mb-8">PT Rumah Aplikasi Kita</p>
            <a href="www.rak.co.id" target="_blank">
              www.rak.co.id
            </a>
            <p>
              Komplek Perumahan Bukit Cimanggu City, Cluster Greenwood Blok KA
              10/10 - BOGOR
            </p>
          </div>
        </div>
        <div className="w-full h-fit mb-20">
          <Image
            src={"/shapes.png"}
            width={1500}
            height={1500}
            alt=""
            className="w-full"
          />
        </div>
        <div className="w-full h-fit flex justify-end">
          <Image
            src={"/mou_footer.png"}
            width={500}
            height={500}
            alt=""
            className="w-[500px]"
          />
        </div>
      </div>
      <div className="contract-viewer p-20 bg-white rounded-t shadow prose">
        <Image
          src={"/logo_rak.png"}
          width={500}
          height={500}
          alt=""
          className="w-52"
        />
      </div>
      <div
        className="contract-viewer p-20 bg-white shadow prose"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
      <div className="contract-viewer p-20 flex justify-end bg-white rounded-b shadow prose">
        <Image
          src={"/mou_footer.png"}
          width={500}
          height={500}
          alt=""
          className="w-[500px]"
        />
      </div>
    </>
  );
};

export default ContractViewer;
