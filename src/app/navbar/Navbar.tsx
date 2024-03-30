import Link from "next/link"
import { redirect } from "next/navigation";

async function searchPosts(formData: FormData) {
    "use server";

    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
        redirect("/search?query=" + searchQuery);
    }
}

export default async function Navbar() {
    return (
        <div className="navbar bg-green-300">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Taringa</a>
            </div>
            <div className="flex-none gap-2">
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