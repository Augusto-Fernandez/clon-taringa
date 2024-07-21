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
        <div className="h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3">
                <p className="text-slate-700/90 font-semibold">
                    <span className="text-blue-600">{author?.userName}</span> comentó &quot;<span>{formatedComment}</span>&quot; en <Link href={`/post/${comment.postId}`} className="text-blue-600">{post?.title}</Link>
                </p>
            </div>
            <div className="p-4 space-x-1 flex">
                <span className="text-emerald-600">+{likes}</span>
                <span className="text-red-500">-{dislikes}</span>
            </div>
        </div>
    );
}
