"use client"
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import profilePicPlaceholder from "../../../public/profilePicPlaceholder.png"
import NotificationIcon from "@/components/svgs/NotificationIcon";
import MessageIcon from "@/components/svgs/MessageIcon";
import FavoritedIcon from "@/components/svgs/FavoritedIcon";
import AdminPanelIcon from "@/components/svgs/AdminPanelIcon";

interface UserMenuButtonProps {
    session: Session | null;
    notificationCount: number;
    messageNotificationCount: number;
    isAdmin: boolean;
    image: string | null;
}

export default function UserMenu({session, notificationCount, messageNotificationCount, image, isAdmin}:UserMenuButtonProps){
    const user = session?.user;

    return(
        <>
            {
                user && isAdmin && (
                    <Link 
                        href={"/panel"}
                        className="btn text-sm font-semibold bg-green-400/50 border border-green-300/80 text-white hover:bg-green-500/50" 
                    >
                        <AdminPanelIcon
                            className="w-8 h-8"
                        />
                        Panel de Control
                    </Link>
                )
            }
            {
                user ? (
                    <ul className="flex justify-center items-center h-12 bg-green-400/50 rounded-md">
                        <li className="border-r border-r-slate-300 p-2 hover:bg-green-500/50 rounded-l-md h-12">
                            <Link href={"/notifications"}>
                                <div className="indicator">
                                    <NotificationIcon
                                        line="rgb(255, 255, 255)"
                                    />
                                    {
                                        notificationCount > 0 && notificationCount < 10 && (
                                            <span className="indicator-item badge bg-red-500 text-white">{notificationCount}</span>
                                        )
                                    }
                                    {
                                        notificationCount > 9 && (
                                            <span className="indicator-item badge bg-red-500 text-white">+9</span>
                                        )
                                    }
                                </div>
                            </Link>
                        </li>
                        <li className="border-r border-r-slate-300 px-2 pt-2 hover:bg-green-500/50">
                            <Link href={"/messages"}>
                                <div className="indicator">
                                    <MessageIcon/>
                                    {
                                        messageNotificationCount > 0 && messageNotificationCount < 10 && (
                                            <span className="indicator-item badge bg-red-500 text-white">{messageNotificationCount}</span>
                                        )
                                    }
                                    {
                                        messageNotificationCount > 9 && (
                                            <span className="indicator-item badge bg-red-500 text-white">+9</span>
                                        )
                                    }
                                </div>
                            </Link>
                        </li>
                        <li  className="p-2 hover:bg-green-500/50 rounded-r-md">
                            <Link href={"/saved"}>
                                <FavoritedIcon className="w-8 h-8" background="none" line="white"/>
                            </Link>
                        </li>
                        <li className="dropdown dropdown-end ">
                            <Image
                                tabIndex={0} 
                                role="button"
                                src={image || profilePicPlaceholder}
                                alt="Profile picture"
                                width={20}
                                height={20}
                                className="w-10 h-10 rounded-full"
                            />
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 space-y-1">
                                <li>
                                    <Link href={"/profile?query="+user.name} className="btn">Perfil</Link>
                                </li>
                                <li>
                                    <button className="btn" onClick={() => signOut({ callbackUrl: "/" })}>Cerrar Sesión</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                ) 
                    : 
                (
                    <button 
                        className="btn text-base font-semibold bg-green-500 border border-green-300/80 text-white hover:bg-green-600" 
                        onClick={() => signIn()}>
                            Ingresar
                    </button>
                )
            }
        </>
    );
};
