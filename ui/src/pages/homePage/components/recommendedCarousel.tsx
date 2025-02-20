import { getRecommendedForYou } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { TvRounded } from "@mui/icons-material";

export function RecommendedCarousel() {
  const { user } = useAuth();
  const { data: returnData } = useQuery({
    queryKey: ["recommendedForYou"],
    queryFn: () => getRecommendedForYou(user ? user.id : -1),
  });

  return (
    <>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center space-x-4">
          <TvRounded sx={{ fontSize: "1.71428571rem" }} />
          <h4 className="uppercase">We think you'd love these...</h4>
        </div>
        <Separator />
        <section className="h-full">
          <MediaCarousel
            media={returnData}
            slidesPerViewMobile={4}
            slidesPerViewDesktop={7}
            spaceBetweenMobile={8}
            spaceBetweenDesktop={16}
          />
        </section>
      </section>
    </>
  );
}
