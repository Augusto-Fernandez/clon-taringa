export default function CreatePost (){
    return(
        <div className="min-h-screen bg-gray-100">
            <div className="mx-60 p-5 space-y-5">
                <h1 className="text-slate-600 font-semibold text-4xl">Crear Post</h1>
                <div className="flex space-x-3">
                    <div className="w-2/3 bg-white rounded-md border border-gray-400">
                        <input type="text" placeholder="Título (obligatorio)" className="input h-14 hover:no-animation focus:outline-none w-full" />
                        <div className="bg-gray-100 pl-4">
                            <div className="flex h-14 p-4 space-x-10">
                                <p className=" text-sm border-l border-gray-200 pl-8">Imagen</p>
                                <p className=" text-sm border-l border-gray-200 pl-8">Video</p>
                                <p className=" text-sm border-l border-gray-200 pl-8">Link</p>
                            </div>
                        </div>
                        <textarea className="textarea w-full min-h-96 max-h-96 hover:no-animation focus:outline-none" placeholder="Contenido del post (obligatorio)"></textarea>
                    </div>
                    <div className="w-1/3 bg-white rounded-md border border-gray-400">
                        <p>Prueba</p>
                    </div>
                </div>
            </div>
        </div>
    );
}