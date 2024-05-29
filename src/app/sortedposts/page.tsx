import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import PostCard from "@/components/PostCard";
import SelectCategoty from "@/components/SelectCategory";
import PaginationBar from "@/components/PaginationBar";
import SearchButton from "@/components/SearchButton";

import { prisma } from "../lib/db/prisma";

interface SortPostsProps {
  searchParams: { query: string, page: string };
}

export function generateMetadata({searchParams: { query }}: SortPostsProps): Metadata {
  return { 
    title: `Categoria ${query} - Taringa`,
  };
}

async function sortPosts(formData:FormData) {
  "use server";

  const categoryQuery = formData.get("categoria")?.toString();

  if (categoryQuery) {
     redirect("/sortedposts?query=" + categoryQuery);
  }
}

export default async function SortedPosts({searchParams: { query, page = "1" }}: SortPostsProps) {
  const currentPage = parseInt(page);
  const pageSize = 10;
  const totalPostCount = await prisma.post.count();
  const totalPages = Math.ceil(totalPostCount/pageSize);
  
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { category: { contains: query, mode: "insensitive" } }
      ],
    },
    orderBy: { id: "desc" },
    skip: (currentPage-1)*pageSize,
    take: pageSize,
  });
  
  return (
    <main className="flex min-h-screen items-stretch justify-between p-5 bg-slate-300 mx-20 rounded-lg space-x-10">
      <div className="w-1/2 flex-grow">
        <div className="h-14 flex justify-between">
          <form action={sortPosts}>
            <div className="flex space-x-16">
              <p className="p-3 text-xl font-bold">Posts</p>
              <div className="flex items-center space-x-1">
                <SelectCategoty
                  className="dropdown z-[1] menu p-2 shadow bg-slate-200 w-52 rounded"
                />
                <SearchButton/>
              </div>
            </div>
          </form>
          <Link href={"/createpost"}>
              <button className="btn text-base font-semibold glass bg-green-500 border border-green-300/80 text-white hover:bg-green-600">
                  + Crear Post
              </button>
          </Link>
        </div>
        <div className="bg-red-800 h-[41.25rem] p-3 rounded-md">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard post={post} key={post.id}/>
            ))
            ) : (
              <p className="p-10 text-3xl font-semibold">Aún no hay posts en esta categoria</p>
            )}
        </div>
        <div className="h-10 flex justify-center mt-2">
          {
            totalPages>1 ? (
              <PaginationBar 
                currentPage={currentPage} 
                totalPages={totalPages}
              />
            ) : (
              <div className="join-item btn">1</div>
            )
          }
        </div>
      </div>
      <div className="w-1/4 rounded-md space-y-5">
        <div className="space-y-1">
          <p className="p-3 text-xl font-bold">Noticias</p>
          <div className="bg-red-800 h-40 rounded-md">

          </div>
        </div>
        <div>
          <p className="p-3 text-xl font-bold">Top Posts</p>
          <div className="bg-red-800 h-[26.75rem] rounded-md">

          </div>
        </div>
      </div>
      <div className="bg-red-800 w-1/4 flex-grow rounded-md">

      </div>
    </main>
  );
}
