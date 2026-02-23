import { useEffect, useRef, useState } from "react";

interface A4PagesProps {
  htmlContent: string; // HTML dari Quill
}

export default function A4Pages({ htmlContent }: A4PagesProps) {
  const [pages, setPages] = useState<JSX.Element[]>([]);
  const tempRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!htmlContent) return;

    // Buat elemen temp untuk ukur tinggi konten
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.width = "170mm"; // 210mm - padding 20mm kiri & kanan
    tempDiv.style.visibility = "hidden";
    document.body.appendChild(tempDiv);

    const pageHeightPx = mmToPx(297) - mmToPx(20) * 2;
    const newPages: JSX.Element[] = [];
    let currentChildren: Node[] = [];
    let currentHeight = 0;

    tempDiv.childNodes.forEach((node) => {
      const clone = node.cloneNode(true) as HTMLElement;
      const testDiv = document.createElement("div");
      testDiv.append(...currentChildren, clone);
      testDiv.style.width = "170mm";
      document.body.appendChild(testDiv);

      const testHeight = testDiv.scrollHeight;
      document.body.removeChild(testDiv);

      if (testHeight > pageHeightPx) {
        newPages.push(createPage(currentChildren));
        currentChildren = [clone];
      } else {
        currentChildren.push(clone);
      }
    });

    if (currentChildren.length > 0) {
      newPages.push(createPage(currentChildren));
    }

    setPages(newPages);
    document.body.removeChild(tempDiv);
  }, [htmlContent]);

  function createPage(nodes: Node[]) {
    return (
      <div
        key={Math.random()}
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
        }}
        dangerouslySetInnerHTML={{
          __html: nodes
            .map((n) =>
              n instanceof Element ? n.outerHTML : n.textContent || ""
            )
            .join(""),
        }}
      />
    );
  }

  function mmToPx(mm: number) {
    return Math.round((mm * 96) / 25.4);
  }

  //   useEffect(() => {
  //     // console.log("PAGES: ", pages.map(p => p.props.dangerouslySetInnerHTML.__html).join(""));
  //     function setDoc(page: JSX.Element){
  //         const el = document.createElement("div");
  //         el.style = page.props.style;
  //         el.innerHTML = page.props.dangerouslySetInnerHTML.__html;
  //         return el
  //     }
  //     console.log("OUTPUT DIV: ", setDoc(pages[0]));

  //   }, [pages]);

  useEffect(() => {
    if (!pages.length) return;

    function styleObjToString(styleObj: React.CSSProperties) {
      return Object.entries(styleObj)
        .map(([key, value]) => {
          const kebabKey = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
          return `${kebabKey}:${value}`;
        })
        .join(";");
    }

    function setDoc(page: JSX.Element) {
      const html = `<div style="${styleObjToString(page.props.style)}">
      ${page.props.dangerouslySetInnerHTML.__html}
    </div>`;
      return html;
    }

    const allHtml = pages.map(setDoc).join("");
    console.log("OUTPUT HTML:", allHtml);
  }, [pages]);

  return <div>{pages}</div>;
}
