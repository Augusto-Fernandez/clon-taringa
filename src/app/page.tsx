import Link from "next/link";

import PostCard from "@/components/PostCard";
import { prisma } from "./lib/db/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {id: "desc"}
  })
  
  return (
    <main className="flex min-h-screen items-stretch justify-between p-5 bg-slate-300 mx-20 rounded-lg space-x-10">
      <div className="w-1/2 flex-grow">
        <div className="h-14">
          <Link href={"/createpost"}>
            <button className="btn text-base font-semibold glass w-1/4 bg-green-500 border border-green-300/80 text-white hover:bg-green-600">
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
