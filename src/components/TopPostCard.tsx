import Link from "next/link";
import { Post } from "@prisma/client";

import { prisma } from "@/app/lib/db/prisma";

interface TopPostProps {
    post: Post; 
    voteRatio: number;
}

export default async function TopPostCard({post, voteRatio}:TopPostProps) {
    const author = await prisma.user.findUnique({
        where: {
            id: post.userId
        }
    });
    
    return (
        <Link href={"/post/" + post.id} className="bg-slate-300 h-[4.3rem] rounded flex">
            <div className="w-14"></div>
            <div className="p-1 flex flex-col">
                <span className="font-medium text-xs">{post.title}</span>
                <div className="space-x-2">
                    <span className="text-xs text-blue-600">{author?.userName}</span>
                    {
                        post.nsfw && !author?.isAdmin && (
                            <span className="badge h-3 w-10 mt-1 text-white bg-red-600 text-xs border-red-500 border-2">nsfw</span>
                        )
                    }
                    {
                        author?.isAdmin && (
                            <span className="badge h-3 w-10 mt-1 text-white bg-blue-600 text-xs border-blue-500 border-2">admin</span>
                        )
                    }
                </div>
                <p className="text-xs">
                    {
                        voteRatio > 0 && !author?.isAdmin && (
                            <span className="text-emerald-600">+{voteRatio} </span>
                        )
                    }
                    {
                        voteRatio < 0 && !author?.isAdmin && (
                            <span className="text-red-500">{voteRatio} </span>
                        )
                    }
                    {
                        author?.isAdmin ? (
                            <span>Anuncio</span>
                        ) : (
                            <span>- {post.category}</span>
                        )
                    }
                </p>
            </div>
        </Link>
    );
}
