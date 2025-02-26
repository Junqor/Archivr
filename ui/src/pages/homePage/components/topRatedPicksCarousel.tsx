import { getTopRatedPicks } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function TopRatedPicksCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["top-rated-picks"],
    queryFn: () => getTopRatedPicks(),
  });

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
