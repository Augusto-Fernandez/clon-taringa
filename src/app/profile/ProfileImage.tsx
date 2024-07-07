"use client"
import Image from "next/image";
import { useState, useEffect } from "react";

import profilePicPlaceholder from "../../../public/profilePicPlaceholder.png"
import CloseIcon from "@/components/svgs/CloseIcon";
import { storage } from "../services/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface ProfileImageProps{
    image: string;
    userId: string;
    loggedUserId: string;
    handleProfileImage: (userId: string, imageUrl: string) => Promise<void>;
}

export default function ProfileImage({image, userId, loggedUserId, handleProfileImage}:ProfileImageProps){
    const [inputModal, setInputModal] = useState(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null);

    useEffect(() => {
        setInputModal(false);
    }, []);

    const renderInputModal = () => {
        setInputModal(!inputModal);
    }; 

    const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setImageUpload(file);
    };

    const handleUpload = async () => {
        if (imageUpload === null) return;

        const imageRef = ref(storage, `profile-images/${userId}`);

        try{
            await uploadBytes(imageRef, imageUpload);
        }catch(e){
            setInputModal(false);
            alert("Ocurrió un error al subir imagen");
            return console.log(e);
        }

        const imgUrl = await getDownloadURL(imageRef); 

        await handleProfileImage(userId, imgUrl);

        setInputModal(false);
    };

    console.log(image)

    return(
        <div className="flex flex-col">
            <Image src={image || profilePicPlaceholder} alt="Profile picture" width={40} height={40} className="w-20 h-20 rounded-full"/>
            {
                inputModal && userId === loggedUserId ? (
                    <div className="fixed inset-0 z-10 flex items-center justify-center">
                        <div className="flex flex-col bg-slate-300 p-4 space-y-4 items-center rounded-md border-white border-2">
                            <div className="w-full flex justify-end">
                                <button onClick={renderInputModal}>
                                    <CloseIcon
                                        className="w-6 h-6"
                                        line="rgb(239, 68, 68)"
                                    />
                                </button>
                            </div>
                            <p className="text-lg font-bold">Seleccionar imagen</p>
                            <input 
                                onChange={uploadImage} 
                                type="file" 
                                className="file-input file-input-bordered max-w-xs"
                            />
                            <button onClick={handleUpload} className="btn">Cargar</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {
                            userId === loggedUserId && (
                                <button className="bg-white h-4 w-4 rounded-full flex items-center justify-center" onClick={renderInputModal}>+</button>
                            )
                        }
                    </>
                )
            }
        </div>
    );
};
