import SearchButtonIcon from "./svgs/SearchButtonIcon";

interface SearchButtonProps {
    className:string;
    svgSize: string;
}

export default function SearchButton ({className, svgSize}:SearchButtonProps) {
    return (
        <button type="submit" className={`flex items-center justify-center ${className}`}>
            <SearchButtonIcon
                className={svgSize}
            />
        </button>
    );  
};
