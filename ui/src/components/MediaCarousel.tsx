import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel, Autoplay } from "swiper/modules";
import ThumbnailPreview from "./ThumbnailPreview";
import { TMedia, TMediaStats } from "@/types/media";

import "swiper/css";
import "swiper/css/scrollbar";
import { Skeleton } from "./ui/skeleton";

export interface MediaCarouselProps {
  media: (TMedia & TMediaStats)[] | undefined;
  spaceBetweenMobile?: number;
  spaceBetweenDesktop: number;
  slidesPerViewMobile?: number;
  slidesPerViewDesktop: number;
}

export default function MediaCarousel({
  media,
  spaceBetweenMobile,
  spaceBetweenDesktop,
  slidesPerViewMobile,
  slidesPerViewDesktop,
}: MediaCarouselProps) {
  return (
    <Swiper
      modules={[Scrollbar, Mousewheel, Autoplay]}
      // Default to Mobile if not provided then Desktop
      spaceBetween={
        spaceBetweenMobile ? spaceBetweenMobile : spaceBetweenDesktop
      }
      slidesPerView={
        slidesPerViewMobile ? slidesPerViewMobile : slidesPerViewDesktop
      }
      grabCursor={true}
      scrollbar={{ draggable: false }}
      mousewheel={{
        forceToAxis: true,
      }}
      autoplay={{
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        640: {
          spaceBetween: spaceBetweenDesktop,
          slidesPerView: slidesPerViewDesktop,
        },
      }}
    >
      {media
        ? media.map((m) => (
            <SwiperSlide key={m.id}>
              <ThumbnailPreview media={m} />
            </SwiperSlide>
          ))
        : [...Array(7)].map((_, i) => (
            <SwiperSlide key={i} className="overflow-hidden">
              <Skeleton className="relative aspect-2/3 h-full w-full rounded-sm outline outline-1 -outline-offset-1 outline-white/10" />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}
