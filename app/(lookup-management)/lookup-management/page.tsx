"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Database,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  accountMappingHooks,
  lookupKIPHooks,
  lookupAgentHooks,
  type AccountMappingRow,
  type LookupKIPRow,
  type LookupAgentRow,
} from "@/hooks/use-lookup-management";

// ─── Column definitions ───

interface ColumnDef<T> {
  key: keyof T;
  label: string;
  editable?: boolean;
  type?: "text" | "boolean";
}

const accountMappingColumns: ColumnDef<AccountMappingRow>[] = [
  { key: "b2b_account_id", label: "B2B Account ID", editable: true },
  { key: "corporateName", label: "Corporate Name", editable: true },
  { key: "kategoriAccount", label: "Kategori Account", editable: true },
  { key: "group", label: "Group", editable: true },
  { key: "divisi", label: "Divisi", editable: true },
  { key: "department", label: "Department", editable: true },
  { key: "mppCodeNew", label: "MPP Code New", editable: true },
  { key: "namaAM", label: "Nama AM", editable: true },
];

const lookupKIPColumns: ColumnDef<LookupKIPRow>[] = [
  { key: "category", label: "Category", editable: true },
  { key: "subCategory", label: "Sub Category", editable: true },
  { key: "detailCategoryFull", label: "Detail Category Full", editable: true },
  { key: "detailCategory", label: "Detail Category", editable: true },
  { key: "detailCategory2", label: "Detail Category 2", editable: true },
  { key: "compositeKeyOmnix", label: "Composite Key Omnix", editable: true },
  { key: "compositeKey", label: "Composite Key", editable: true },
  { key: "fcrNonSatuan", label: "FCR Non Satuan", editable: true },
  { key: "escToSatuan", label: "Esc To Satuan", editable: true },
  { key: "fcrNonMassal", label: "FCR Non Massal", editable: true },
  { key: "escToMassal", label: "Esc To Massal", editable: true },
  { key: "isFcr", label: "Is FCR", editable: true, type: "boolean" },
  { key: "product", label: "Product", editable: true },
];

const lookupAgentColumns: ColumnDef<LookupAgentRow>[] = [
  { key: "namaAgent", label: "Nama Agent", editable: true },
  { key: "group", label: "Group", editable: true },
];

// ─── Generic Editable Table ───

interface EditableTableProps<T extends { id: number }> {
  columns: ColumnDef<T>[];
  hooks: {
    useList: (params: { page?: number; limit?: number; search?: string }) => any;
    useCreate: () => any;
    useUpdate: () => any;
    useDelete: () => any;
  };
  defaultNewRow: Partial<T>;
}

function EditableTable<T extends { id: number }>({
  columns,
  hooks,
  defaultNewRow,
}: EditableTableProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<T>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Partial<T>>(defaultNewRow);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const limit = 25;
  const { data: result, isLoading } = hooks.useList({ page, limit, search });
  const createMutation = hooks.useCreate();
  const updateMutation = hooks.useUpdate();
  const deleteMutation = hooks.useDelete();

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const startEdit = (row: T) => {
    setEditingId(row.id);
    setEditData({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    try {
      await updateMutation.mutateAsync({ id: editingId, ...editData } as any);
      toast.success("Row updated successfully");
      setEditingId(null);
      setEditData({});
    } catch {
      toast.error("Failed to update row");
    }
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(newRowData as any);
      toast.success("Row created successfully");
      setIsAddDialogOpen(false);
      setNewRowData(defaultNewRow);
    } catch {
      toast.error("Failed to create row");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Row deleted successfully");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete row");
    }
  };

  const rows: T[] = result?.data ?? [];
  const meta = result?.meta ?? { total: 0, page: 1, lastPage: 1 };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full sm:w-64"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Row
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 dark:bg-slate-950/50">
              <TableHead className="w-12 text-xs">#</TableHead>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="text-xs whitespace-nowrap">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-24 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-8 text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {(meta.page - 1) * limit + idx + 1}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="text-xs">
                      {editingId === row.id && col.editable ? (
                        col.type === "boolean" ? (
                          <select
                            className="border rounded px-1 py-0.5 text-xs bg-background"
                            value={
                              editData[col.key] === true
                                ? "true"
                                : editData[col.key] === false
                                ? "false"
                                : ""
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [col.key]:
                                  e.target.value === ""
                                    ? null
                                    : e.target.value === "true",
                              })
                            }
                          >
                            <option value="">null</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : (
                          <Input
                            className="h-7 text-xs min-w-25"
                            value={(editData[col.key] as string) ?? ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [col.key]: e.target.value || null,
                              })
                            }
                          />
                        )
                      ) : col.type === "boolean" ? (
                        row[col.key] === true ? (
                          <span className="text-green-600 font-medium">true</span>
                        ) : row[col.key] === false ? (
                          <span className="text-red-600 font-medium">false</span>
                        ) : (
                          <span className="text-muted-foreground">null</span>
                        )
                      ) : (
                        <span className="whitespace-nowrap">
                          {(row[col.key] as any) ?? (
                            <span className="text-muted-foreground">null</span>
                          )}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    {editingId === row.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-600 hover:text-green-700"
                          onClick={saveEdit}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={cancelEdit}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => startEdit(row)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700"
                          onClick={() => setDeleteConfirmId(row.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {rows.length > 0 ? (meta.page - 1) * limit + 1 : 0}–
          {Math.min(meta.page * limit, meta.total)} of {meta.total}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-15 text-center">
            {meta.page} / {meta.lastPage}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= meta.lastPage}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Row</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {columns
              .filter((col) => col.editable)
              .map((col) => (
                <div key={String(col.key)} className="grid gap-1.5">
                  <label className="text-xs font-medium">{col.label}</label>
                  {col.type === "boolean" ? (
                    <select
                      className="border rounded px-2 py-1.5 text-sm bg-background"
                      value={
                        newRowData[col.key] === true
                          ? "true"
                          : newRowData[col.key] === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        setNewRowData({
                          ...newRowData,
                          [col.key]:
                            e.target.value === ""
                              ? null
                              : e.target.value === "true",
                        })
                      }
                    >
                      <option value="">null</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <Input
                      className="text-sm"
                      value={(newRowData[col.key] as string) ?? ""}
                      onChange={(e) =>
                        setNewRowData({
                          ...newRowData,
                          [col.key]: e.target.value || null,
                        })
                      }
                    />
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this row? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ───

export default function LookupManagementPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5" />
        <h1 className="text-xl font-semibold">Lookup Data Management</h1>
      </div>

      <Card className="dark:bg-slate-900">
        <CardContent className="pt-0">
          <Tabs defaultValue="account-mapping">
            <TabsList className="mb-4 dark:bg-slate-800">
              <TabsTrigger value="account-mapping">Account Mapping</TabsTrigger>
              <TabsTrigger value="lookup-kip">Lookup KIP</TabsTrigger>
              <TabsTrigger value="lookup-agent">Lookup Agent</TabsTrigger>
            </TabsList>

            <TabsContent value="account-mapping">
              <EditableTable<AccountMappingRow>
                columns={accountMappingColumns}
                hooks={accountMappingHooks}
                defaultNewRow={{ b2b_account_id: "" }}
              />
            </TabsContent>

            <TabsContent value="lookup-kip">
              <EditableTable<LookupKIPRow>
                columns={lookupKIPColumns}
                hooks={lookupKIPHooks}
                defaultNewRow={{}}
              />
            </TabsContent>

            <TabsContent value="lookup-agent">
              <EditableTable<LookupAgentRow>
                columns={lookupAgentColumns}
                hooks={lookupAgentHooks}
                defaultNewRow={{}}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
