import { Metadata } from "next";

import { prisma } from "../lib/db/prisma";
import { Post } from "@prisma/client";

import PostCard from "@/components/PostCard";

interface SavesPageProps {
    searchParams: {query: string};
}

export function generateMetadata({searchParams: { query }}: SavesPageProps): Metadata {
    return { 
        title: `${query} - Taringa?`,
    };
}

export default async function SavesPage({searchParams: { query }}: SavesPageProps) {   
    const user = await prisma.user.findUnique({
        where: {
            userName: query
        }
    });

    const saves = await prisma.savedPost.findMany({
        where: {
            userId: user?.id
        }
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
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="pt-10 pl-10 flex">
                    <h1 className="text-slate-600 font-semibold text-4xl">Posts guardados</h1>
                </div>
                <div className="bg-red-800 min-h-lvh max-h-lvh rounded-md m-10 p-3">
                    {savedPostsArray.length === 0 ? (
                        <div className="w-full flex justify-center">
                            <p className="p-10 text-5xl font-semibold">No hay posts guardados</p>
                        </div>
                    ) : (
                        savedPostsArray.map(post => (
                            <PostCard post={post} key={post.id}/>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
