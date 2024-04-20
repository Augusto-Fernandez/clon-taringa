"use client"

import Image from "next/image";
import React, { useState } from 'react';

import UserButton from "@/components/UserButton";
import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"

interface CommentBoxProps{
    image: string;
    postId: string;
    userId: string;
    handleComment: (postId: string, userId: string, message: string) => Promise<void>;
}

export default function CommentBox ({image, postId, userId, handleComment}:CommentBoxProps){
    const [comment, setComment] = useState("");
    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const createComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleComment(postId, userId, comment);
        setComment("");
    };

    return(
        <form onSubmit={createComment} className="mx-72 my-8 rounded-3xl bg-white p-4 flex space-x-4">
            <Image
                src={image || profilePicPlaceholder}
                alt="Profile picture"
                priority={true}
                className="max-w-12 max-h-12 rounded-full mt-2"
            />
            <textarea 
                className="w-full hover:no-animation focus:outline-none border border-t-gray-300 rounded-md min-h-16 h-auto"
                required
                placeholder="Agregar comentario"
                value={comment}
                onChange={handleCommentChange}
            >
            </textarea>
            <UserButton content="Comentar" width="w-auto"/>
        </form>
    );
}
