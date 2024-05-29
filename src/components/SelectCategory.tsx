"use client";

import { useState } from "react";

interface SelectCategotyProps {
    className: string
}

export default function SelectCategoty ({className}:SelectCategotyProps){
    const [categoria, setCategoria] = useState('');

    const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoria(event.target.value);
    };

    return(
        <>
            <select 
                name="categoria"
                required
                value={categoria}
                onChange={handleCategoriaChange} 
                className={className}
            >
                <option disabled value="" className="font-sans dropdown-content">Seleccionar</option>
                <option value="Anime y Manga" className="font-sans dropdown-content">Anime y Manga</option>
                <option value="Arte" className="font-sans dropdown-content">Arte</option>
                <option value="Deportes" className="font-sans dropdown-content">Deportes</option>
                <option value="Economia" className="font-sans dropdown-content">Economia</option>
                <option value="Humor" className="font-sans dropdown-content">Humor</option>
                <option value="Juegos" className="font-sans dropdown-content">Juegos</option>
                <option value="Musica" className="font-sans dropdown-content">Musica</option>
                <option value="Noticias" className="font-sans dropdown-content">Noticias</option>
                <option value="Offtopic" className="font-sans dropdown-content">Offtopic</option>
                <option value="Politica" className="font-sans dropdown-content">Politica</option>
                <option value="Recetas y Cocina" className="font-sans dropdown-content">Recetas y Cocina</option>
                <option value="Reseñas" className="font-sans dropdown-content">Reseñas</option>
                <option value="Turismo" className="font-sans dropdown-content">Turismo</option>
                <option value="TV, Cine y Series" className="font-sans dropdown-content">TV, Cine y Series</option>
                <option value="Vehiculos" className="font-sans dropdown-content">Vehiculos</option>
                <option value="Video" className="font-sans dropdown-content">Video</option>                   
            </select>
        </>
    );
}
