"use client"
import Link from "next/link";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

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
                    <button className="btn" onClick={() => signOut({callbackUrl:"/"})}>Cerrar Sesión</button>
                </>) 
                    : 
                (
                    <button className="btn" onClick={() => signIn()}>Ingresar</button>
                )
            }
        </>
    );
};