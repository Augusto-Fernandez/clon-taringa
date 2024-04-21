interface IconProps {
    className: string
}

export default function ResponseIcon({className}:IconProps){
    return(
        <svg className={className} viewBox="0 0 24 24" fill="rgb(148, 163, 184)" transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                <g id="SVGRepo_tracerCarrier" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier"> 
                    <g clipPath="url(#clip0_15_207)"> 
                    <rect width="24" height="24" fill="white"/> 
                    <path d="M19.4422 10.3492L14.8796 5.02623C14.5775 4.67378 14 4.88743 14 5.35163V8C11 8 4 11 4 20C6 15 10 14 14 14V16.6484C14 17.1126 14.5775 17.3262 14.8796 16.9738L19.4422 11.6508C19.7632 11.2763 19.7632 10.7237 19.4422 10.3492Z" 
                    stroke="rgb(148, 163, 184)" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/> 
                </g> 
            </g>
        </svg>
    );
}