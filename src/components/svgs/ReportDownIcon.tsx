interface IconProps {
    className: string
    line: string
}

export default function ReportDownIcon({className, line}:IconProps) {
    return(
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="none"/>
            <path d="M17 9.5L12 14.5L7 9.5" stroke={line} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );   
};
