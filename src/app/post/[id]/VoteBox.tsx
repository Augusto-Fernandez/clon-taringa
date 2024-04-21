"use client"

import Upvote from "@/components/svgs/Upvote";
import Downvote from "@/components/svgs/Downvote";

interface VoteBoxProps {
    postId: string;
    userId: string;
    likes: number;
    dislikes: number;
    handleVote: (postId: string, userId: string, type: 'UP' | 'DOWN') => Promise<void>;
}

export default function VoteBox ({postId, userId, likes, dislikes, handleVote}:VoteBoxProps){
    return(
        <>
            <button 
                className="flex bg-emerald-500 rounded-md"
                onClick={async () => {
                    await handleVote(postId,userId,"UP")
                }}
            >
                <Upvote className="w-8 h-8 rounded-md"/>
                <span className="text-white pt-1 w-1 pr-5">{likes}</span>
            </button>
            <button 
                className="flex bg-red-500 rounded-md"
                onClick={async () => {
                    await handleVote(postId,userId, "DOWN")
                }}
            >
                <Downvote className="w-8 h-8 rounded-md"/>
                <span className="text-white pt-1 w-1 pr-5">{dislikes}</span>
            </button>
        </>
    );
}