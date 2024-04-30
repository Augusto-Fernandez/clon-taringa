"use client"

import FavoritedIcon from "@/components/svgs/FavoritedIcon";
import { useEffect, useState } from "react";

interface SavedPostBoxProps {
    postId: string
    userId: string
    isSaved: boolean
    savePost: (postId: string, userId: string) => Promise<void>;
}

export default function SavedPostBox({postId, userId, isSaved, savePost}:SavedPostBoxProps){
    const [saved, setSaved] = useState(isSaved);

    useEffect(() => {
        setSaved(isSaved);
    }, [isSaved]);

    const handleSaveClick = async () => {
        await savePost(postId, userId);
        setSaved(!saved);
    };
    
    return(
        <button onClick={handleSaveClick}>
            {
                saved ? (
                    <FavoritedIcon
                        className="w-8 h-8 rounded mr-1"
                        background="rgb(251, 191, 36)"
                        line="white"
                    />
                ) : (
                    <FavoritedIcon
                        className="w-8 h-8"
                        background="white"
                        line="rgb(251, 191, 36)"
                    />
                )
            }
        </button>
    );
};
