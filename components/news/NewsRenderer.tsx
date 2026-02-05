// components/news/NewsRenderer.tsx
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export function NewsRenderer({ content }: { content: any }) {
  // Convert JSON to HTML
  const output = useMemo(() => {
    if (!content) return "";

    let html = generateHTML(content, [
      StarterKit,
      Image,
      Table,
      TableRow,
      TableHeader,
      TableCell,
    ]);

    // Clean up the weird XML namespace attributes that prevent rendering
    return html.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, "");
  }, [content]);

  // 3. Extract PDF links from the JSON structure to display them as embeds
  const pdfFiles = useMemo(() => {
    if (!content || !content.content) return [];

    const files: { url: string; name: string }[] = [];

    // Recursively find links that end in .pdf
    const findPdfs = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.marks) {
          const link = node.marks.find(
            (m: any) => m.type === "link" && m.attrs?.href?.endsWith(".pdf"),
          );
          if (link) {
            files.push({ url: link.attrs.href, name: node.text || "Document" });
          }
        }
        if (node.content) findPdfs(node.content);
      });
    };

    findPdfs(content.content);
    return files;
  }, [content]);

  return (
    <div className="space-y-8">
      {/* Main Content */}
      <div
        className="prose prose-slate dark:prose-invert max-w-none text-slate-300"
        dangerouslySetInnerHTML={{ __html: output }}
      />

      {/* Embedded PDF Viewers */}
      {pdfFiles.length > 0 && (
        <div className="space-y-6 border-t pt-8">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            📄 Attached Documents
          </h3>
          {pdfFiles.map((pdf, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card overflow-hidden"
            >
              <div className="bg-muted p-2 text-slate-700 text-sm font-medium border-b flex justify-between items-center">
                <span>{pdf.name}</span>
                <a
                  href={pdf.url}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Open in New Tab
                </a>
              </div>
              <iframe
                src={`${pdf.url}#toolbar=0`} // #toolbar=0 hides the sidebar in some browsers
                className="w-full h-[600px]"
                title={pdf.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
