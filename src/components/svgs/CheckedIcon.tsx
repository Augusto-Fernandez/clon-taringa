interface IconProps {
    className: string
}

export default function CheckedIcon({className}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path 
                d="M5 13.3636L8.03559 16.3204C8.42388 16.6986 9.04279 16.6986 9.43108 16.3204L19 7" 
                stroke="grey" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );   
};
