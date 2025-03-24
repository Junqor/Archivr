import { getSimilarToWatched } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { TvRounded } from "@mui/icons-material";

export function SimilarCarousel() {
  const { user } = useAuth();
  const { data: returnData } = useQuery({
    queryKey: ["similarToWatched"],
    queryFn: () => getSimilarToWatched(user ? user.id : -1),
  });

  if (!returnData?.basedOn) {
    return null;
  }

  return (
    <>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center space-x-4">
          <TvRounded sx={{ fontSize: "1.71428571rem" }} />
          <h4>
            Because you watched{" "}
            <span className="font-bold">
              {returnData?.basedOn || "something"}
            </span>
            ...
          </h4>
        </div>
        <Separator />
        <section className="h-full">
          <MediaCarousel
            media={returnData?.media}
            slidesPerViewMobile={3}
            slidesPerViewDesktop={6}
            spaceBetweenMobile={12}
            spaceBetweenDesktop={24}
          />
        </section>
      </section>
    </>
  );
}
