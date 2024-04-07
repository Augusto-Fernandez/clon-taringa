"use client"
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import profilePicPlaceholder from "../../../public/profilePicPlaceholder.png"

interface UserMenuButtonProps {
    session: Session | null;
}

export default function UserMenu({session}:UserMenuButtonProps){
    const user = session?.user;

    return(
        <>
            {
                user ? (<>
                    <Link href="/" className="btn-ghost text-xl normal-case">
                        Ojo
                    </Link>
                    <Link href="/" className="btn-ghost text-xl normal-case">
                        Mail
                    </Link>
                    <Link href="/" className="btn-ghost text-xl normal-case">
                        Favoritos
                    </Link>
                    <Link href="/" className="btn-ghost text-xl normal-case">
                        Perfil
                    </Link>
                    <div className="dropdown dropdown-end">
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
                                <button className="btn">Perfil</button>
                            </li>
                            <li>
                                <button className="btn" onClick={() => signOut({ callbackUrl: "/" })}>Cerrar Sesión</button>
                            </li>
                        </ul>
                    </div>
                </>) 
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
