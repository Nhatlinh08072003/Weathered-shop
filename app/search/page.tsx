// app/search/page.tsx
import { Suspense } from "react";
import SearchContent from "@/components/SearchContent"; // Updated to point to root SearchContent.tsx

// Dynamic metadata based on search query
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q = "" } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q; // Handle array case
  return {
    title: `WEATHERED | Search: ${query}`,
    description: `Search results for "${query}" at WEATHERED`,
    keywords: `search, ${query}, fashion, luxury, vintage, weathered`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q = "" } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q; // Handle array case
  return (
    <Suspense
      fallback={
        <div className="bg-white py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
                SEARCH
              </span>
              <h2 className="text-4xl md:text-5xl text-black font-bold mb-4">Loading...</h2>
              <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse group">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
                  <div className="mt-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent searchQuery={query} />
    </Suspense>
  );
}