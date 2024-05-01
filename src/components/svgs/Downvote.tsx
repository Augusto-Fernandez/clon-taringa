interface IconProps {
    className: string
    background: string
    line: string
}

export default function Downvote({className, background, line}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill={background}/>
            <path d="M12 6L12 18M12 18L17 13M12 18L7 13" stroke={line} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );   
};