import { getRecommendedForYou } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";

export function RecommendedCarousel() {
  const { user } = useAuth();
  const { data: returnData } = useQuery({
    queryKey: ["recommendedForYou"],
    queryFn: () => getRecommendedForYou(user ? user.id : -1),
  });

  return (
    <MediaCarousel
      media={returnData}
      slidesPerViewMobile={4}
      slidesPerViewDesktop={7}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
    />
  );
}
