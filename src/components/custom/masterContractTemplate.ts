export interface Cover {
  companyName: string;
  tagLine?: string;
  website?: string;
  address: string;
}

interface Props {
  content: string;
  shapesSrc: string;
  partnerType: "service" | "business";
  preparedFor: Cover;
}

export function generateMasterContractHTML({
  content,
  shapesSrc,
  partnerType,
  preparedFor,
}: Props) {
  return `
  <html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
      @page {
        size: A4;
        margin: 120px 60px 100px 60px;
      }

      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
      }

      /* Cover page */
      .cover {
        page-break-after: always;
        /* text-align: center; */
      }

      .cover img {
        width: 100%;
      }

      .page-number:after {
        content: counter(page);
      }
      
      table {
        font-size: 14px;
      }
      
      td {
        vertical-align: top;
      }
      
      ul {
        list-style: disc;
        padding-left: 1.25rem;
      }
      
      ol {
        list-style: decimal;
        padding-left: 1.25rem;
      }
    </style>
  </head>
  <body>
    <!-- COVER -->
    <div class="cover">
      <div class="mb-20">
        <div class="flex gap-5">
          <div class="w-2/5">
            <h1 class="text-4xl">MOU KERJASAMA ${partnerType === "service" ? "SERVICE" : "BUSINESS"} PARTNER SERVICEHUB</h1>
          </div>
          <div class="flex-1 text-xs">
            <p class="mb-2">Prepared for</p>
            <p class="mb-4">
              ${preparedFor.companyName}
              ${preparedFor.tagLine ? "<br />" + preparedFor.tagLine : ""}
            </p>
            <p>
              ${preparedFor.website ? preparedFor.website + " <br />" : ""} ${preparedFor.address}
            </p>
          </div>
          <div class="flex-1 text-xs">
            <p class="mb-2">Prepared by</p>
            <p class="mb-4">
              Rumah Aplikasi Kita <br />
              Smart Digital Solutions
            </p>
            <p>
              Komplek Perumahan Bukit Cimanggu City, Cluster Greenwood Blok KA
              10/10 - BOGOR
            </p>
          </div>
        </div>
      </div>
      <div>
        <img src="${shapesSrc}" class="w-full object-contain scale-110" />
      </div>
    </div>

    <!-- CONTENT -->
    <div>${content}</div>
  </body>
</html>
  `;
}
