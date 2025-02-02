import { getMostPopular } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";

export function MostPopularCarousel({ ...props }) {
  const { data: media } = useQuery({
    queryKey: ["mostPopular"],
    queryFn: () => getMostPopular(),
  });

  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={3}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
      {...props}
    />
  );
}
