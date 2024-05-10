"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface NotificationProps {
    fromUser: string;
    postId: string;
    postName: string;
    subject: "POST" | "COMMENT";
    readed: boolean;
    notificationId: string;
    handleNotification: (notificationId: string) => Promise<void>;
}

export default function NotificationCard({postId, fromUser, postName, subject, readed, notificationId, handleNotification}:NotificationProps) {
    const [isReaded, setIsReaded] = useState(readed);

    useEffect(() => {
        setIsReaded(readed);
    }, [readed]);

    const handleNotificationClick = async () => {
        await handleNotification(notificationId);
        setIsReaded(!isReaded)
    };
    
    return(
        <>
            {
                isReaded ? (
                    <div className="h-14 rounded-lg flex justify-between mb-2 p-3 text-slate-600 font-semibold">
                        <Link href={`/post/${postId}`} className="text-slate-600 font-semibold border border-black">
                            {
                                subject === "POST" && (
                                    <p><span className="text-blue-600">{fromUser}</span> comentó en tu post <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                            {
                                subject === "COMMENT" && (
                                    <p><span className="text-blue-600">{fromUser}</span> respondió tu comentario en <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                        </Link>
                    </div>
                ) : (
                    <div className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2 p-3 text-slate-600 font-semibold">
                        <Link onClick={handleNotificationClick} href={`/post/${postId}`} className="text-slate-600 font-semibold border border-black">
                            {
                                subject === "POST" && (
                                    <p><span className="text-blue-600">{fromUser}</span> comentó en tu post <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                            {
                                subject === "COMMENT" && (
                                    <p><span className="text-blue-600">{fromUser}</span> respondió tu comentario en <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                        </Link>
                    </div>
                )
            }
        </>
    );
};
