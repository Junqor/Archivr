import SearchBar from "./components/searchBarBrowse";

export default function BrowsePage() {
  return (
    <>
      <div className="max-w-960px pt-60px pr-0px pb-20px pl-0px flex flex-col items-center gap-[16px] self-stretch">
        <h1>
          Search <span className="text-[#5616EC]">Archivr</span>
        </h1>
        <p>Type in a Movie or TV Show to find what you're looking for.</p>
        <SearchBar />
      </div>
    </>
  );
}
