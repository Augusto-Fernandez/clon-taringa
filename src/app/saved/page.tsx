import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

import { prisma } from "../lib/db/prisma";
import { Post } from "@prisma/client";

import PostCard from "@/components/PostCard";
import PaginationBar from "@/components/PaginationBar";

interface SavedPageProps{
    searchParams: {page: string};
}

export const metadata = {
    title: "Saved Posts"
}

export default async function SavesPage({searchParams:{page = "1"}}: SavedPageProps) {   
    const session = await getServerSession(authOptions);
    
    const user = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    });

    const currentPage = parseInt(page);
    const pageSize = 10;
    
    const saves = await prisma.savedPost.findMany({
        where: {
            userId: user?.id
        },
        orderBy: { id: "desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    })

    const savedPostsArray: Post[] = []

    await Promise.all(saves.map(async (save) => {
        const savedPosts = await prisma.post.findMany({
            where: {
                id: save.postId
            }
        });
    
        if (savedPosts.length > 0) {
            savedPostsArray.push(...savedPosts);
        }
    }));

    const totalSavedCount = await prisma.savedPost.count({
        where: {
            userId: user?.id
        }
    });
    
    const totalPages = Math.ceil(totalSavedCount/pageSize);
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Posts guardados</h1>
                </div>
                <div className="bg-red-800 h-[41.25rem] rounded-md mx-10 mt-10 mb-2 p-3">
                    {savedPostsArray.length > 0 ? (
                        savedPostsArray.map(post => (
                            <PostCard post={post} key={post.id}/>
                        ))
                    ) : (
                        <div className="w-full flex justify-center">
                            <p className="p-10 text-5xl font-semibold">No hay posts guardados</p>
                        </div>
                    )}
                </div>
                <div className="h-14 flex justify-center">
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
        </div>
    );
}
