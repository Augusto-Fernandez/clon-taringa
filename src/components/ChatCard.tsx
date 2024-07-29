"use client"

interface ChatCardProps{
    otherUserName: string;
    chatId: string;
    body: string;
    date: string;
    notifCount: number;
    userId: string;
    handleChatRedirect:(conversationId: string, userId: string) => Promise<void>;
}

export default function ChatCard({otherUserName, chatId, body, date, notifCount, userId, handleChatRedirect}:ChatCardProps) {
    const formatedComment = body.length > 14 ? body.substring(0, 14) + "..." : body;
    
    return(
        <button onClick={() => handleChatRedirect(chatId, userId)} className=" w-full bg-slate-200/[.55] text-slate-700/90 h-14 rounded-lg flex justify-between mb-2">
            <div className="py-3 pl-3 flex w-11/12 justify-between">
                <div 
                    className="
                        space-x-1 min-w-44
                        md:min-w-48
                        lg:min-w-64
                    "
                >
                    <span 
                        className="
                            text-xs
                            md:text-sm
                            lg:font-semibold lg:text-lg
                        "
                    >
                        {otherUserName}
                    </span>
                    {
                        notifCount > 0 && notifCount < 10 && (
                            <span 
                                className="
                                    badge bg-red-500 text-white text-xs border-red-400 mt-1.5
                                    md:text-sm
                                "
                            >
                                {notifCount}
                            </span>
                        )
                    }
                    {
                        notifCount > 9 && (
                            <span 
                                className="
                                    badge bg-red-500 text-white text-xs border-red-400 mt-1
                                    md:text-sm
                                "
                            >
                                +9
                            </span>
                        )
                    }
                </div>
                <div className="pt-1 w-2/3 flex justify-start">
                    <p 
                        className="
                            text-xs mt-1 ml-1 hidden
                            md:block
                            lg:text-sm lg:mt-0
                        "
                    >
                        {formatedComment}
                    </p>
                </div>
            </div>
            <span 
                className="
                    hidden
                    lg:block lg:text-xs lg:pt-5 lg:w-1/6
                "
            >
                {date}
            </span>
        </button>
    );
}

/*
<div className="pt-1 w-2/3 flex justify-start">
                    <p className="text-sm">
                        <span>{messageUserName}</span>: <span>{formatedComment}</span>
                    </p>
                </div>

    <span className="text-sm p-5 w-1/6">{date}</span>
 */