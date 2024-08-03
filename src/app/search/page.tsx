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

    const totalPostCount = await prisma.post.count({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" } }
            ],
        }
    });
    
    const totalPages = Math.ceil(totalPostCount/pageSize);
    
    return(
        <main className="bg-gradient-to-r from-purple-100 from-5% via-pink-200 via-30% to-emerald-100 to-95% ...">
            <div className="min-h-screen flex justify-center">
                <div className=" min-h-screen w-2/3 bg-slate-300/50 mx-20 rounded-lg justify-center">
                    <div className="bg-slate-400/10 h-[41.25rem] rounded-md mt-10 mx-10 mb-2 p-3">
                        {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard post={post} key={post.id}/>
                                ))
                            ) : (
                                <div className="w-full flex justify-center">
                                    <p 
                                        className="
                                            p-10 text-slate-700/90 text-base
                                            md:text-2xl
                                            lg:text-4xl lg:font-semibold
                                        "
                                    >
                                        No se encontró post
                                    </p>
                                </div>
                            )}
                    </div>
                    <div className="h-14 flex justify-center">
                        {
                            totalPages>1 ? (
                                <PaginationBar 
                                    currentPage={currentPage} 
                                    totalPages={totalPages}
                                    query={query}
                                />
                            ) : (
                                <div className="bg-slate-300/25 hover:bg-slate-400/25 text-slate-500 border border-slate-400 join-item btn">1</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}