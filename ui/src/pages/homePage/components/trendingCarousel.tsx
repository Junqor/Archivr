import { getTrending } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function TrendingCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending(),
  });

  const trendingMoviesAndShows = media
    ? [...media.movies, ...media.shows]
    : undefined;

  return (
    <MediaCarousel
      media={trendingMoviesAndShows}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={6}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}
