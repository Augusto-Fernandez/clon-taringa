import Link from "next/link";

interface ChatCardProps{
    otherUserName: string;
    chatId: string;
    messageUserName: string;
    body: string;
    date: string;
}

export default async function ChatCard({otherUserName, chatId, messageUserName, body, date}:ChatCardProps) {
    return(
        <Link href={"/chat/"+chatId} className="bg-slate-300 h-14 rounded-lg flex justify-between mb-2">
            <div className="p-3 space-x-20 flex">
                <span className="font-semibold text-lg">{otherUserName}</span>
                <p className="text-base pt-1">
                    <span>{messageUserName}</span>: <span>{body}</span>
                </p>
            </div>
            <span className="text-sm p-5">{date}</span>
        </Link>
    );
}
