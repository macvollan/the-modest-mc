import type { Metadata } from "next";
import { Suspense } from "react";
import {
  GALLERY_CATEGORIES,
  findCategoryBySlug,
} from "@/lib/gallery-categories";
import CategoryGalleryClient from "./CategoryGalleryClient";

export async function generateStaticParams() {
  return GALLERY_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const def = findCategoryBySlug(category) || GALLERY_CATEGORIES[0];
  return {
    title: `${def.title} Photos & Videos`,
    description: def.description,
    alternates: {
      canonical: `https://themodestmcevents.co.ke/gallery/${def.slug}`,
    },
  };
}

async function CategoryGalleryResolver({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryGalleryClient slug={category} />;
}

export default function CategoryGalleryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060D1E] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#E5A827] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CategoryGalleryResolver params={params} />
    </Suspense>
  );
}
