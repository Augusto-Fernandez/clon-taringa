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
    
    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    });

    if(!userLogged){
        return(
            <div>
                <p>Acceso no autorizado, por favor iniciar sesión</p>
            </div>
        );
    }

    const currentPage = parseInt(page);
    const pageSize = 10;
    
    const saves = await prisma.savedPost.findMany({
        where: {
            userId: userLogged.id
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
            userId: userLogged.id
        }
    });
    
    const totalPages = Math.ceil(totalSavedCount/pageSize);
    
    return(
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-screen flex justify-center">
                <div className=" min-h-screen w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="pt-10 pl-10 flex">
                        <h1 className="text-slate-700/90 font-semibold text-3xl">Posts guardados</h1>
                    </div>
                    <div className="bg-slate-400/10 h-[41.25rem] rounded-md mx-10 mt-10 mb-2 p-3">
                        {savedPostsArray.length > 0 ? (
                            savedPostsArray.map(post => (
                                <PostCard post={post} key={post.id}/>
                            ))
                        ) : (
                            <div className="w-full flex justify-center">
                                <p className="p-10 text-5xl text-slate-700/90 font-semibold">No hay posts guardados</p>
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
        </main>
    );
}
