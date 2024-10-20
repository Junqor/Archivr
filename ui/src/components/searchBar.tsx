import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  return (
    <div className="relative max-w-lg ml-5 mr-1">
      <input
        type="text"
        className="w-full min-w-32 py-1 pl-12 pr-4 text-sm text-black rounded-[0.9rem] bg-gray focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-2">
        <SearchIcon className="text-white size-5" />
      </div>
    </div>
  );
}
