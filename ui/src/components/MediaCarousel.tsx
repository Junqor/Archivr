import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel, Autoplay } from "swiper/modules";
import ThumbnailPreview from "./ThumbnailPreview";
import { TMedia } from "@/types/media";

import "swiper/css";
import "swiper/css/scrollbar";

interface MediaCarouselProps {
  media: TMedia[];
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
      scrollbar={{ draggable: true }}
      mousewheel={{
        forceToAxis: true,
      }}
      autoplay={{
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        600: {
          spaceBetween: spaceBetweenDesktop,
          slidesPerView: slidesPerViewDesktop,
        },
      }}
    >
      {media.map((m) => (
        <SwiperSlide key={m.id}>
          <ThumbnailPreview media={m} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
