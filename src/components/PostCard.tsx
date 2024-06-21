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

    const formatedPostTitle = () =>{
        if(post.nsfw){
            return post.title.length > 13 ? post.title.substring(0, 13) + "..." : post.title;
        }

        return post.title.length > 18 ? post.title.substring(0, 18) + "..." : post.title;
    };

    return(
        <Link href={"/post/"+post.id} className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3 space-x-4">
                <span className="font-semibold text-lg">{formatedPostTitle()}</span>
                <span className="text-blue-600">{author?.userName}</span>
                {
                    post.nsfw && !author?.isAdmin && (
                        <span className="badge text-white bg-red-600 text-xs border-red-500 border-2">NSFW</span>
                    )
                }
                {
                    author?.isAdmin && (
                        <span className="badge text-white bg-blue-600 text-xs border-blue-500 border-2">ADMIN</span>
                    )
                }
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
