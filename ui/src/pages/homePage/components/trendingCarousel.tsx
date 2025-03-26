import MediaCarousel, { MediaCarouselProps } from "@/components/MediaCarousel";

export function TrendingCarousel({
  media,
  ...props
}: Partial<MediaCarouselProps>) {
  return (
    <MediaCarousel
      media={media}
      slidesPerViewMobile={3}
      slidesPerViewDesktop={6}
      spaceBetweenMobile={12}
      spaceBetweenDesktop={24}
      {...props}
    />
  );
}
