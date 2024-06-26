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
        <button onClick={handleClickChatButton} className="btn">Enviar Mensaje</button>
    );
}