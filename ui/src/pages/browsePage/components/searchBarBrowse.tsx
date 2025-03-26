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
import { LoadingSpinner } from "../../../components/ui/loading-spinner";
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
      //setShowResults(true);
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

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      //console.log("Enter key pressed");
      const data = results;
      navigate("/browse", { state: data });
      setShowResults(true);
      // Perform action
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative" ref={inputRef}>
        <Input
          placeholder="Start typing to see results..."
          value={query}
          onChange={(e) => {
            setIsLoading(true);
            handleSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="peer border-white/70 pl-2 focus:border-white"
        />
        <Search className="peer absolute right-2 top-1/4 size-5 text-white/70 transition-all peer-focus:text-white" />
      </div>
    </div>
  );
}
