import { getPopularAnime } from "@/api/popular";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function PopularAnimeCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["popularAnime"],
    queryFn: () => getPopularAnime(),
  });
  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={6}
      spaceBetweenMobile={12}
      spaceBetweenDesktop={24}
      {...props}
    />
  );
}
