import { getGenresFull } from "@/api/genre";
import { useQuery } from "@tanstack/react-query";
import { LoadingScreen } from "../loadingScreen";
import { GenrePreview } from "@/components/genrePreview";
import { Link } from "react-router-dom";

export const Genres = () => {
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["genresList"],
    queryFn: getGenresFull,
  });

  if (isLoading || isPending) return <LoadingScreen />;
  if (isError) throw 500;
  return (
    <main className="grid h-full w-full grid-cols-2 gap-5 md:grid-cols-3">
      {data.map((m) => (
        <Link to={`/genre/${m.slug}`} key={m.slug}>
          <GenrePreview media={m} />
        </Link>
      ))}
    </main>
  );
};
