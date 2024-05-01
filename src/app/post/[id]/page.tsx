import { prisma } from "@/app/lib/db/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import formatDate from "@/app/lib/formatDate";

import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"
import postDefaultBanner from "../../../../public/postDefaultBanner.png"

import VoteBox from "./VoteBox";
import { handleVote, handleComment, handleResponse, handleCommentVote, savePost } from "./actions";
import CommentBox from "./CommentBox";
import CommentsIcon from "@/components/svgs/CommientsIcon";
import CommentCard from "./CommentCard";
import { Comment, CommentVote } from "@prisma/client";
import SavedPostBox from "./SavedPostBox";

interface PostId {
    params: {
        id: string;
    };
}

const getPost = cache(async (id: string) => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) notFound();
    return post;
});

export default async function PostPage({params:{id}}:PostId) {
    const post = await getPost(id);

    const author = await prisma.user.findUnique({
        where: {
            id: post.userId
        }
    })

    let userId = null
    let userName = null
    let userImage = null
    let isLogged = false

    const session = await getServerSession(authOptions);
    
    if(session?.user){
        const userLogged = await prisma.user.findUnique({
            where: {
                userName: session?.user?.name as string
            }
        })
        
        userId = userLogged?.id
        userName = userLogged?.userName
        userImage = userLogged?.image
        isLogged = true
    }
    
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

    let alreadyVoted: string | undefined

    const searchVote = votes.find(vote => vote.userId === userId)

    if(searchVote){
        alreadyVoted = searchVote.type
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: post.id
        }
    });

    const commentVotesArray:CommentVote[] = [];
    
    await Promise.all(comments.map(async (comment) => {
        const commentsVotes = await prisma.commentVote.findMany({
            where: {
                commentId: comment.id
            }
        });
    
        if (commentsVotes.length > 0) {
            commentVotesArray.push(...commentsVotes);
        }
    }));

    const getCommentVotes = (commentId: string, type: "UP" | "DOWN") =>{
        let count = 0;

        commentVotesArray.forEach( commentVote =>{
            if(commentVote.commentId === commentId && commentVote.type === type){
                count++
            }
        });

        return count;
    }

    const checkIfCommetWasVoted = (commentId: string, userId: string) =>{
        let commentAlreadyVoted: string | undefined
        
        const searchCommentVote = commentVotesArray.find(commentVote => commentVote.commentId === commentId && commentVote.userId === userId);
        commentAlreadyVoted = searchCommentVote?.type
        console.log(searchCommentVote)

        return commentAlreadyVoted
    }

    const saved = await prisma.savedPost.findMany({
        where: {
            postId: post.id
        }
    })

    let isSaved = false;

    if(saved.find(save => save.userId === userId)){
        isSaved = true;
    }

    interface SortedByVotesArray extends Comment {
        votesDif: number
    }

    const commentsSortedByVotes:SortedByVotesArray[] = [...comments.map((comment) => ({ ...comment, votesDif: getCommentVotes(comment.id, "UP") - getCommentVotes(comment.id, "DOWN")}))]
    commentsSortedByVotes.sort((a,b) => b.votesDif - a.votesDif);

    return(
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="mx-72 min-h-screen bg-white rounded-3xl border">
                <Image 
                    src={postDefaultBanner} 
                    alt="Banner picture"
                    className="h-32 border-b border-b-gray-300 rounded-t-3xl"
                />
                <h1 className="min-h-28 h-auto p-10 text-slate-600 font-semibold text-5xl">{post.title}</h1>
                <div className="pb-10 pl-10 pr-10 flex justify-between h-1">
                    <Link href={"/profile?query="+author?.userName} className=" h-10 flex space-x-2">
                        <Image
                            tabIndex={0} 
                            role="button"
                            src={author?.image || profilePicPlaceholder}
                            alt="Profile picture"
                            width={40}
                            height={40}
                            className="w-9 pb-1 rounded-full"
                            priority={true}
                        />
                        <span className="pt-1 text-blue-600">{author?.userName}</span>
                    </Link>
                    <span className="text-sm text-slate-500 h-10">{formatDate(post.createdAt)}</span>
                </div>
                <div className="mx-10 min-h-96 h-auto pt-5 border-t border-t-gray-100">
                    <p className="text-slate-800">{post.body}</p>
                </div>
                {
                    post.link && (
                        <div className="border-y border-y-gray-100 pl-8 py-4">
                            <p className="text-slate-600 font-semibold text-lg">Link externo:</p>
                            <a href={post.link} rel="noopener noreferrer" className="text-blue-500 underline">{post.link}</a>
                        </div>
                    )
                }
                <div className="p-5 flex">
                    <div className="p-5 flex space-x-1">
                        {
                            session?.user && (
                                <VoteBox 
                                    postId={post.id}
                                    userId={userId as string}
                                    likes={likes}
                                    dislikes={dislikes}
                                    alreadyVoted={alreadyVoted}
                                    handleVote={handleVote}
                                />
                            )
                        }
                        {
                            session?.user && (
                                <div className="flex">
                                    <SavedPostBox 
                                        postId={post.id}
                                        userId={userId as string}
                                        isSaved={isSaved}
                                        savePost={savePost}
                                    />
                                    <span className="text-amber-400 pt-1 w-1 pr-5">{saved.length}</span>
                                </div>
                            )
                        }
                        <div className="flex">
                            <CommentsIcon className="w-8 h-8"/>
                            <span className="pt-1 w-1 pr-5">{comments.length}</span>
                        </div>
                    </div>
                </div>
            </div>
            {
                session?.user && (
                    <CommentBox 
                        image={userImage as string | null}
                        postId={post.id}
                        userId={userId as string}
                        userName={userName as string}
                        handleComment={handleComment}
                    />
                )
            }
            {
                comments.length > 0 && (
                    <div className="bg-white rounded-3xl mt-8 mx-72 p-4 space-y-4">
                        {
                            commentsSortedByVotes.map(comment => (
                                <CommentCard 
                                    comment={comment} 
                                    isLogged={isLogged} 
                                    image={userImage as string | null}
                                    postId={post.id}
                                    userId={userId as string}
                                    userName={userName as string}
                                    handleResponse={handleResponse}
                                    commentLikes={getCommentVotes(comment.id, "UP")}
                                    commentDislikes={getCommentVotes(comment.id, "DOWN")}
                                    alreadyVotedComment={checkIfCommetWasVoted(comment.id, userId as string)}
                                    handleCommentVote={handleCommentVote}
                                    key={comment.id}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}