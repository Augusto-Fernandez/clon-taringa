import { Metadata } from "next";

import { prisma } from "../lib/db/prisma";

import PostCard from "@/components/PostCard";

interface SearchPageProps {
    searchParams: { query: string };
}

export function generateMetadata({searchParams: { query }}: SearchPageProps): Metadata {
    return { 
        title: `${query} - Taringa?`,
    };
}

export default async function SearchPage({searchParams: { query }}: SearchPageProps) {
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" } }
            ],
        },
        orderBy: { id: "desc" }
    });
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="flex min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="bg-red-800 min-h-lvh max-h-lvh rounded-md m-10 w-full p-3">
                    {posts.length === 0 ? (
                            <div className="w-full flex justify-center">
                                <p className="p-10 text-6xl font-semibold">No se encontró post</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <PostCard post={post} key={post.id}/>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}