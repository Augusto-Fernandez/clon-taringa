import Link from "next/link";
import { redirect } from "next/navigation";

import PostCard from "@/components/PostCard";
import SelectCategoty from "@/components/SelectCategory";
import PaginationBar from "@/components/PaginationBar";
import SearchButton from "@/components/SearchButton";

import { prisma } from "./lib/db/prisma";

async function sortPosts(formData:FormData) {
  "use server";

  const categoryQuery = formData.get("categoria")?.toString();

  if (categoryQuery) {
     redirect("/sortedposts?query=" + categoryQuery);
  }
}

interface HomeProps{
  searchParams: {page: string};
}

export default async function Home({searchParams:{page = "1"}}: HomeProps) {
  const currentPage = parseInt(page);
  const pageSize = 10;
  const totalPostCount = await prisma.post.count();
  const totalPages = Math.ceil(totalPostCount/pageSize)
  
  const posts = await prisma.post.findMany({
    orderBy: {id: "desc"},
    skip: (currentPage-1)*pageSize,
    take: pageSize,
  })
  
  return (
    <main className="flex min-h-screen items-stretch justify-between p-5 bg-slate-300 mx-20 rounded-lg space-x-10">
      <div className="w-1/2 flex-grow">
        <div className="h-14 flex justify-between">
          <form action={sortPosts}>
            <div className="flex space-x-16">
              <p className="p-3 text-xl font-bold">Posts</p>
              <div className="flex items-center space-x-1">
                <SelectCategoty/>
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
        <div className="bg-red-800 min-h-lvh max-h-lvh p-3 rounded-md">
          {
            posts.map(post => (
              <PostCard post={post} key={post.id}/>
            ))
          }
        </div>
        <div className="h-10">
          {
            totalPages>1 && (
              <PaginationBar currentPage={currentPage} totalPages={totalPages}/>
            )
          }
        </div>
      </div>
      <div className="w-1/4 flex-grow rounded-md space-y-10">
        <div className="bg-red-800 h-96 flex-grow rounded-md">

        </div>
        <div className="bg-red-800 h-96 flex-grow rounded-md">

        </div>
      </div>
      <div className="bg-red-800 w-1/4 flex-grow rounded-md">

      </div>
    </main>
  );
}
