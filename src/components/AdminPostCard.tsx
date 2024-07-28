import Link from "next/link";
import { Post } from "@prisma/client";
import Image from "next/image";

import { prisma } from "@/app/lib/db/prisma";

import postDefaultBanner from "../../public/postDefaultBanner.png";

interface AdminPostProps{
    post: Post;
}

export default async function AdminPostCard({post}:AdminPostProps) {
    const author = await prisma.user.findUnique({
        where: {
            id: post.userId
        }
    });
    
    return(
        <Link href={"/post/"+post.id} className="bg-slate-200/[.55] h-14 rounded-lg flex mb-2 text-slate-700 overflow-hidden">
            <Image 
                src={postDefaultBanner} 
                width={80}
                height={80}
                alt="Banner picture"
                className="
                    hidden
                    md:block md:w-12 md:p-1 md:rounded-xl
                "
            />
            <div className="flex flex-col pl-1">
                <span className="font-medium text-xs">{post.title}</span>
                <div className="space-x-1">
                    <span className="text-xs text-blue-600">{author?.userName}</span>
                    <span className="badge h-3 w-10 mt-1 text-white bg-blue-600 text-xs border-blue-500 border-2">admin</span>
                </div>
                {
                    author?.isAdmin ? (
                        <span className="text-xs">Anuncio</span>
                    ) : (
                        <span className="text-xs">{post.category}</span>
                    )
                }
            </div>
        </Link>
    );
}
