import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "../api/auth/[...nextauth]/route";

import UserMenu from "./UserMenu";

async function searchPosts(formData: FormData) {
    "use server";

    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
        redirect("/search?query=" + searchQuery);
    }
}

export default async function Navbar() {
    const session = await getServerSession(authOptions);

    return (
        <div className="navbar bg-green-300">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Taringa</a>
            </div>
            <div className="flex-none gap-2">
                <UserMenu session={session}/>
                <form action={searchPosts}>
                    <input type="text" placeholder="Buscar Post" name="searchQuery" className="input input-bordered w-24 md:w-auto"/>
                    <button type="submit" className="btn">
                        O
                    </button>
                </form>
            </div>
        </div>
    )
}