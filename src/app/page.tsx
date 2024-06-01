import Link from "next/link";
import { redirect } from "next/navigation";

import PostCard from "@/components/PostCard";
import SelectCategoty from "@/components/SelectCategory";
import PaginationBar from "@/components/PaginationBar";
import SearchButton from "@/components/SearchButton";
import TopPostCard from "../components/TopPostCard";
import AdminPostCard from "@/components/AdminPostCard";

import { prisma } from "./lib/db/prisma";
import { Post } from "@prisma/client";

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

  const getAdmin = await prisma.user.findUnique({
    where:{
      userName: "admin"
    }
  });

  const adminPosts = await prisma.post.findMany({
    where:{
      userId: getAdmin?.id
    },
    orderBy: { id: "desc" },
    take: 3
  });

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

  const topPosts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    }
  });

  interface SortedPost extends Post {
    voteRatio: number;
  }

  const postsSortedByVotes:SortedPost[] = []

  await Promise.all(topPosts.map(async (post) => {
    const getVotes = await prisma.vote.findMany({
      where: {
        postId: post.id
      }
    })

    let likes = 0;
    let dislikes = 0;

    getVotes.forEach(vote => {
        if (getVotes.length > 0 && vote.type === 'UP') {
            likes++;
        } else if (getVotes.length > 0 && vote.type === 'DOWN') {
            dislikes++;
        }
    });

    postsSortedByVotes.push({...post, voteRatio: likes - dislikes});
  }));

  postsSortedByVotes.sort((a, b) => b.voteRatio - a.voteRatio);

  const top10Posts = postsSortedByVotes.slice(0, 10);
  
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
      <div className="w-1/4 rounded-md space-y-1">
        <div className="space-y-1">
          <p className="p-3 text-xl font-bold">Noticias</p>
          <div className="bg-red-800 h-52 rounded-md p-3">
            {
              adminPosts.map(post => (
                <AdminPostCard
                  key={post.id}
                  post={post}
                />
              ))
            }
          </div>
        </div>
        <div>
          <p className="p-3 text-xl font-bold">Top Posts</p>
          <div className="bg-red-800 h-[24.80rem] rounded-md p-3 space-y-1.5">
            {
              top10Posts.map(post => (
                <TopPostCard 
                  key={post.id}
                  post={post}
                  voteRatio={post.voteRatio}
                />
              ))
            }
          </div>
        </div>
      </div>
      <div className="bg-red-800 w-1/4 flex-grow rounded-md">

      </div>
    </main>
  );
}
