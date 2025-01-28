import { getTrending } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { TMedia } from "@/types/media";
import { useEffect, useState } from "react";

export function TrendingCarousel({ ...props }) {
  const [media, setMedia] = useState<TMedia[]>([]);

  useEffect(() => {
    getTrending().then((data) => setMedia(data));
  }, []);

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
