import Link from "next/link";
import { Post } from "@prisma/client";

interface AdminPostProps{
    post: Post;
}

export default async function AdminPostCard({post}:AdminPostProps) {
    return(
        <Link href={"/post/"+post.id} className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2 p-4 space-x-3">
            <span className="font-semibold text-base">{post.title}</span>
            <span className="badge text-white bg-blue-600 text-xs border-blue-500 border-2">ADMIN</span>
        </Link>
    );
}
