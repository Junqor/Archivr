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
import { searchMediasFiltered } from "@/api/media";
import { formatDateYear } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const commandRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: results,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["searchBar", query],
    queryFn: () => searchMediasFiltered(query),
  });

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim().length) {
      setShowResults(false);
      return;
    }
    setShowResults(true);
    setQuery(value);
  }, 300);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clearSearch = () => {
    setShowResults(false);
    setQuery("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative" ref={commandRef}>
        <Input
          ref={inputRef}
          placeholder="Search..."
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              clearSearch();
              navigate(`/search?q=${query}`);
            }
          }}
          className="peer dark:border-white/70 border-black/70 pl-8 dark:focus:border-white focus:border-black"
        />
        <Search className="peer absolute left-2 top-1/4 size-5 dark:text-white/70 text-black/70 transition-all peer-focus:text-black dark:peer-focus:text-white" />
        {query && showResults && (
          <Command className="absolute right-0 top-full mt-1 h-max w-96 rounded-lg border dark:bg-black bg-white dark:text-white text-black border-black dark:border-white shadow-md">
            <CommandList className="max-h-full">
              <CommandGroup heading="Media">
                {isFetching || isPending ? (
                  <div className="flex justify-center pt-1.5">
                    <LoadingSpinner
                      className="items-center justify-center py-1 text-sm dark:text-white/70 text-black/70"
                      size="small"
                    />
                  </div>
                ) : (
                  !isError &&
                  results.length > 0 && (
                    <>
                      {results.map((media) => (
                        <CommandItem
                          className="cursor-pointer dark:bg-black dark:text-white bg-white text-black"
                          key={media.id}
                          onSelect={() => {
                            clearSearch();
                            navigate(`/media/${media.id}`);
                          }}
                        >
                          <div className="flex h-12 w-full flex-row gap-2">
                            <img
                              src={media.thumbnail_url}
                              className="h-full rounded-md"
                              width="29"
                              height="42"
                            />
                            <p>
                              {media.title}{" "}
                              <span className="text-muted hover:text-black/70">
                                ({formatDateYear(media.release_date)})
                              </span>
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                      <CommandItem className="dark:data-[selected=true]:bg-black data-[selected=true]:bg-white">
                        <Link
                          to={`/search?q=${query}`}
                          className="relative w-full self-center justify-self-center text-center dark:text-white/70 text-black/70 hover:border-none dark:hover:bg-black hover:bg-white hover:underline"
                          onClick={clearSearch}
                        >
                          View all
                        </Link>
                      </CommandItem>
                    </>
                  )
                )}
              </CommandGroup>
              <CommandEmpty>{!isFetching && "No results found."}</CommandEmpty>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  );
}
