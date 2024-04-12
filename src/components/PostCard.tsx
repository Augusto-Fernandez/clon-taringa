import Link from "next/link";
import { Post } from "@prisma/client";

import { prisma } from "@/app/lib/db/prisma";

interface PostProps{
    post: Post;
}

export default async function PostCard({post}:PostProps) {
    const author = await prisma.user.findUnique({
        where: {
            id: post.userId
        }
    })

    return(
        <Link href={"/post/"+post.id} className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3 space-x-4">
                <span className="font-semibold text-lg">{post.title}</span>
                <span className="text-blue-600">{author?.userName}</span>
            </div>
            <div className="p-4 space-x-4 flex">
                <span>{post.category}</span>
                <div className="space-x-1">
                    <span>+0</span>
                    <span>-0</span>
                </div>
            </div>
        </Link>
    );
}