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
                <SelectCategoty
                  className="dropdown z-[1] menu p-2 shadow bg-slate-200 w-52 rounded"
                />
                <SearchButton
                  className="btn-ghost h-[2rem] w-[2rem] bg-green-500 rounded-lg hover:bg-green-400"
                  svgSize="w-6 h-6"
                />
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
          {
            posts.map(post => (
              <PostCard post={post} key={post.id}/>
            ))
          }
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
