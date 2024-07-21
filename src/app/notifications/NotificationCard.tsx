"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

import { Notification } from "@prisma/client";

import NotificationIcon from "@/components/svgs/NotificationIcon";
import CheckedIcon from "@/components/svgs/CheckedIcon";
import DeleteIcon from "@/components/svgs/DeleteIcon";

interface NotificationProps {
    notification: Notification;
    fromUserName: string;
    postName: string;
    handleNotification: (notificationId: string) => Promise<void>;
    handleDeleteNotification: (notificationId: string) => Promise<void>;
}

export default function NotificationCard({notification, fromUserName, postName, handleNotification, handleDeleteNotification}:NotificationProps) {
    const [isReaded, setIsReaded] = useState(notification.readed);

    useEffect(() => {
        setIsReaded(notification.readed);
    }, [notification.readed]);

    const handleNotificationClick = async () => {
        await handleNotification(notification.id);
        setIsReaded(!isReaded)
    };

    const handleDeleteNotificationClick = async () => {
        await handleDeleteNotification(notification.id);
    };
    
    return(
        <>
            {
                isReaded ? (
                    <div className="h-14 rounded-lg flex justify-between mb-2 p-3 text-slate-700/90 font-semibold">
                        <Link href={`/post/${notification.subjectId}`}>
                            {
                                notification.subject === "POST" && (
                                    <p><span className="text-blue-600">{fromUserName}</span> comentó en tu post <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                            {
                                notification.subject === "COMMENT" && (
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
                    <div className="bg-slate-200/55 h-14 rounded-lg flex justify-between mb-2 p-3 text-slate-700/90 font-semibold">
                        <Link onClick={handleNotificationClick} href={`/post/${notification.subjectId}`}>
                            {
                                notification.subject === "POST" && (
                                    <p><span className="text-blue-600">{fromUserName}</span> comentó en tu post <span className="text-blue-600">{postName}</span></p>
                                )
                            }
                            {
                                notification.subject === "COMMENT" && (
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
