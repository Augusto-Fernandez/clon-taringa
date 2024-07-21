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
        if (file && !["image/jpeg", "image/jpg"].includes(file.type)) {
            alert("Solo se permiten imágenes de tipo JPG o JPEG");
            setImageUpload(null);
            setInputModal(false);
        } else {
            setImageUpload(file);
        }
    };

    const handleUpload = async () => {
        //verifica si que cargó una imagen
        if (imageUpload === null){
            setInputModal(false);
            return;
        }

        //hace referencia a la colección y el nombre del archivo donde se va a cargar
        const imageRef = ref(storage, `profile-images/${userId}`);

        //hace una instancia de FileReader para leer el contenido cargado
        const reader = new FileReader();

        //define la función que se ejecutará cuando la lectura del archivo sea exitosa
        reader.onload = async (e) => {
            //obtiene el resultado de la lectura del archivo y lo asigna a la variable result.
            const result = e.target?.result as string;
            if (!result) {
                alert("Ocurrió un error al leer la imagen");
                return;
            }

            //crea una nueva instancia de Image y asigna el resultado de la lectura del archivo
            const img = new window.Image();
            img.src = result;

            //define la función que se ejecutará cuando la imagen se haya cargado
            img.onload = async () => {
                //crea el elemento canvas.
                const canvas = document.createElement('canvas');
                //toma el contexto 2d del canvas
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    alert("Ocurrió un error al leer la imagen");
                    return;
                }

                //establece las dimensiones del canvas a 360x360 píxeles
                canvas.width = 360;
                canvas.height = 360;

                //calcula la relación de aspecto de la imagen
                // aspectRatio > 1, es mas ancha
                // aspectRatio < 1, es mas alta
                // aspectRatio = 1, es mas cuadrada
                const aspectRatio = img.width / img.height;
                //srcX y srcY representan las coordenadas del punto superior izquierdo
                //srcWidht y srcHeight representan las dimensiones de la imagen original
                let srcX, srcY, srcWidth, srcHeight;

                if (aspectRatio > 1) {// en el caso de que sea mas ancha
                    srcHeight = img.height;
                    srcWidth = img.height;
                    srcX = (img.width - srcWidth) / 2;//centra el recorte horizontalmente 
                    srcY = 0; //el recorte comienza desde el borde superior
                } else { // en caso de que sea mas alta o cuadrada 
                    srcWidth = img.width;
                    srcHeight = img.width;
                    srcX = 0;//el recorte comienza desde el borde izquierdo
                    srcY = (img.height - srcHeight) / 2; //centra el recorte verticalmente
                }

                //dibuja la imagen en el canvas, recortándola al centro con las dimensiones especificadas
                ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, 360, 360);

                //convierte el contenido del canvas a un Blob en formato JPEG.
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        alert("Ocurrió un error al leer la imagen");
                        return;
                    }

                    //Hace el upload a Firebase
                    try {
                        await uploadBytes(imageRef, blob);
                    } catch (e) {
                        setImageUpload(null);
                        alert("Ocurrió un error al subir imagen");
                        return console.log(e);
                    }

                    //consige el URL de la imagen y se la pasa al servidor para que actualice el campo image de user
                    const imgUrl = await getDownloadURL(imageRef);
                    await handleProfileImage(userId, imgUrl);

                    setImageUpload(null);
                    setInputModal(false);
                }, 'image/jpeg'); //define que se tiene que codificar como un JPEG
            };
        };

        //esto ejecuta toda la función que se declaró en reader.onload()
        reader.readAsDataURL(imageUpload);
    };

    return(
        <div className="flex flex-col">
            <Image src={image || profilePicPlaceholder} alt="Profile picture" width={40} height={40} className="w-20 h-20 rounded-full"/>
            {
                inputModal && userId === loggedUserId ? (
                    <div className="fixed inset-0 z-10 flex items-center justify-center">
                        <div className="flex flex-col bg-slate-200/85 p-4 space-y-4 items-center rounded-md border-white border-2">
                            <div className="w-full flex justify-end">
                                <button onClick={renderInputModal}>
                                    <CloseIcon
                                        className="w-6 h-6"
                                        line="rgb(239, 68, 68)"
                                    />
                                </button>
                            </div>
                            <p className="text-lg font-bold text-slate-700/90">Seleccionar imagen</p>
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
                                <button className="bg-slate-400/60 hover:bg-slate-400/40 text-white h-4 w-4 rounded-full flex items-center justify-center" onClick={renderInputModal}>+</button>
                            )
                        }
                    </>
                )
            }
        </div>
    );
};
