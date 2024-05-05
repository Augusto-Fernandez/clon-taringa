import { Metadata } from "next";

import { prisma } from "../lib/db/prisma";

import PostCard from "@/components/PostCard";
import PaginationBar from "@/components/PaginationBar";

interface SearchPageProps {
    searchParams: { query: string, page: string };
}

export function generateMetadata({searchParams: { query }}: SearchPageProps): Metadata {
    return { 
        title: `${query} - Taringa?`,
    };
}

export default async function SearchPage({searchParams: { query, page = "1" }}: SearchPageProps) {
    const currentPage = parseInt(page);
    const pageSize = 10;
    
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" } }
            ],
        },
        orderBy: { id: "desc" },
        skip: (currentPage-1)*pageSize,
        take: pageSize
    });

    const totalPostCount = posts.length;
    const totalPages = Math.ceil(totalPostCount/pageSize);
    
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className=" min-h-screen w-2/3 bg-slate-300 mx-20 rounded-lg justify-center">
                <div className="bg-red-800 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
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
                <div className="h-14 flex justify-center">
                    {
                        totalPages>1 ? (
                            <PaginationBar 
                                currentPage={currentPage} 
                                totalPages={totalPages}
                            />
                        ) : (
                            <div className="join-item btn">1</div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}