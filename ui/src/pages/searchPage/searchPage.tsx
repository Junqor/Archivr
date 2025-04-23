import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchMediasFiltered } from "@/api/media";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  SwapVertRounded,
} from "@mui/icons-material";
import { Separator } from "@radix-ui/react-separator";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

export default function SearchPage() {
  const [offSet, setOffSet] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [_, setSearchParams] = useSearchParams();
  const { sortBy, order, query } = mainSearchParams();

  const {
    data: results,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["search", query, offSet, sortBy, order],
    queryFn: () => searchMediasFiltered(query, 30, offSet, sortBy, order),
  });

  useEffect(() => {
    setOffSet(0);
  }, [query]);

  const handleSearch = useDebouncedCallback((val: string) => {
    setSearchParams((prev) => {
      prev.set("q", val);
      return prev;
    });
  }, 300);

  const handleChangeSortBy = (
    newSortBy: "alphabetical" | "release_date" | "popularity",
  ) => {
    setSearchParams((prev) => {
      prev.set("sort", newSortBy);
      return prev;
    });
  };

  const handleChangeOrder = (newOrder: "asc" | "desc") => {
    setSearchParams((prev) => {
      prev.set("order", newOrder);
      return prev;
    });
  };

  if (isError) throw "500";

  return (
    <>
      <div className="max-w-960px pt-60px pr-0px pb-20px pl-0px flex flex-col items-center gap-[16px] self-stretch">
        <h1>
          Search <span className="text-[#5616EC]">Archivr</span>
        </h1>
        <p>Type in a Movie or TV Show to find what you're looking for.</p>
        <>
          <div className="mx-auto w-full max-w-2xl">
            <div className="relative" ref={inputRef}>
              <Input
                name="disable-password-autofill"
                placeholder="Start typing to see results..."
                defaultValue={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="peer dark:border-white/70 pl-2 dark:focus:border-white border-black/70 focus:border-black"
                autoFocus
              />
              <Search className="peer absolute right-2 top-1/4 size-5 dark:text-white/70 text-black/70 transition-all peer-focus:text-black dark:peer-focus:text-white" />
            </div>
          </div>
          {query.length !== 0 && (
            <div className="max-w-960px flex items-center justify-between self-stretch">
              {results?.length === 0 ? (
                <h3> No Search Results </h3>
              ) : (
                <h3> Results for "{query}" </h3>
              )}

              <form className="flex items-center gap-5">
                <fieldset className="flex items-center gap-3">
                  <h4>
                    <label htmlFor="sort">Sort by</label>
                  </h4>
                  <select
                    name="sort"
                    id="sort"
                    value={sortBy}
                    onChange={(e) => handleChangeSortBy(e.target.value as any)}
                    className="border-b-2 dark:border-white border-black dark:bg-black bg-white px-2 py-1 hover:cursor-pointer"
                  >
                    <option value="alphabetical">Alphabetical</option>
                    <option value="release_date">Release Date</option>
                    <option value="popularity">Popularity</option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      handleChangeOrder(order === "asc" ? "desc" : "asc")
                    }
                    className={`flex items-center justify-center p-1 transition-transform duration-300 ${
                      order === "asc" ? "rotate-0" : "rotate-180"
                    }`}
                  >
                    <SwapVertRounded />
                  </button>
                </fieldset>
              </form>
            </div>
          )}

          <section className="mt-6 grid w-full grid-cols-3 gap-4 md:grid-cols-5">
            {isLoading || isPending
              ? [...Array(30)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="aspect-[2/3] h-full w-full rounded-sm outline outline-1 outline-white/10"
                  />
                ))
              : results.map((media) => (
                  <ThumbnailPreview key={media.id} media={media} />
                ))}
          </section>

          {results && results.length > 0 && (
            <div className="mt-4 flex w-full justify-center gap-3">
              <button
                onClick={() => setOffSet((prev) => Math.max(prev - 30, 0))}
                className="flex items-center gap-3"
                disabled={offSet <= 0}
              >
                <div
                  className={`flex items-center justify-center rounded-md border p-1 transition-all duration-300 ${offSet <= 1 ? "cursor-not-allowed border-muted text-muted" : "dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white border-black dark:border-white"}`}
                >
                  <ChevronLeftRounded />
                </div>
                <h3
                  className={`${offSet <= 0 ? "cursor-not-allowed text-muted" : ""}`}
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
                <h3 className="dark:text-white text-black">Next</h3>
                <div className="flex items-center justify-center rounded-md border p-1 transition-all duration-300 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white border-black dark:border-white">
                  <ChevronRightRounded />
                </div>
              </button>
            </div>
          )}
        </>
      </div>
    </>
  );
}

function mainSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // useSearchParams for sorting and ordering
  const sortBy = searchParams.get("sort") as
    | "alphabetical"
    | "release_date"
    | "popularity";
  const order = searchParams.get("order") as "asc" | "desc";
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (
      sortBy !== "alphabetical" &&
      sortBy !== "release_date" &&
      sortBy !== "popularity"
    ) {
      setSearchParams((prev) => {
        prev.set("sort", "popularity"); // default to popularity
        return prev;
      });
    }

    if (order !== "asc" && order !== "desc") {
      setSearchParams((prev) => {
        prev.set("order", "desc"); // default to descending order
        return prev;
      });
    }
  }, [sortBy, order, searchParams]);

  return { sortBy, order, query };
}
