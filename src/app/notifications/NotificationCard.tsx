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
                    <div 
                        className="
                            text-[0.5rem] h-14 rounded-lg justify-between mb-2 p-1 text-slate-700/90
                            md:flex md:p-2 md:text-sm
                            lg:p-3 lg:font-semibold lg:text-base
                        "
                    >
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
                        <div 
                            className="
                                flex justify-end
                                lg:space-x-4
                            "
                        >
                            <CheckedIcon
                                className="
                                    w-4 h-4
                                    md:w-8 md:h-8
                                "
                            />
                            <button onClick={handleDeleteNotificationClick}>
                                <DeleteIcon
                                    className="
                                        w-4 h-4
                                        md:w-8 md:h-8
                                    "
                                />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="
                            bg-slate-200/55 text-[0.5rem] h-14 rounded-lg justify-between mb-2 p-1 text-slate-700/90
                            md:flex md:p-2 md:text-sm
                            lg:p-3 lg:font-semibold lg:text-base
                        "
                    >
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
                        <div 
                            className="
                                flex justify-end
                                lg:space-x-4
                            "
                        >
                            <button onClick={handleNotificationClick}>
                                <NotificationIcon
                                    className="
                                        w-4 h-4
                                        md:w-8 md:h-8
                                    "
                                    line="grey"
                                />
                            </button>
                            <button onClick={handleDeleteNotificationClick}>
                                <DeleteIcon
                                    className="
                                        w-4 h-4
                                        md:w-8 md:h-8
                                    "
                                />
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
};
