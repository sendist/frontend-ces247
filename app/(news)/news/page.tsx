"use client";

import { useEffect, useState } from "react";
import { NewsForm } from "@/components/news/NewsForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
  Trash2,
  User2,
} from "lucide-react";
import { useNews } from "@/hooks/use-news";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import React from "react";
import { cn } from "@/lib/utils";

export default function NewsPage({ isAdmin }: { isAdmin: boolean }) {
  const { user } = useAuth(true);
  const [input, setInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { news, meta, createNews, updateNews, deleteNews, isLoading } = useNews(
    {
      page,
      limit: 10,
      search: debouncedSearch,
    },
  );
  const totalPages = meta ? meta.lastPage : 1;
  const currentPage = meta ? meta.page : 1;

  // --- 1. Smart Pagination Logic ---
  const getPaginationItems = () => {
    const items: (number | string)[] = [];

    // Always show fewer items on mobile (optional tweak)
    const siblingCount = 1;

    // Case: Total pages are small (<= 7), just show them all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first page
    items.push(1);

    // Calculate start and end of "window" around current page
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add left ellipsis if needed
    if (startPage > 2) {
      items.push("..."); // represent gap
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add right ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push("..."); // represent gap
    }

    // Always include last page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleSubmit = async (payload: any) => {
    if (selectedNews) {
      await updateNews({ id: selectedNews.id, ...payload });
    } else {
      await createNews(payload);
    }
    setIsDialogOpen(false);
    setSelectedNews(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  // 3. Debounce Logic: Wait 500ms after typing stops before updating query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const router = useRouter();

  return (
    <div className="p-6 space-y-6 text-white mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <h1 className="text-3xl font-bold">Latest News</h1>

        <div className="flex w-full mt-4 md:w-auto items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8 bg-slate-900 border-slate-700"
              value={input}
              onChange={handleSearch}
            />
          </div>

          {user?.role === "ADMIN" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white transition-all"
                  onClick={() => setSelectedNews(null)}
                >
                  <Plus className="mr-1 h-4 w-4" /> Create News
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-sm sm:max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedNews ? "Edit News" : "Create News"}
                  </DialogTitle>
                </DialogHeader>
                <NewsForm initialData={selectedNews} onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2">
        {news.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                {item.title}
              </CardTitle>
              <div className="flex flex-row space-x-4">
                <div className="flex flex-row items-center">
                  <User2 className="mr-1 h-3 w-3" />
                  <p className="text-sm text-muted-foreground">
                    Posted By: {item.authorName}
                  </p>
                </div>
                <div className="flex flex-row items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <p className="text-sm text-muted-foreground">
                    {format(item.createdAt, "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full justify-between">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.summary}
              </p>

              <div className="mt-4 flex gap-2">
                {user?.role === "ADMIN" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedNews(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteNews(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/news/${item.id}`)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      {meta && (
        <div className="mt-6 flex items-center justify-center gap-2 select-none">
          <span className="text-sm font-bold text-slate-200 mr-2">Page</span>

          {/* Loop through the Smart Pagination Items */}
          {getPaginationItems().map((item, index) => (
            <React.Fragment key={index}>
              {item === "..." ? (
                // Render Ellipsis
                <span className="px-2 text-slate-400 text-xs">...</span>
              ) : (
                // Render Page Button
                <Button
                  size="sm"
                  onClick={() => setPage(item as number)}
                  className={cn(
                    "h-7 w-7 rounded-none p-0 text-xs transition-colors",
                    currentPage === item
                      ? "bg-[#C20000] text-white hover:bg-[#a00000]"
                      : "bg-gray-300 text-slate-600 hover:bg-gray-400",
                  )}
                >
                  {item}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Navigation Arrows */}
          <div className="flex gap-1 ml-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-full border-2 border-slate-800 p-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4 text-slate-800" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="h-7 w-7 rounded-full border-2 border-slate-800 p-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4 text-slate-800" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
