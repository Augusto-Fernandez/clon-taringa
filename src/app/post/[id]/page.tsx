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
import { handleVote, handleComment, handleResponse, handleCommentVote, savePost, reportPost, reportComment,deleteReport } from "./actions";
import CommentBox from "./CommentBox";
import CommentsIcon from "@/components/svgs/CommientsIcon";
import CommentCard from "./CommentCard";
import { Comment, CommentVote, Report, User } from "@prisma/client";
import SavedPostBox from "./SavedPostBox";
import ReportBox from "./ReportBox";

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

    let loggedUserId = null;
    let loggedUserName = null;
    let loggedUserImage = null;
    let isLogged = false;
    let postReported = false;

    const session = await getServerSession(authOptions);
    
    if(session?.user){
        const userLogged = await prisma.user.findUnique({
            where: {
                userName: session?.user?.name as string
            }
        })
        
        loggedUserId = userLogged?.id
        loggedUserName = userLogged?.userName
        loggedUserImage = userLogged?.image
        isLogged = true

        const checkReportPost = await prisma.report.findUnique({
            where: {
                userId: userLogged?.id,
                postId: post.id,
                subjectType: "POST"
            }
        })
    
        if(checkReportPost){
            postReported = true
        }
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

    const searchVote = votes.find(vote => vote.userId === loggedUserId)

    if(searchVote){
        alreadyVoted = searchVote.type
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: post.id
        }
    });

    const commentUserArray:User[] = [];
    const commentVotesArray:CommentVote[] = [];
    const commentReportArray:Report[] = [];
    
    await Promise.all(comments.map(async (comment) => {
        const commentUser = await prisma.user.findUnique({
            where: {
                id: comment.userId
            }
        });

        if (commentUser) {
            commentUserArray.push(commentUser);
        }
        
        const commentsVotes = await prisma.commentVote.findMany({
            where: {
                commentId: comment.id
            }
        });
    
        if (commentsVotes.length > 0) {
            commentVotesArray.push(...commentsVotes);
        }

        if(session?.user){
            const commentReport = await prisma.report.findUnique({
                where:{
                    commentId: comment.id,
                    userId: loggedUserId as string,
                    subjectType: "COMMENT"
                }
            });
    
            if(commentReport){
                commentReportArray.push(commentReport);
            }
        }
    }));

    const getCommentProfileImg = (userId: string) =>{
        let commentProfileImg = null;
        const searchCommentUser = commentUserArray.find(commentUser => commentUser.id === userId);
        if(searchCommentUser){
            commentProfileImg = searchCommentUser.image;
        }

        return commentProfileImg;
    };

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
        commentAlreadyVoted = searchCommentVote?.type;

        return commentAlreadyVoted
    }

    const saved = await prisma.savedPost.findMany({
        where: {
            postId: post.id
        }
    })

    let isSaved = false;

    if(saved.find(save => save.userId === loggedUserId)){
        isSaved = true;
    }

    const checkReportedComment = (commentId: string) => {
        const findReportedComment = commentReportArray.find(report => report.commentId === commentId)
        if(findReportedComment){
            return true;
        }

        return false;
    };

    interface SortedByVotesArray extends Comment {
        votesDif: number
    }

    const commentsSortedByVotes:SortedByVotesArray[] = [...comments.map((comment) => ({ ...comment, votesDif: getCommentVotes(comment.id, "UP") - getCommentVotes(comment.id, "DOWN")}))]
    commentsSortedByVotes.sort((a,b) => b.votesDif - a.votesDif);

    return(
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="mx-72 min-h-screen bg-white rounded-3xl border">
                <Image 
                    src={post.banner || postDefaultBanner} 
                    width={200}
                    height={200}
                    alt="Banner picture"
                    className="h-32 w-full border-b border-b-gray-300 rounded-t-3xl"
                />
                <h1 className="min-h-28 h-auto p-10 text-slate-600 font-semibold text-4xl">{post.title}</h1>
                <div className="pb-10 pl-10 pr-10 flex justify-between h-1">
                    <Link href={"/profile?query="+author?.userName} className=" h-10 flex space-x-2">
                        <Image
                            tabIndex={0} 
                            role="button"
                            src={author?.image || profilePicPlaceholder}
                            alt="Profile picture"
                            width={20}
                            height={20}
                            className="w-9 h-9 mb-1 rounded-full"
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
                <div className="p-5 flex justify-between">
                    <div className="p-5 flex space-x-1">
                        {
                            session?.user && (
                                <VoteBox 
                                    postId={post.id}
                                    userId={loggedUserId as string}
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
                                        userId={loggedUserId as string}
                                        isSaved={isSaved}
                                        savePost={savePost}
                                    />
                                    <span className="text-amber-400 pt-1 w-1 pr-5">{saved.length}</span>
                                </div>
                            )
                        }
                        {
                            !author?.isAdmin && (
                                <div className="flex">
                                    <CommentsIcon className="w-8 h-8"/>
                                    <span className="pt-1 w-1 pr-5">{comments.length}</span>
                                </div>
                            )
                        }
                    </div>
                    {
                        session?.user && !author?.isAdmin && loggedUserId !== author?.id && (
                            <ReportBox
                                userId={loggedUserId as string}
                                postId={post.id}
                                isReported = {postReported}
                                reportPost={reportPost}
                                deleteReport={deleteReport}
                            />
                        )
                    }
                </div>
            </div>
            {
                session?.user && !author?.isAdmin && (
                    <CommentBox 
                        image={loggedUserImage as string | null}
                        postId={post.id}
                        userId={loggedUserId as string}
                        userName={loggedUserName as string}
                        handleComment={handleComment}
                        postAuthorId={author?.id as string}
                    />
                )
            }
            {
                comments.length > 0 && !author?.isAdmin && (
                    <div className="bg-white rounded-3xl mt-8 mx-72 p-4 space-y-4">
                        {
                            commentsSortedByVotes.map(comment => (
                                <CommentCard 
                                    comment={comment} 
                                    isLogged={isLogged} 
                                    commentProfileImg={getCommentProfileImg(comment.userId)}
                                    loggedUserImage={loggedUserImage as string | null}
                                    loggedUserId={loggedUserId as string}
                                    loggedUserName={loggedUserName as string}
                                    handleResponse={handleResponse}
                                    commentLikes={getCommentVotes(comment.id, "UP")}
                                    commentDislikes={getCommentVotes(comment.id, "DOWN")}
                                    alreadyVotedComment={checkIfCommetWasVoted(comment.id, loggedUserId as string)}
                                    handleCommentVote={handleCommentVote}
                                    isReported={checkReportedComment(comment.id)}
                                    reportComment={reportComment}
                                    key={comment.id}
                                    deleteReport={deleteReport}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}