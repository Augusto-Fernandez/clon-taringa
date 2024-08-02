"use client"

interface CreateChatButtonProps {
    userId: string;
    toUserId: string;
    handleCreateChat: (userId: string, toUserId: string) => Promise<void>;
}

export default function CreateChatButton({userId, toUserId, handleCreateChat}:CreateChatButtonProps){
    const handleClickChatButton = async () => {
        await handleCreateChat(userId, toUserId);
    };
    
    return(
        <button 
            onClick={handleClickChatButton} 
            className="
                btn bg-slate-300/50 border border-slate-300 hover:bg-slate-400/50 text-slate-700/70 text-xs
                md:text-sm
                lg:text-base
            "
        >
            Enviar Mensaje
        </button>
    );
}