import { useParams, Navigate } from "react-router-dom";
import { getGenres, getPopularMediaGenre, getMediaGenre } from "@/api/genre";
import HeroMediaCarousel from "@/components/heroMediaCarousel";
import { useQuery } from "@tanstack/react-query";
import { TGenre } from "@/types/genre";
import { TMedia } from "@/types/media";
import { useState, useEffect } from "react";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  SwapVertRounded,
} from "@mui/icons-material";

export default function GenrePage() {
  const { genre } = useParams();

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

  // State for sorting and ordering
  const [sortBy, setSortBy] = useState<
    "alphabetical" | "release_date" | "rating"
  >("alphabetical");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [offset, setOffset] = useState<number>(0);
  const [mediaList, setMediaList] = useState<TMedia[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const PAGE_SIZE = 30;

  useEffect(() => {
    setOffset(0);
  }, [sortBy, order]);

  // Fetch media for the genre with sorting and ordering
  useEffect(() => {
    if (!genreObj) return;

    setIsFetching(true);
    getMediaGenre(genreObj.genre, offset, sortBy, order)
      .then((data) => setMediaList(data))
      .catch((err) => console.error("Failed to fetch media", err))
      .finally(() => setIsFetching(false));
  }, [genreObj, sortBy, order, offset]);

  // Now return JSX conditionally
  if (isGenresLoading) return <p>Loading genres...</p>;
  if (genresError) return <p>Error loading genres.</p>;
  if (!genreObj) return <Navigate to="/404" />;
  if (isMediaLoading) return <p>Loading media...</p>;
  if (mediaError) return <p>Error loading media.</p>;

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
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border-b-2 border-white bg-black px-2 py-1"
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="release_date">Release Date</option>
                <option value="rating">Rating</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  setOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="flex items-center justify-center p-1 transition-transform duration-300"
                style={{ transform: `rotate(${order === "asc" ? 0 : 180}deg)` }}
              >
                <SwapVertRounded />
              </button>
            </fieldset>
          </form>
        </section>
      </section>
      <section className="mt-6 grid w-full grid-cols-3 gap-4 md:grid-cols-5">
        {isFetching
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
          onClick={() => setOffset((prev) => Math.max(0, prev - PAGE_SIZE))}
          disabled={offset === 0}
          className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${offset === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
        >
          <ChevronLeftRounded />
        </button>
        <button
          onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
          disabled={mediaList.length < PAGE_SIZE} // Disable if no more media
          className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 ${mediaList.length < PAGE_SIZE ? "cursor-not-allowed opacity-50" : "hover:bg-white hover:text-black"}`}
        >
          <ChevronRightRounded />
        </button>
      </section>
    </>
  );
}
