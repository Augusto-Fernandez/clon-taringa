import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import PostCard from "@/components/PostCard";
import SelectCategoty from "@/components/SelectCategory";

import { prisma } from "../lib/db/prisma";

interface SortPostsProps {
  searchParams: { query: string };
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

export default async function SortedPosts({searchParams: { query }}: SortPostsProps) {
  const posts = await prisma.post.findMany({
    where: {
        OR: [
            { category: { contains: query, mode: "insensitive" } }
        ],
    },
    orderBy: { id: "desc" }
  });
  
  return (
    <main className="flex min-h-screen items-stretch justify-between p-5 bg-slate-300 mx-20 rounded-lg space-x-10">
      <div className="w-1/2 flex-grow">
        <div className="h-14 flex justify-between">
          <form action={sortPosts}>
            <div className="flex space-x-16">
              <p className="p-3 text-xl font-bold">Posts</p>
              <div className="flex">
                <SelectCategoty/>
                <button type="submit" className="btn">
                  O
                </button>
              </div>
            </div>
          </form>
          <Link href={"/createpost"}>
              <button className="btn text-base font-semibold glass bg-green-500 border border-green-300/80 text-white hover:bg-green-600">
                  + Crear Post
              </button>
          </Link>
        </div>
        <div className="bg-red-800 p-3 space-y-3 rounded-md">
          {
            posts.map(post => (
              <PostCard post={post} key={post.id}/>
            ))
          }
        </div>
        <div className="h-10">
          <p>Boton para cambiar pagina</p>
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
