interface IconProps {
    className: string
    line: string
}

export default function CloseIcon({className, line}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="white"/>
            <path d="M7 17L16.8995 7.10051" stroke={line} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7.00001L16.8995 16.8995" stroke={line} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );   
};
