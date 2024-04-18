"use client"

import Upvote from "@/components/svgs/Upvote";
import Downvote from "@/components/svgs/Downvote";

interface VoteBoxProps {
    postId: string;
    userId: string;
    setVote: (postId: string, userId: string, type: 'UP' | 'DOWN') => Promise<void>;
}

export default function VoteBox ({postId, userId, setVote}:VoteBoxProps){
    return(
        <>
            <div className="p-5 flex">
                <button 
                    className="flex bg-emerald-500"
                    onClick={async () => {
                        await setVote(postId,userId,"UP")
                    }}
                >
                    <Upvote/>
                    <span className="text-white pt-1 w-1 pr-5">0</span>
                </button>
                <button 
                    className="flex bg-red-500"
                    onClick={async () => {
                        await setVote(postId,userId, "DOWN")
                    }}
                >
                    <Downvote/>
                    <span className="text-white pt-1 w-1 pr-5">0</span>
                </button>
                <span>Cantidad</span>
            </div>
        </>
    );
}