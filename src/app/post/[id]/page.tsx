import { prisma } from "@/app/lib/db/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import formatDate from "@/app/lib/formatDate";

import profilePicPlaceholder from "../../../../public/profilePicPlaceholder.png"
import postDefaultBanner from "../../../../public/postDefaultBanner.png"

import VoteBox from "./VoteBox";
import { handleVote } from "./actions";

interface PostId {
    params: {
        id: string;
    };
}

const getPost = cache(async (id: string) => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) notFound();
    return post;
});

export default async function PostPage({params:{id}}:PostId) {
    const post = await getPost(id);

    const author = await prisma.user.findUnique({
        where: {
            id: post.userId
        }
    })

    const session = await getServerSession(authOptions);
    const userLogged = await prisma.user.findUnique({
        where: {
            userName: session?.user?.name as string
        }
    }) 

    return(
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="mx-72 min-h-screen bg-white rounded-3xl border">
                <Image 
                    src={postDefaultBanner} 
                    alt="Banner picture"
                    className="h-32 border-b border-b-gray-300 rounded-t-3xl"
                />
                <h1 className="min-h-28 h-auto p-10 text-slate-600 font-semibold text-5xl">{post.title}</h1>
                <div className="pb-10 pl-10 pr-10 flex justify-between h-1">
                    <Link href={"/profile?query="+author?.userName} className=" h-10 flex space-x-2">
                        <Image
                            tabIndex={0} 
                            role="button"
                            src={author?.image || profilePicPlaceholder}
                            alt="Profile picture"
                            width={40}
                            height={40}
                            className="w-9 pb-1 rounded-full"
                            priority={true}
                        />
                        <span className="pt-1 text-blue-600">{author?.userName}</span>
                    </Link>
                    <span className="text-sm text-slate-500 h-10">{formatDate(post.createdAt)}</span>
                </div>
                <div className="mx-10 min-h-96 h-auto pt-5 border-t border-t-gray-100">
                    <p className="text-slate-800">{post.body}</p>
                </div>
                {
                    post.link && (
                        <div className="border-y border-y-gray-100 pl-8 py-4">
                            <p className="text-slate-600 font-semibold text-lg">Link externo:</p>
                            <Link href={post.link} className="text-blue-500 underline">{post.link}</Link>
                        </div>
                    )
                }
                <div className="p-5 flex">
                    <VoteBox 
                        postId={post.id}
                        userId={userLogged?.id as string}
                        handleVote={handleVote}
                    />
                </div>
            </div>
        </div>
    );
}