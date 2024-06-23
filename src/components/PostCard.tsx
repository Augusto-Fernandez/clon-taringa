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
        <Link href={"/post/"+post.id} className="bg-slate-300 h-14 rounded-lg flex mb-2">
            <div className=" w-24"></div>
            <div className="w-full flex flex-col pl-2 pb-1">
                <span className="font-semibold text-base">{post.title}</span>
                <div className="flex space-x-3">
                    <p className="text-xs">
                        {
                            author?.isAdmin ? (
                                <span>Anuncio </span>
                            ) : (
                                <span>{post.category} </span>
                            )
                        }
                        - <span className="text-blue-600">{author?.userName}</span>
                    </p>
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
                <div className="space-x-1 text-xs">
                    <span className="text-emerald-600">+{likes}</span>
                    <span className="text-red-500">-{dislikes}</span>
                </div>
            </div>
        </Link>
    );
}
