interface IconProps {
    className: string
    background: string
    line: string
}

export default function Upvote({className, background, line}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill={background}/>
            <path d="M12 18L12 6M12 6L7 11M12 6L17 11" stroke={line} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );   
};