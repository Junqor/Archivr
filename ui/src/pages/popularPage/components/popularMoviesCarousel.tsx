import { getPopularMovies } from "@/api/popular";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function PopularMoviesCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMovies(),
  });
  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={6}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}
