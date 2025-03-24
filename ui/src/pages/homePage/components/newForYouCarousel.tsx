import { getNewForYou } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";

// ! Not used
export function NewForYouCarousel() {
  const { user } = useAuth();
  const { data: media } = useQuery({
    queryKey: ["newForYou"],
    queryFn: () => getNewForYou(user ? user.id : -1),
  });

  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={6}
      spaceBetweenMobile={12}
      spaceBetweenDesktop={24}
    />
  );
}
