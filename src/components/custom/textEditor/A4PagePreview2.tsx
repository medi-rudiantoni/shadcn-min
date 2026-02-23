import { useEffect, useState } from "react";

interface A4PagesProps {
  htmlContent: string; // HTML dari Quill
}

export default function A4Pages2({ htmlContent }: A4PagesProps) {
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    if (!htmlContent) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.width = "170mm"; // 210mm - padding 20mm kiri kanan
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);

    const pageHeightPx = mmToPx(297) - mmToPx(20) * 2; // tinggi konten saja
    const newPages: string[] = [];
    let currentChildren: Node[] = [];

    tempDiv.childNodes.forEach((node) => {
      const clone = node.cloneNode(true);
      const testDiv = document.createElement("div");
      testDiv.append(...currentChildren, clone);
      testDiv.style.width = "170mm";
      document.body.appendChild(testDiv);

      const testHeight = testDiv.scrollHeight;
      document.body.removeChild(testDiv);

      if (testHeight > pageHeightPx) {
        newPages.push(nodesToHTML(currentChildren));
        currentChildren = [clone];
      } else {
        currentChildren.push(clone);
      }
    });

    if (currentChildren.length > 0) {
      newPages.push(nodesToHTML(currentChildren));
    }

    setPages(newPages);
    document.body.removeChild(tempDiv);

    // Debug: lihat HTML final di console
    const htmlOutput = newPages
      .map(
        (content) =>
          `<div style="${pageStyle()} display:flex;flex-direction:column;justify-content:space-between;">
             <div>${content}</div>
             <div style="height:0;flex:1;"></div>
           </div>`
      )
      .join("\n");

    console.log(htmlOutput);
  }, [htmlContent]);

  function nodesToHTML(nodes: Node[]) {
    return nodes
      .map((n) => (n instanceof Element ? n.outerHTML : n.textContent || ""))
      .join("");
  }

  function pageStyle() {
    return [
      "width:210mm",
      "height:297mm",
      "padding:20mm",
      "background:white",
      "margin:10px auto",
      "box-shadow:0 0 5px rgba(0,0,0,0.2)",
      "box-sizing:border-box",
      "overflow:hidden",
      "page-break-after:always",
    ].join(";");
  }

  function mmToPx(mm: number) {
    return Math.round((mm * 96) / 25.4);
  }

  return (
    <div>
      {pages.map((content, i) => (
        <div
          key={i}
          style={{
            width: "210mm",
            height: "297mm",
            padding: "20mm",
            background: "white",
            margin: "10px auto",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            boxSizing: "border-box",
            overflow: "hidden",
            pageBreakAfter: "always",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <div style={{ height: 0, flex: 1 }} />
        </div>
      ))}
    </div>
  );
}
