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

export type TMovie = {
  id: number;
  title: string;
  description: string;
  release_date: string;
  age_rating: string;
  thumbnail_url: string;
  rating: number;
  genre: string;
};

const searchMovies = async (query: string) => {
  const url = import.meta.env.VITE_API_URL + "/movies/search";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = (await response.json()) satisfies {
      status: string;
      movies: TMovie[];
    };

    if (data.status !== "success") {
      throw new Error("Failed to fetch movies");
    }

    return data.movies;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback(async (value) => {
    setIsLoading(true);
    const searchResults = await searchMovies(value);
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
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8 peer border-white/70 focus:border-white"
        />
        <Search className="text-white/70 peer peer-focus:text-white absolute left-2 top-2.5 h-4 w-4 transition-all" />
        {query && showResults && (
          <Command className="absolute right-0 mt-1 text-white bg-black border rounded-lg shadow-md h-max w-96 top-full">
            <CommandList>
              <CommandGroup heading="Movies">
                {results.map((movie) => (
                  <CommandItem
                    className="text-white bg-black"
                    key={movie.id}
                    onSelect={() => {
                      setQuery("");
                      navigate(`/movies/${movie.id}`);
                    }}
                  >
                    {movie.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty>
                {isLoading ? "Searching..." : "No results found."}
              </CommandEmpty>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  );
}
