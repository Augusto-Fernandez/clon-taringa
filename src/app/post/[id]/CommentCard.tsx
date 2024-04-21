import { Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/app/lib/db/prisma";

import formatDate from "@/app/lib/formatDate";
import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"
import ResponseIcon from "@/components/svgs/ResponseIcon";
import Upvote from "@/components/svgs/Upvote";
import Downvote from "@/components/svgs/Downvote";

interface CommentProps{
    comment: Comment;
}

export default async function CommentCard({comment}:CommentProps) {
    const author = await prisma.user.findUnique({
        where: {
            id: comment.userId
        }
    })
    
    return(
        <div className="border-b flex min-h-24 h-auto">
            <Link href={"/profile?query="+author?.userName}>
                <Image
                    src={author?.image || profilePicPlaceholder}
                    alt="Profile picture"
                    priority={true}
                    className="max-w-12 max-h-12 rounded-full mt-2"
                />
            </Link>
            <div className="p-2 w-full">
                <Link href={"/profile?query="+author?.userName}> 
                    <span className="pt-1 text-blue-600 text-lg">{author?.userName}</span>
                </Link>
                <span className="text-xs text-slate-500 pl-6">{formatDate(comment.createdAt)}</span>
                <p className="text-slate-800 w-auto min-h-6 h-auto">{comment.message}</p>
                <div className="flex justify-end space-x-1 pt-4">
                    <ResponseIcon className="h-6 w-10"/>
                    <Upvote className="h-6 w-10 bg-emerald-500 rounded-md"/>
                    <Downvote className="h-6 w-10 bg-red-500 rounded-md"/>
                </div>
            </div>
        </div>
    );
};
