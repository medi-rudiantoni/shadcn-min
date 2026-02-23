import React from "react";

type ContractViewer3Props = {
  htmlTemplate: string;
  data: Record<string, any>;
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

const ContractViewer3: React.FC<ContractViewer3Props> = ({ htmlTemplate, data }) => {
  const renderedHtml = replacePlaceholders(htmlTemplate, data);

  return (
    <div
      className="contract-viewer p-6 bg-white rounded shadow prose"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default ContractViewer3;
