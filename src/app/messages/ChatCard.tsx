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
    return(
        <button onClick={() => handleChatRedirect(chatId, userId)} className=" w-full bg-slate-300 h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3 space-x-7 flex">
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
                <p className="text-base pt-1">
                    <span>{messageUserName}</span>: <span>{body}</span>
                </p>
            </div>
            <span className="text-sm p-5">{date}</span>
        </button>
    );
}
