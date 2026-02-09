"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { NewsRenderer } from "@/components/news/NewsRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/hooks/use-news";
import { ArrowLeft } from "lucide-react";

export default function NewsDetailPage() {
  const { id } = useParams();
  const { article, isLoading } = useNews({}, id as string);

  if (isLoading) return <NewsDetailSkeleton />;
  if (!article) return <div>Article not found.</div>;

  return (
    <div className="container mx-auto py-10 max-w-4xl mt-8 md:mt-0">
      <ArrowLeft
        className="mb-4 cursor-pointer"
        onClick={() => window.history.back()}
      />
      <header className="mb-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {article.title}
        </h1>
        <div className="flex items-center text-muted-foreground gap-4 border-b pb-4">
          <p className="font-medium">By {article.authorName}</p>
          <span>•</span>
          <p>{format(new Date(article.createdAt), "MMMM d, yyyy HH:mm")}</p>
        </div>
      </header>

      {/* This is where the rich content (tables, images, text) is rendered */}
      <NewsRenderer content={article.content} />
    </div>
  );
}

function NewsDetailSkeleton() {
  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-4">
      <Skeleton className="h-12 w-[80%]" />
      <Skeleton className="h-4 w-[40%]" />
      <div className="pt-10 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
