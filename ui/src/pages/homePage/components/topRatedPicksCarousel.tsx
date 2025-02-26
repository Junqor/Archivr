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
      slidesPerViewMobile={3}
      slidesPerViewDesktop={6}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}
