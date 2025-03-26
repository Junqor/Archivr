import SearchBar from "./components/searchBarBrowse";

export default function BrowsePage() {
  return (
    <>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-2 sm:max-w-[960px]">
        <h1>
          Search <span className="text-[#5616EC]">Archivr</span>
        </h1>
        <p>Type in a Movie or TV Show to find what you're looking for.</p>
        <SearchBar />
      </div>
    </>
  );
}
