"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNews } from "@/hooks/use-news";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function NewsForm({
  initialData,
  onSubmit,
}: {
  initialData?: any;
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.authorName || "");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const { uploadFile } = useNews();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialData?.content || "<p>Start writing...</p>",
    immediatelyRender: false,
  });

  const handleInsertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
      .focus()
      .run();
  };

  const handleFileUpload = async (file: File, type: "image" | "pdf") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Hit the API
      const data = await uploadFile(file);

      // 2. Build the correct URL.
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${data.url}`;

      if (type === "image") {
        editor?.chain().focus().setImage({ src: fullUrl }).run();
      } else {
        editor
          ?.chain()
          .focus()
          .setLink({ href: fullUrl })
          .insertContent(`📄 View PDF: ${data.name}`)
          .run();
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const saveNews = () => {
    const contentJson = editor?.getJSON();
    const summary = editor?.getText().slice(0, 150) + "..."; // Quick preview

    onSubmit({ title, authorName: author, content: contentJson, summary });
  };

  const isInTable = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isActive("table"),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="News Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* Editor Toolbar */}
      <div className="flex flex-col md:flex-row rounded-md bg-muted border p-2">
      <div className="flex gap-2">
        {/* Table Dimension Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Insert Table
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs">Rows</span>
                <Input
                  type="number"
                  className="h-7 w-16"
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs">Cols</span>
                <Input
                  type="number"
                  className="h-7 w-16"
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                />
              </div>
              <Button
                className="w-full h-7 text-xs"
                onClick={handleInsertTable}
              >
                Create
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <input
          type="file"
          id="img-up"
          hidden
          onChange={(e) => handleFileUpload(e.target.files![0], "image")}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("img-up")?.click()}
        >
          Add Image
        </Button>
        <input
          type="file"
          id="pdf-up"
          hidden
          onChange={(e) => handleFileUpload(e.target.files![0], "pdf")}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("pdf-up")?.click()}
        >
          Add PDF
        </Button>
        </div>
        {/* Add this inside your Editor Toolbar in NewsForm.tsx */}
        {isInTable && (
          <div className="flex md:gap-1 md:border-l md:ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
            >
              + Col
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => editor?.chain().focus().deleteColumn().run()}
            >
              - Col
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().addRowAfter().run()}
            >
              + Row
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => editor?.chain().focus().deleteRow().run()}
            >
              - Row
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => editor?.chain().focus().deleteTable().run()}
            >
              Del Table
            </Button>
          </div>
        )}
      </div>

      <div className="tiptap-editor border rounded-md p-4 max-w-xs sm:max-w-7xl w-full min-h-[300px] bg-background">
        <EditorContent editor={editor} />
      </div>

      <Button onClick={saveNews}>Save News Article</Button>
    </div>
  );
}
