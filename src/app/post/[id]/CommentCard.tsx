"use client"

import { useEffect, useState } from "react";
import { Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import formatDate from "@/app/lib/formatDate";
import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"
import ResponseIcon from "@/components/svgs/ResponseIcon";
import Upvote from "@/components/svgs/Upvote";
import Downvote from "@/components/svgs/Downvote";
import UserButton from "@/components/UserButton";

interface CommentProps{
    comment: Comment;
    isLogged: boolean;
    image: string | null;
    postId: string;
    userId: string;
    userName: string;
    handleResponse: (postId: string, userId: string, userName: string, image: string | null, message: string, parentId: string) => Promise<void>;
    commentLikes: number;
    commentDislikes: number;
    alreadyVotedComment: string | undefined
    handleCommentVote: (commentId: string, userId: string, type: 'UP' | 'DOWN') => Promise<void>;
}

export default function CommentCard({comment, isLogged, image, postId, userId, userName, handleResponse, commentLikes, commentDislikes, alreadyVotedComment, handleCommentVote}:CommentProps) {    
    const [responseBox, setResponseBox] = useState(false);
    const [votedComment, setVotedComment] = useState(alreadyVotedComment);

    useEffect(() => {
        setResponseBox(false);
        setVotedComment(alreadyVotedComment);
    }, [alreadyVotedComment]);

    const [response, setResponse] = useState("");
    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponse(event.target.value);
    };

    const createResponse = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleResponse(postId, userId, userName, image, response, comment.id);
        setResponse("");
        setResponseBox(false);
    };

    const handleResponseClick = () => {
        const parentCommentCard = document.getElementById(`comment-${comment.parentId}`);
        if (parentCommentCard) {
            parentCommentCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };
    
    return(
        <div id={`comment-${comment.id}`} className="border-b h-auto pb-2">
            <p className="block text-xs pl-16"
            >
                Comentario <span className="text-blue-400">#{comment.id}</span>
            </p>
            {
                comment.parentId && (
                    <button onClick={handleResponseClick}>
                        <p className="block text-xs pl-16">
                            Respuesta a comentario <span className="text-blue-400">#{comment.parentId}</span>
                        </p>
                    </button>
                )
            }
            <div className="flex min-h-28">
                <Link href={"/profile?query="+comment.userName}>
                    <Image
                        src={comment.profileImg || profilePicPlaceholder}
                        alt="Profile picture"
                        priority={true}
                        className="max-w-14 max-h-14 rounded-full mt-3"
                    />
                </Link>
                <div className="p-2 w-full">
                    <Link href={"/profile?query="+comment.userName}> 
                        <span className="pt-1 text-blue-600 text-2xl">{comment.userName}</span>
                    </Link>
                    <span className="text-xs text-slate-500 pl-6">{formatDate(comment.createdAt)}</span>
                    <p className="text-slate-800 w-auto min-h-6 h-auto text-lg">{comment.message}</p>
                    {
                        isLogged && (
                            <div className="flex justify-end space-x-1 pt-4 h-6">
                                <button onClick={() => {
                                    setResponseBox(!responseBox)
                                }}>
                                    <ResponseIcon className="h-6 w-10"/>
                                </button>
                                {
                                    votedComment !== undefined && votedComment === "UP" ? (
                                        <button 
                                            className="bg-emerald-500 rounded-md flex h-6 w-12 justify-center"
                                            onClick={async () =>{
                                                await handleCommentVote(comment.id, userId, "UP");
                                            }}
                                        >
                                            <Upvote 
                                                className="h-6 w-6"
                                                background="none"
                                                line="white"
                                            />
                                            <span className="text-white">{commentLikes}</span>
                                        </button>
                                    ) : (
                                        <button 
                                            className="border border-emerald-500 rounded-md flex h-6 w-12 justify-center"
                                            onClick={async () =>{
                                                await handleCommentVote(comment.id, userId, "UP");
                                            }}
                                        >
                                            <Upvote 
                                                className="h-6 w-6"
                                                background="none"
                                                line="rgb(16, 185, 129)"
                                            />
                                            <span className="text-emerald-500">{commentLikes}</span>
                                        </button>
                                    )
                                }
                                {
                                    votedComment !== undefined && votedComment === "DOWN" ? (
                                        <button 
                                            className="bg-red-500 rounded-md flex h-6 w-12 justify-center"
                                            onClick={async () =>{
                                                await handleCommentVote(comment.id, userId, "DOWN");
                                            }}
                                        >
                                            <Downvote 
                                                className="h-6 w-6"
                                                background="none"
                                                line="white"
                                            />
                                            <span className="text-white">{commentDislikes}</span>
                                        </button>
                                    ) : (
                                        <button 
                                            className="border border-red-500 rounded-md flex h-6 w-12 justify-center"
                                            onClick={async () =>{
                                                await handleCommentVote(comment.id, userId, "DOWN");
                                            }}
                                        >
                                            <Downvote 
                                                className="h-6 w-6"
                                                background="none"
                                                line="rgb(239, 68, 68)"
                                            />
                                            <span className="text-red-500">{commentDislikes}</span>
                                        </button>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            {
                responseBox && isLogged && (
                    <form onSubmit={createResponse} className="min-h-28 flex space-x-2 p-5">
                        <Image
                            src={comment.profileImg || profilePicPlaceholder}
                            alt="Profile picture"
                            priority={true}
                            className="max-w-8 max-h-8 rounded-full"
                        />
                        <textarea 
                            className="w-full hover:no-animation focus:outline-none border border-t-gray-300 rounded-md min-h-16 h-auto"
                            placeholder="Agregar respuesta"
                            onChange={handleCommentChange}
                        >  
                        </textarea>
                        <UserButton content="Responder" width="w-auto"/>
                    </form>
                )
            }
        </div>
    );
};
