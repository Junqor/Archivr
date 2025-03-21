import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { getGenres, getPopularMediaGenre, getMediaGenre } from "@/api/genre";
import HeroMediaCarousel from "@/components/heroMediaCarousel";
import { useQuery } from "@tanstack/react-query";
import { TGenre } from "@/types/genre";
import { useEffect } from "react";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  SwapVertRounded,
} from "@mui/icons-material";
import { LoadingScreen } from "../loadingScreen";

export default function GenrePage() {
  const [_, setSearchParams] = useSearchParams();
  const { genre } = useParams();
  const { sortBy, order, page } = useGenreSearchParams();

  // Fetch genres
  const {
    data: genres,
    isLoading: isGenresLoading,
    error: genresError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    select: (data) => data as unknown as TGenre[], // Ensure genres is typed correctly
  });

  // **Find genreObj before any conditional return**
  const genreObj = genres?.find((g: TGenre) => g.slug === genre);

  // Fetch popular media for the genre (this hook should always run)
  const {
    data: media,
    isLoading: isMediaLoading,
    error: mediaError,
  } = useQuery({
    queryKey: ["popularMediaGenre", genreObj?.genre],
    queryFn: () => getPopularMediaGenre(genreObj?.genre || ""),
    refetchOnWindowFocus: false,
    enabled: !!genreObj, // Ensure the query runs only if genre is valid
  });

  // Fetch media for the genre with sorting and ordering
  const {
    data: mediaList,
    isFetching,
    isPending,
    error,
  } = useQuery({
    queryKey: ["popularMediaGenre", genreObj?.genre, page, sortBy, order],
    queryFn: () =>
      getMediaGenre(genreObj?.genre || "", page * PAGE_SIZE, sortBy, order),
    refetchOnWindowFocus: false,
    enabled: !!genreObj && !isNaN(page) && !!sortBy && !!order, // Ensure the query runs only if genre is valid
  });

  const PAGE_SIZE = 30;

  const handleChangeSortBy = (
    newSortBy: "alphabetical" | "release_date" | "popularity",
  ) => {
    setSearchParams((prev) => {
      prev.set("sort", newSortBy);
      return prev;
    });
    handleChangePage(0);
  };

  const handleChangeOrder = (newOrder: "asc" | "desc") => {
    setSearchParams((prev) => {
      prev.set("order", newOrder);
      return prev;
    });
    handleChangePage(0);
  };

  const handleChangePage = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  // Now return JSX conditionally
  if (isGenresLoading || isMediaLoading) return <LoadingScreen />;
  if (genresError || error || mediaError)
    return <p>An unexpected error occurred.</p>;
  if (!genreObj) return <Navigate to="/404" />;

  return (
    <>
      <section className="flex w-full flex-col justify-start gap-3">
        <section className="h-full">
          <HeroMediaCarousel media={media} />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <section className="flex w-full flex-row items-center justify-between">
          <h1 className="text-4xl font-bold">{genreObj.genre}</h1>
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
                className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
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
        </section>
      </section>
      <section className="mt-6 grid w-full grid-cols-3 gap-4 md:grid-cols-5">
        {isFetching || isPending
          ? [...Array(30)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[2/3] h-full w-full rounded-sm outline outline-1 outline-white/10"
              />
            ))
          : mediaList.map((mediaItem) => (
              <ThumbnailPreview key={mediaItem.id} media={mediaItem} />
            ))}
      </section>
      <section className="mt-5 flex w-full justify-center gap-3">
        <button
          onClick={() => handleChangePage(Math.max(0, page - 1))}
          disabled={page === 0}
          className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${page === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
        >
          <ChevronLeftRounded />
        </button>
        <button
          onClick={() => handleChangePage(page + 1)}
          disabled={!mediaList || mediaList.length < PAGE_SIZE} // Disable if no more media
          className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${!mediaList || mediaList.length < PAGE_SIZE ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
        >
          <ChevronRightRounded />
        </button>
      </section>
    </>
  );
}

function useGenreSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // useSearchParams for sorting and ordering
  const sortBy = searchParams.get("sort") as
    | "alphabetical"
    | "release_date"
    | "popularity";
  const order = searchParams.get("order") as "asc" | "desc";
  const page = parseInt(searchParams.get("page") || "0");

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

    if (isNaN(page)) {
      setSearchParams((prev) => {
        prev.set("page", "0");
        return prev;
      });
    }
  }, [sortBy, order, page, searchParams]);

  return { sortBy, order, page };
}
