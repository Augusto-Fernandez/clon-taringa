import Link from "next/link";

interface ChatCardProps{
    otherUserName: string
    chatId: string;
}

export default async function ChatCard({otherUserName, chatId}:ChatCardProps) {
    return(
        <Link href={"/chat/"+chatId} className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3 space-x-4">
                <span className="font-semibold text-lg">{otherUserName}</span>
            </div>
        </Link>
    );
}
