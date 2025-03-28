import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Link, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../../components/ui/loading-spinner";
import { TMedia } from "@/types/media";
import { searchMediasFiltered } from "@/api/media";
import { formatDateYear } from "@/utils/formatDate";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback(async (value) => {
    const searchResults = await searchMediasFiltered(value);
    setResults(searchResults);
    setIsLoading(false);
  }, 300);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      setShowResults(true);
      debouncedSearch(value);
    } else {
      setShowResults(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative" ref={inputRef}>
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setIsLoading(true);
            handleSearch(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setQuery("");
              navigate(`/search?q=${query}`);
            }
          }}
          className="peer border-white/70 pl-8 focus:border-white"
        />
        <Search className="peer absolute left-2 top-1/4 size-5 text-white/70 transition-all peer-focus:text-white" />
        {query && showResults && (
          <Command className="absolute right-0 top-full mt-1 h-max w-96 rounded-lg border bg-black text-white shadow-md">
            <CommandList className="max-h-full">
              <CommandGroup heading="Media">
                {results.map((media) => (
                  <CommandItem
                    className="cursor-pointer bg-black text-white"
                    key={media.id}
                    onSelect={() => {
                      setQuery("");
                      2;
                      navigate(`/media/${media.id}`);
                    }}
                  >
                    <div className="flex h-12 w-full flex-row gap-2">
                      <img src={media.thumbnail_url} className="h-full" />
                      <p>
                        {media.title}{" "}
                        <span className="text-muted hover:text-black/70">
                          ({formatDateYear(media.release_date)})
                        </span>
                      </p>
                    </div>
                  </CommandItem>
                ))}
                {isLoading ? (
                  <div className="flex justify-center pt-1.5">
                    <LoadingSpinner
                      className="items-center justify-center py-1 text-sm text-white/70"
                      size="small"
                    />
                  </div>
                ) : (
                  results.length && (
                    <CommandItem className="data-[selected=true]:bg-black">
                      <Link
                        to={`/search?q=${query}`}
                        className="relative w-full self-center justify-self-center text-center text-white/70 hover:border-none hover:bg-black hover:underline"
                        onClick={() => setQuery("")}
                      >
                        View all
                      </Link>
                    </CommandItem>
                  )
                )}
              </CommandGroup>
              <CommandEmpty>{!isLoading && "No results found."}</CommandEmpty>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  );
}
