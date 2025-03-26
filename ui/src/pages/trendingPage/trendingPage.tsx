import { Separator } from "@/components/ui/separator";
import { Clapperboard, Tv } from "lucide-react";
import MediaCarousel from "@/components/MediaCarousel";
import { useQuery } from "@tanstack/react-query";
import { getTrending } from "@/api/media";
import { Link } from "react-router-dom";

export function TrendingPage() {
  const { data: media } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending(),
  });

  return (
    <main className="flex h-full w-full flex-col gap-y-5">
      <div className="w-full">
        <section className="flex flex-col items-center justify-center gap-3 md:items-start">
          <h1 className="font-bold">
            Explore
            <span className="bg-gradient-to-br from-blue-600 to-fuchsia-700 bg-clip-text font-extrabold text-transparent">
              {" "}
              Hot & Trending{" "}
            </span>
            Media This Week
          </h1>
        </section>
      </div>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex flex-row items-center gap-x-4">
          <Clapperboard />
          <h4>Trending movies</h4>
          <Link
            to="/trending/movies"
            className="ml-auto text-white/80 hover:underline"
          >
            View All
          </Link>
        </div>
        <Separator />
        <section className="h-full">
          <MediaCarousel
            media={media?.movies}
            slidesPerViewMobile={3}
            slidesPerViewDesktop={6}
            spaceBetweenMobile={12}
            spaceBetweenDesktop={24}
          />
        </section>
      </section>
      <section className="flex w-full flex-col justify-start gap-3">
        <div className="flex w-full flex-row items-center gap-x-4">
          <Tv />
          <h4>Trending shows</h4>
          <Link
            to="/trending/shows"
            className="ml-auto text-white/80 hover:underline"
          >
            View All
          </Link>
        </div>
        <Separator />
        <section className="h-full">
          <MediaCarousel
            media={media?.shows}
            slidesPerViewMobile={3}
            slidesPerViewDesktop={6}
            spaceBetweenMobile={12}
            spaceBetweenDesktop={24}
          />
        </section>
      </section>
    </main>
  );
}
