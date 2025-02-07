import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel, Autoplay } from "swiper/modules";
import heroMedia from "./heroMedia";
import { TMedia } from "@/types/media";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/mousewheel";
import "swiper/css/autoplay";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroMediaCarouselProps {
  media: TMedia[] | undefined;
}

export default function HeroMediaCarousel({ media }: HeroMediaCarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Mousewheel, Autoplay]}
      slidesPerView={1}
      grabCursor={true}
      loop={true}
      navigation={{
        enabled: false,
      }}
      mousewheel={{
        forceToAxis: true,
      }}
      autoplay={{
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        640: {
          navigation: true,
        },
      }}
    >
      {media
        ? media.map((m) => (
            <SwiperSlide key={m.id}>{heroMedia({ media: m })}</SwiperSlide>
          ))
        : [...Array(5)].map((_, i) => (
            <SwiperSlide key={i} className="overflow-hidden">
              <Skeleton className="aspect-3/2 relative h-full w-full rounded-sm outline outline-1 -outline-offset-1 outline-white/10" />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}
