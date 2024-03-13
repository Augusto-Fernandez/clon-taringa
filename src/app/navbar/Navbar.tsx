import Link from "next/link"

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
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
            </div>
        </div>
    )
}