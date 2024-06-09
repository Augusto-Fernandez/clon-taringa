"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

import NotificationIcon from "@/components/svgs/NotificationIcon";
import CheckedIcon from "@/components/svgs/CheckedIcon";
import DeleteIcon from "@/components/svgs/DeleteIcon";

interface NotificationProps {
    fromUserName: string;
    postId: string;
    postName: string;
    subject: "POST" | "COMMENT";
    readed: boolean;
    notificationId: string;
    handleNotification: (notificationId: string) => Promise<void>;
    handleDeleteNotification: (notificationId: string) => Promise<void>;
}

export default function NotificationCard({postId, fromUserName, postName, subject, readed, notificationId, handleNotification, handleDeleteNotification}:NotificationProps) {
    const [isReaded, setIsReaded] = useState(readed);

    useEffect(() => {
        setIsReaded(readed);
    }, [readed]);

    const handleNotificationClick = async () => {
        await handleNotification(notificationId);
        setIsReaded(!isReaded)
    };

    const handleDeleteNotificationClick = async () => {
        await handleDeleteNotification(notificationId);
    };
    
    return(
        <>
            {
                isReaded ? (
                    <div className="h-14 rounded-lg flex justify-between mb-2 p-3 text-slate-600 font-semibold">
                        <Link href={`/post/${postId}`} className="text-slate-600 font-semibold">
                            {
                                subject === "POST" && (
                                    <p><span className="text-blue-600">{fromUserName}</span> comentó en tu post <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                            {
                                subject === "COMMENT" && (
                                    <p><span className="text-blue-600">{fromUserName}</span> respondió tu comentario en <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                        </Link>
                        <div className="flex space-x-4">
                            <CheckedIcon/>
                            <button onClick={handleDeleteNotificationClick}>
                                <DeleteIcon/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2 p-3 text-slate-600 font-semibold">
                        <Link onClick={handleNotificationClick} href={`/post/${postId}`} className="text-slate-600 font-semibold">
                            {
                                subject === "POST" && (
                                    <p><span className="text-blue-600">{fromUserName}</span> comentó en tu post <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                            {
                                subject === "COMMENT" && (
                                    <p><span className="text-blue-600">{fromUserName}</span> respondió tu comentario en <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                        </Link>
                        <div className="flex space-x-4">
                            <button onClick={handleNotificationClick}>
                                <NotificationIcon
                                    line="black"
                                />
                            </button>
                            <button onClick={handleDeleteNotificationClick}>
                                <DeleteIcon/>
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
};
