// components/TinyMCEEditor.tsx
"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  currentContent: string;
  result: (value: string) => void;
}

export default function TinyMCEEditor({ currentContent, result }: Props) {
  const editorRef = useRef<any>(null);

  return (
    <div>
      <Editor
        apiKey="dlorsqyerm8b8769tmqe56s4um562blhiu95er3k7fsuif2w"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        onEditorChange={() => result(editorRef.current.getContent())}
        value={currentContent}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table code help wordcount",
            "table",
            "lineheight",
            "lists",
            "pagebreak"
          ],
          pagebreak_separator: '<div class="page-break"></div>',
          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " + " | lineheight | bullist numlist alphlist romanlist outdent indent | removeformat | pagebreak | table | help | ",
          content_style:
            `body { font-family:Helvetica,Arial,sans-serif; font-size:14px } .page-break { page-break-before: always; break-before: page; }`,
          setup: function (editor) {
            editor.ui.registry.addButton('alphlist', {
                text: 'a, b, c',
                onAction: function (){
                    editor.execCommand('InsertOrderedList', false, {
                        'list-style-type': 'lower-alpha'
                    });
                }
            });
            editor.ui.registry.addButton('romanlist', {
                text: 'i, ii, iii',
                onAction: function () {
                    editor.execCommand('InsertOrderedList', false, {
                        'list-style-type': 'lower-roman'
                    });
                }
            })
          }
        }}
      />
    </div>
  );
}
