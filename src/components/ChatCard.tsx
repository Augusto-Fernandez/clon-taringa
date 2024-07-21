"use client"

interface ChatCardProps{
    otherUserName: string;
    chatId: string;
    messageUserName: string;
    body: string;
    date: string;
    notifCount: number;
    userId: string;
    handleChatRedirect:(conversationId: string, userId: string) => Promise<void>;
}

export default function ChatCard({otherUserName, chatId, messageUserName, body, date, notifCount, userId, handleChatRedirect}:ChatCardProps) {
    const formatedComment = body.length > 21 ? body.substring(0, 21) + "..." : body;
    
    return(
        <button onClick={() => handleChatRedirect(chatId, userId)} className=" w-full bg-slate-200/[.55] text-slate-700/90 h-14 rounded-lg flex justify-between mb-2">
            <div className="py-3 pl-3 flex w-11/12 justify-between">
                <div className="space-x-4">
                    <span className="font-semibold text-lg">{otherUserName}</span>
                    {
                        notifCount > 0 && notifCount < 10 && (
                            <span className="badge bg-red-500 text-white border-red-400 mt-1.5">{notifCount}</span>
                        )
                    }
                    {
                        notifCount > 9 && (
                            <span className="badge bg-red-500 text-white border-red-400 mt-1">+9</span>
                        )
                    }
                </div>
                <div className="pt-1 w-2/3 flex justify-start">
                    <p className="text-sm">
                        <span>{messageUserName}</span>: <span>{formatedComment}</span>
                    </p>
                </div>
            </div>
            <span className="text-sm p-5 w-1/6">{date}</span>
        </button>
    );
}
