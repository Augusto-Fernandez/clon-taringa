import Link from "next/link";

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    query?: string;
}

export default function PaginationBar({currentPage, totalPages, query}: PaginationBarProps) {
    const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
    const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

    const numberedPageItems: JSX.Element[] = [];

    if(query){
        for (let page = minPage; page <= maxPage; page++) {
            numberedPageItems.push(
                <Link
                    href={"?query="+ query + "&" + "page=" + page}
                    key={page}
                    className={`bg-slate-400/25 text-slate-500 border border-slate-400 hover:bg-slate-500/25 join-item btn ${currentPage === page ? "btn-active pointer-events-none" : ""}`}
                >
                    {page}
                </Link>
            );
        }
    }else{
        for (let page = minPage; page <= maxPage; page++) {
            numberedPageItems.push(
                <Link
                    href={"?page=" + page}
                    key={page}
                    className={`bg-slate-300/25 text-slate-500 border border-slate-400 hover:bg-slate-400/25 join-item btn ${currentPage === page ? "btn-active pointer-events-none" : ""}`}
                >
                    {page}
                </Link>
            );
        }
    }

    return (
        <>
            {
                query ? (
                    <>
                        <div className="join hidden sm:block">
                            {numberedPageItems}
                        </div>
                        <div className="join block sm:hidden">
                            {currentPage > 1 && (
                                <Link href={"?query=" + query + "&" + "page=" + (currentPage - 1)} className="join-item btn">
                                    «
                                </Link>
                            )}
                            <button className="bg-slate-400/25 text-slate-500 border border-slate-400 hover:bg-slate-400/25 join-item btn pointer-events-none">
                                Page {currentPage}
                            </button>
                            {currentPage < totalPages && (
                                <Link href={"?query=" + query + "&" + "page=" + (currentPage + 1)} className="bg-slate-300/25 text-slate-500 border border-slate-400 hover:bg-slate-400/25 join-item btn">
                                    »
                                </Link>
                            )}
                        </div>
                    </>
            ) : (
                <>
                    <div className="join hidden sm:block">
                        {numberedPageItems}
                    </div>
                    <div className="join block sm:hidden">
                        {currentPage > 1 && (
                            <Link href={"?page=" + (currentPage - 1)} className="join-item btn">
                                «
                            </Link>
                        )}
                        <button className="bg-slate-300/25 text-slate-500 border border-slate-400 hover:bg-slate-400/25 join-item btn pointer-events-none">
                            Page {currentPage}
                        </button>
                        {currentPage < totalPages && (
                            <Link href={"?page=" + (currentPage + 1)} className="bg-slate-300/25 text-slate-500 border border-slate-400 hover:bg-slate-400/25 join-item btn">
                                »
                            </Link>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
