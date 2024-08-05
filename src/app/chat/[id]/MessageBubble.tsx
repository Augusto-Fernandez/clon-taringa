"use client"

import Image from "next/image";
import Link from "next/link";

import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"

interface MessageBubbleProps{
    userImage: string;
    userName: string;
    body: string;
    createdAt: string;
    checkSenderId: boolean;
}

export default function MessageBubble ({userImage, userName, body, createdAt, checkSenderId}:MessageBubbleProps){
    return(
        <div className={checkSenderId ? "chat chat-end" : "chat chat-start"}>
            <div 
                className="
                    chat-image avatar hidden
                    md:block
                "
            >
                <div className="w-10 rounded-full">
                    <Link href={"/profile?query="+userName}>
                        <Image
                           src={userImage || profilePicPlaceholder} 
                           alt="Profile picture"
                           priority={true}
                           width={20}
                           height={20}
                        />
                    </Link>
                </div>
            </div>
            <div 
                className="
                    chat-header text-slate-700 text-xs
                    md:text-sm
                    lg:text-lg
                "
            >
                {userName}
                <time className="ml-2 text-xs opacity-80">{createdAt}</time>
            </div>
            <div 
                className="
                    chat-bubble bg-slate-300/90 text-slate-700 w-5/6 text-xs
                    md:text-sm
                    lg:text-base
                " 
                style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}
            >
                {body}
            </div>
        </div>
    );
};
