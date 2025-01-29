import { getMostPopular } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { TMedia } from "@/types/media";
import { useEffect, useState } from "react";

export function MostPopularCarousel({ ...props }) {
  const [media, setMedia] = useState<TMedia[]>([]);

  useEffect(() => {
    getMostPopular().then((data) => setMedia(data));
  }, []);

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
