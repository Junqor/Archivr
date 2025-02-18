import { getPopularMovies } from "@/api/popular";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function PopularMoviesCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMovies(),
  });
  console.log(media);
  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={4}
      slidesPerViewDesktop={7}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}
