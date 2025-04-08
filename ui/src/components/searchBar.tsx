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
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./ui/loading-spinner";
import { TMedia } from "@/types/media";
import { searchMedias } from "@/api/media";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback(async (value) => {
    const searchResults = await searchMedias(value);
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
          className="peer dark:border-white/70 pl-8 dark:focus:border-white border-black/70 focus:border-black"
        />
        <Search className="peer absolute left-2 top-1/4 size-5 dark:text-white/70 text-black/70 transition-all dark:peer-focus:text-white peer-focus:text-black" />
        {query && showResults && (
          <Command className="absolute right-0 top-full mt-1 h-max w-96 rounded-lg border dark:bg-black dark:text-white bg-white text-black dark:border-white border-black shadow-md">
            <CommandList>
              <CommandGroup heading="Media">
                {results.map((media) => (
                  <CommandItem
                    className="dark:bg-black dark:text-white bg-white text-black data-[selected=true]:bg-purple data-[selected=true]:text-white dark:data-[selected=true]:bg-purple dark:data-[selected=true]:text-white"
                    key={media.id}
                    onSelect={() => {
                      setQuery("");
                      navigate(`/media/${media.id}`);
                    }}
                  >
                    {media.title} <span className="hidden">{media.id}</span>
                  </CommandItem>
                ))}
                {isLoading && (
                  <div className="flex justify-center pt-1.5">
                    <LoadingSpinner
                      className="items-center justify-center py-1 text-sm dark:text-white/70 text-black/70"
                      size="small"
                    />
                  </div>
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
