//import Link from "next/link";
import { Post } from "@prisma/client";

/*
<Link href={"/post/"+post.id}>
        
</Link>
*/

interface PostProps{
    post: Post;
}

export default function PostCard({post}:PostProps) {
    return(
        <div className="bg-slate-300 h-14 rounded-lg flex justify-between">
            <div className="p-3 space-x-4">
                <span className="font-semibold text-lg">{post.title}</span>
                <span>Autor</span>
            </div>
            <div className="p-4 space-x-4 flex">
                <span>{post.category}</span>
                <div className="space-x-1">
                    <span>+0</span>
                    <span>-0</span>
                </div>
            </div>
        </div>
    );
}