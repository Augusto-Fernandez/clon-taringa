import { prisma } from "@/app/lib/db/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PostId {
    params: {
        id: string;
    };
}

const getPost = cache(async (id: string) => {
    const product = await prisma.post.findUnique({ where: { id } });
    if (!product) notFound();
    return product;
});

export default async function Post({params:{id}}:PostId) {
    const post = await getPost(id);
    
    return(
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="mx-72 min-h-screen bg-white rounded-3xl border">
                <div className="h-32 border-b border-b-gray-300 rounded-t-3xl">

                </div>
                <h1 className="min-h-28 h-auto p-10 text-slate-600 font-semibold text-5xl">{post.title}</h1>
                <div className="pb-10 pl-10 pr-10 flex justify-between h-1">
                    <span>Aca va el usuario</span>
                    <span className="text-sm text-slate-500">Aca va la fecha</span>
                </div>
                <div className="mx-10 min-h-96 h-auto pt-5 border-t border-t-gray-100">
                    <p className="text-slate-800">{post.body}</p>
                </div>
                <div className="p-5">
                    <span>Upvote</span>
                    <span>Downvote</span>
                    <span>Cantidad</span>
                </div>
            </div>
        </div>
    );
}