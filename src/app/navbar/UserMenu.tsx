"use client"
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import profilePicPlaceholder from "../../../public/profilePicPlaceholder.png"
import NotificationIcon from "@/components/svgs/NotificationIcon";
import MessageIcon from "@/components/svgs/MessageIcon";
import FavoritedIcon from "@/components/svgs/FavoritedIcon";

interface UserMenuButtonProps {
    session: Session | null;
}

export default function UserMenu({session}:UserMenuButtonProps){
    const user = session?.user;

    return(
        <>
            {
                user ? (
                    <ul className="flex justify-center items-center h-12 bg-green-400 border border-slate-300 rounded-lg">
                        <li className="border-r border-r-slate-300 p-2 hover:bg-green-500 rounded-md">
                            <Link href={"/notifications"}>
                                <NotificationIcon/>
                            </Link>
                        </li>
                        <li className="border-r border-r-slate-300 p-2 hover:bg-green-500 rounded-md">
                            <Link href="/">
                                <MessageIcon />
                            </Link>
                        </li>
                        <li  className="p-2 hover:bg-green-500 rounded-md">
                            <Link href={"/saved"}>
                                <FavoritedIcon className="w-8 h-8" background="none" line="white"/>
                            </Link>
                        </li>
                        <li className="dropdown dropdown-end ">
                            <Image
                                tabIndex={0} 
                                role="button"
                                src={user?.image || profilePicPlaceholder}
                                alt="Profile picture"
                                width={40}
                                height={40}
                                className="w-10 rounded-full"
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
