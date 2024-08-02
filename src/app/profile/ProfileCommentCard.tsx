import Link from "next/link";
import { Comment } from "@prisma/client";

import { prisma } from "@/app/lib/db/prisma";

interface CommentProps{
    comment: Comment;
}

export default async function ProfileCommentCard({comment}:CommentProps) {
    const author = await prisma.user.findUnique({
        where: {
            id: comment.userId
        }
    });

    const post = await prisma.post.findUnique({
        where: {
            id: comment.postId
        }
    })

    const commentVotes = await prisma.commentVote.findMany({
        where: {
            commentId: comment.id
        }
    });

    let likes = 0;
    let dislikes = 0;

    commentVotes.forEach(commentVote => {
        if (commentVotes.length > 0 && commentVote.type === 'UP') {
            likes++;
        } else if (commentVotes.length > 0 && commentVote.type === 'DOWN') {
            dislikes++;
        }
    });

    const formatedComment = comment.message.length > 10 ? comment.message.substring(0, 10) + "..." : comment.message;

    return(
        <div 
            className="
                min-h-14 h-auto rounded-lg mb-2
                md:flex md:justify-between
            "
        >
            <div 
                className="
                    pl-2
                    md:pl-0
                    lg:p-3
                "
            >
                <p 
                    className="
                        text-slate-700/90 text-[0.5rem]
                        md:text-sm
                        lg:font-semibold lg:text-base
                    "
                >
                    <span className="text-blue-600">{author?.userName}</span> comentó &quot;<span>{formatedComment}</span>&quot; en <Link href={`/post/${comment.postId}`} className="text-blue-600">{post?.title}</Link>
                </p>
            </div>
            <div 
                className="
                    pl-2 flex space-x-1
                    md:pl-0 md:p-4
                "
            >
                <span 
                    className="
                        text-emerald-600 text-xs
                        md:text-sm
                        lg:text-base
                    "
                >
                    +{likes}
                </span>
                <span 
                    className="
                        text-red-500 text-xs
                        md:text-sm
                        lg:text-base
                    "
                >
                    -{dislikes}
                </span>
            </div>
        </div>
    );
}
