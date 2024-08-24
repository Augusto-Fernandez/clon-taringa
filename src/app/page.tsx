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

  const top10Posts = postsSortedByVotes.slice(0, 5);
  
  return (
    <main className="bg-gradient-to-r from-purple-200 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
      <div 
        className="
          min-h-screen items-stretch justify-between bg-slate-300/50 p-5 mx-20 rounded-lg
          lg:flex lg:space-x-10
        "
      >
        <div 
          className="
            flex-grow
            lg:w-1/2
          "
        >
          <form action={sortPosts}>
            <div 
              className="
                h-32
                md:flex md:justify-between md:h-14
              "
            >
              <p className="p-3 text-xl text-slate-700/90 font-bold">Posts</p>
              <div className="flex items-center space-x-1">
                <SelectCategoty
                  className="dropdown z-[1] menu p-2 shadow bg-slate-200/[.20] w-52 rounded text-slate-700/90"
                />
                <SearchButton
                  className="btn-ghost h-[2rem] w-[2rem] bg-green-500/50 rounded-lg hover:bg-green-600/50"
                  svgSize="w-6 h-6"
                />
              </div>
              <Link href={"/createpost"}>
                <button 
                  className="
                    h-8 text-xs glass rounded-md bg-green-500/65 border border-green-300/80 text-white hover:bg-green-600
                    xs:w-24 xs:mt-2
                    md:mt-3 md:h-8
                    lg:text-sm lg:font-semibold lg:h-10 lg:mt-1
                  "
                >
                  + Crear Post
                </button>
              </Link>
            </div>
          </form>
          <div 
            className="
              bg-slate-400/[.10] min-h-[41.25rem] p-3 rounded-md
              md:min-w-[35rem] md:max-w-[49rem]
              lg:min-w-[27rem]
            "
          >
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
                  <div className="bg-slate-300/25 text-slate-500 border border-slate-400 hover:bg-slate-400/25 join-item btn">1</div>
                )
            }
          </div>
        </div>
        <div 
          className="
            rounded-md
            lg:w-1/4 lg:space-y-1
          "
        >
          <div className="space-y-1">
            <p className="p-3 text-xl text-slate-700/90 font-bold">Noticias</p>
            <div className="bg-slate-400/[.10] h-52 rounded-md p-3">
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
            <p className="p-3 text-xl text-slate-700/90 font-bold">Top Posts</p>
            <div className="bg-slate-400/[.10] h-[24.80rem] rounded-md p-3 space-y-1.5">
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
        <div 
          className="
            w-1/4 flex-grow rounded-md hidden bg-white
            lg:flex lg:items-center lg:justify-center
          "
        >
          <p className="text-xs">Acá iría la publicidad</p>
        </div>
      </div>
    </main>
  );
}
