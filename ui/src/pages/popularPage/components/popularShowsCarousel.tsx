import { getPopularShows } from "@/api/popular";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function PopularShowsCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["popularShows"],
    queryFn: () => getPopularShows(),
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
