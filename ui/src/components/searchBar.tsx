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

const searchMedia = async (query: string) => {
  const url = import.meta.env.VITE_API_URL + "/search";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const data = (await response.json()) satisfies {
      status: string;
      media: TMedia[];
    };

    if (data.status !== "success") {
      throw new Error("Failed to fetch media");
    }

    return data.media;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback(async (value) => {
    const searchResults = await searchMedia(value);
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
    <div className="w-full max-w-sm mx-auto">
      <div className="relative" ref={inputRef}>
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setIsLoading(true);
            handleSearch(e.target.value);
          }}
          className="pl-8 peer border-white/70 focus:border-white"
        />
        <Search className="text-white/70 peer peer-focus:text-white absolute left-2 top-2.5 h-4 w-4 transition-all" />
        {query && showResults && (
          <Command className="absolute right-0 mt-1 text-white bg-black border rounded-lg shadow-md h-max w-96 top-full">
            <CommandList>
              <CommandGroup heading="Media">
                {results.map((media) => (
                  <CommandItem
                    className="text-white bg-black"
                    key={media.id}
                    onSelect={() => {
                      setQuery("");
                      navigate(`/media/${media.id}`);
                    }}
                  >
                    {media.title}
                  </CommandItem>
                ))}
                {isLoading && (
                  <div className="flex justify-center pt-1.5">
                    <LoadingSpinner
                      className="items-center justify-center py-1 text-sm text-white/70"
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
