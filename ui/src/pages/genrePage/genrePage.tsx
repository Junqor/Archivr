import { useParams, Navigate } from "react-router-dom";
import { getGenres, getPopularMediaGenre } from "@/api/genre";
import HeroMediaCarousel from "./components/genreHeroCarousel";
import { useQuery } from "@tanstack/react-query";
import { TGenre } from "@/types/genre";

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

  // Now return JSX conditionally
  if (isGenresLoading) return <p>Loading genres...</p>;
  if (genresError) return <p>Error loading genres.</p>;
  if (!genreObj) return <Navigate to="/404" />;
  if (isMediaLoading) return <p>Loading media...</p>;
  if (mediaError) return <p>Error loading media.</p>;

  console.log(media);

  return (
    <section className="flex w-full flex-col justify-start gap-3">
      <section className="h-full">
        <HeroMediaCarousel media={media} />
      </section>
    </section>
  );
}
