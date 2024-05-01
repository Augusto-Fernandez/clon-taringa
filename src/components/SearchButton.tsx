import SearchButtonIcon from "./svgs/SearchButtonIcon";

export default function SearchButton () {
    return (
        <button type="submit" className="btn-ghost h-10 bg-green-500 rounded-lg hover:bg-green-400">
            <SearchButtonIcon
                className="w-9 h-8"
            />
        </button>
    );  
};
