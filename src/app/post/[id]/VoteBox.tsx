"use client"

import { useState, useEffect } from "react";

import Upvote from "@/components/svgs/Upvote";
import Downvote from "@/components/svgs/Downvote";

interface VoteBoxProps {
    postId: string;
    userId: string;
    likes: number;
    dislikes: number;
    alreadyVoted: string | undefined;
    handleVote: (postId: string, userId: string, type: 'UP' | 'DOWN') => Promise<void>;
}

export default function VoteBox ({postId, userId, likes, dislikes, alreadyVoted, handleVote}:VoteBoxProps){
    const [voted, setVoted] = useState(alreadyVoted);
    
    useEffect(() => {
        setVoted(alreadyVoted);
    }, [alreadyVoted]);

    return(
        <>
            {
                voted !==undefined && voted==="UP" ? (
                    <button 
                        className="flex bg-emerald-500 rounded-md"
                        onClick={async () => {
                            await handleVote(postId,userId,"UP")
                        }}
                    >
                        <Upvote 
                            className="w-8 h-8 rounded-md"
                            background="none"
                            line="white"
                        />
                        <span className="text-white pt-1 w-1 pr-5">{likes}</span>
                    </button>
                ) : (
                    <button 
                        className="flex border border-emerald-500 rounded-md"
                        onClick={async () => {
                            await handleVote(postId,userId,"UP")
                        }}
                    >
                        <Upvote 
                            className="w-8 h-8 rounded-md"
                            background="none"
                            line="rgb(16, 185, 129)"
                        />
                        <span className="text-emerald-500 pt-1 w-1 pr-5">{likes}</span>
                    </button>
                )
            }
            {
                voted !== undefined && voted==="DOWN" ? (
                    <button 
                        className="flex bg-red-500 rounded-md"
                        onClick={async () => {
                            await handleVote(postId,userId, "DOWN")
                        }}
                    >
                        <Downvote 
                            className="w-8 h-8 rounded-md"
                            background="none"
                            line="white"
                        />
                        <span className="text-white pt-1 w-1 pr-5">{dislikes}</span>
                    </button>
                ) : (
                    <button 
                        className="flex border border-red-500 rounded-md"
                        onClick={async () => {
                            await handleVote(postId,userId, "DOWN")
                        }}
                    >
                        <Downvote 
                            className="w-8 h-8 rounded-md"
                            background="none"
                            line="rgb(239, 68, 68)"
                        />
                        <span className="text-red-500 pt-1 w-1 pr-5">{dislikes}</span>
                    </button>
                )
            }
        </>
    );
}