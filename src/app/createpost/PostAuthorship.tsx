"use client";

import { useState } from "react";

export default function PostAuthorship (){
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return(
        <>
        <div className="flex p-4 space-x-3">
            <input 
                name="autor"
                type="checkbox"
                className="checkbox"
                checked={isChecked} 
                onChange={handleCheckboxChange}  
            />
            <label className="text-slate-600 text-sm">El post es de mi autoria</label> 
        </div>
            <label className="text-slate-600 pl-4 py-2 text-sm">Acreditar informacion de terceros utilizada.</label>
            <input 
                name="autor"
                required
                type="text" 
                placeholder="http://" 
                className="input h-8 hover:no-animation focus:outline-none w-72 border border-gray-300 ml-4 rounded"
                disabled={isChecked} 
            />
        </>
    );
}