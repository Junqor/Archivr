import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TMedia } from "@/types/media";
import { getMediaBackground, searchMedias } from "@/api/media";
import { useDebouncedCallback } from "use-debounce";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { Separator } from "@radix-ui/react-separator";
import ThumbnailPreview from "@/components/ThumbnailPreview";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMedia[]>([]);
  const [offSet, setOffSet] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /*
  const debouncedSearch = useDebouncedCallback(async (value) => {
    const searchResults = await searchMedias(value);
    setResults(searchResults);

    setIsLoading(false);
  }, 300);
*/

  const fetchSearchResults = async (query: string, newOffset: number) => {
    if (!query) return;
    const results = await searchMedias(query, 30, newOffset);
    const media = await Promise.all(
      results.map(async (media: TMedia) => {
        const background = await getMediaBackground(media.id);
        return { ...media, background };
      }),
    );
    setResults(media);
  };

  const debouncedSearch = useDebouncedCallback((query, newOffset) => {
    fetchSearchResults(query, newOffset);
  }, 500);

  useEffect(() => {
    setOffSet(0);
  }, [query]);

  useEffect(() => {
    debouncedSearch(query, offSet);
  }, [query, offSet]);
  /*
  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      //console.log("Enter key pressed");
      const data = results;
      navigate("/browse", { state: data });
      setShowResults(true);
      // Perform action
    }
  };
  */

  return (
    <>
      <div className="mx-auto w-full max-w-2xl" ref={inputRef}>
        <Input
          placeholder="Start typing to see results..."
          value={query}
          onChange={(e) => {
            setIsLoading(true);
            setQuery(e.target.value);
          }}
          // onKeyDown={handleKeyDown}
          className="peer border-white/70 pl-2 focus:border-white"
        />
        <Search className="peer absolute right-2 top-1/4 size-5 text-white/70 transition-all peer-focus:text-white" />
      </div>
      <section className="flex">
        {results.length === 0 ? (
          <h3> No Search Results </h3>
        ) : (
          <h3> Results for "{query}" </h3>
        )}
      </section>
      <section className="mt-6 grid w-full grid-cols-3 gap-4 md:grid-cols-5">
        {results.map((media) => (
          <ThumbnailPreview key={media.id} media={media} />
        ))}
      </section>

      {results.length > 0 && (
        <div className="mt-4 flex w-full justify-center gap-3">
          <button
            onClick={() => setOffSet((prev) => Math.max(prev - 30, 0))}
            className="flex items-center gap-3"
            disabled={offSet <= 0}
          >
            <div
              className={`flex items-center justify-center rounded-md border p-1 transition-all duration-300 ${offSet <= 1 ? "cursor-not-allowed border-muted text-muted" : "hover:bg-white hover:text-black"}`}
            >
              <ChevronLeftRounded />
            </div>
            <h3
              className={`${offSet <= 0 ? "cursor-not-allowed text-muted" : "text-white"}`}
            >
              Previous
            </h3>
          </button>
          <Separator orientation="vertical" className="h-auto" decorative />
          <button
            onClick={() => setOffSet((prev) => prev + 30)}
            className="flex items-center gap-3"
            disabled={results.length < 30}
          >
            <h3 className="text-white">Next</h3>
            <div className="flex items-center justify-center rounded-md border p-1 transition-all duration-300 hover:bg-white hover:text-black">
              <ChevronRightRounded />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
