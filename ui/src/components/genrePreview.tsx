import { getMediaBackground } from "@/api/media";
import { LoadingScreen } from "@/pages/loadingScreen";
import { useQuery } from "@tanstack/react-query";

export const GenrePreview = ({
  media,
}: {
  media: { genre: string; id: string; slug: string };
}) => {
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["genre-preview", media.genre],
    queryFn: () => getMediaBackground(parseInt(media.id)),
  });

  if (isLoading || isPending) return <LoadingScreen />;
  if (isError) throw 500;
  return (
    <div className="relative flex overflow-hidden">
      <img src={data} alt={media.genre} />
      <div className="absolute inset-0 h-full w-full items-center justify-center bg-black/30">
        <h2 className="text-2xl font-bold text-white">{media.genre}</h2>
      </div>
    </div>
  );
};
