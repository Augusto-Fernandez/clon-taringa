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
    })
    
    return(
        <Link href={"/post/"+post.id} className="bg-slate-300 h-8 rounded flex justify-between">
            <div className="p-1 space-x-1">
                <span className="font-semibold text-sm">{post.title}</span>
                {
                    post.nsfw && (
                        <span className="rounded text-white bg-red-600 text-[0.5rem] border-red-500 border-2">NSFW</span>
                    )
                }
                {
                    author?.isAdmin && (
                        <span className="rounded text-white bg-blue-600 text-[0.5rem] border-blue-500 border-2">ADMIN</span>
                    )
                }
            </div>
            {
                voteRatio > 0 && (
                    <div className="pt-1 pr-3">
                        <span className="text-emerald-600">+{voteRatio}</span>
                    </div>
                )
            }
            {
                voteRatio < 0 && (
                    <div className="pt-1 pr-3">
                        <span className="text-red-500">{voteRatio}</span>
                    </div>
                )
            }
        </Link>
    );
}
