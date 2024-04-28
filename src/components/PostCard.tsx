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

    const votes = await prisma.vote.findMany({
        where: {
            postId: post.id
        }
    }) 

    let likes = 0;
    let dislikes = 0;

    votes.forEach(vote => {
        if (votes.length > 0 && vote.type === 'UP') {
            likes++;
        } else if (votes.length > 0 && vote.type === 'DOWN') {
            dislikes++;
        }
    });

    return(
        <Link href={"/post/"+post.id} className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3 space-x-4">
                <span className="font-semibold text-lg">{post.title}</span>
                <span className="text-blue-600">{author?.userName}</span>
            </div>
            <div className="p-4 space-x-4 flex">
                <span>{post.category}</span>
                <div className="space-x-1">
                    <span className="text-emerald-600">+{likes}</span>
                    <span className="text-red-500">-{dislikes}</span>
                </div>
            </div>
        </Link>
    );
}
