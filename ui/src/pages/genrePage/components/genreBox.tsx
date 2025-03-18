import { getMediaBackground } from "@/api/media";
import { useQuery } from "@tanstack/react-query";

export const GenreBox = ({
  media,
}: {
  media: { genre: string; id: string; slug: string };
}) => {
  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["genre-preview", media.genre],
    queryFn: () => getMediaBackground(parseInt(media.id)),
  });

  if (isLoading || isPending) return <></>;
  if (isError) throw 500;
  return (
    <div className="relative flex overflow-hidden rounded-md border-[1px] border-white/75 transition-transform duration-300 ease-in-out hover:scale-105">
      <img src={data} alt={media.genre} />
      <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/30">
        <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
          {media.genre}
        </h2>
      </div>
    </div>
  );
};
