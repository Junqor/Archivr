import { getTrending } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function TrendingCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending(),
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
