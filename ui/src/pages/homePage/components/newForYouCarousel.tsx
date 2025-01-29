import { getNewForYou } from "@/api/media";
import MediaCarousel from "@/components/MediaCarousel";
import { TMedia } from "@/types/media";
import { useState, useEffect } from "react";

export function NewForYouCarousel() {
  const [media, setMedia] = useState<TMedia[]>([]);

  const userId = JSON.parse(localStorage.getItem("user") ?? "{}").id;

  useEffect(() => {
    getNewForYou(userId).then((data) => setMedia(data));
  }, []);

  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={4}
      slidesPerViewDesktop={7}
      spaceBetweenMobile={8}
      spaceBetweenDesktop={16}
    />
  );
}
