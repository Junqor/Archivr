import SearchBar from "./components/searchBarBrowse";
import { useLocation } from "react-router-dom";
import { TMedia } from "@/types/media";
import ThumbnailPreview from "@/components/ThumbnailPreview";

export default function BrowsePage() {
  const location = useLocation();
  const data = location.state as TMedia[];

  return data ? (
    <>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-2 sm:max-w-[960px]">
        <h1>
          Search <span className="text-[#5616EC]">Archivr</span>
        </h1>
        <p>Type in a Movie or TV Show to find what you're looking for.</p>
        <SearchBar />
        <section className="mt-6 grid w-full grid-cols-3 gap-4 md:grid-cols-5">
          {data.map((media) => (
            <ThumbnailPreview key={media.id} media={media} />
          ))}
        </section>
      </div>
    </>
  ) : (
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
