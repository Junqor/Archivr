import { getTopUserMedia, TUserRatedMedia } from "@/api/activity";
import { StarBadgeSVG } from "@/components/svg/starBadgeSVG";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { MediaPoster } from "../../../components/activityBox";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

type Palette = Awaited<ReturnType<typeof getColorPalette>>;

export function RankedUserMedia() {
  const { data } = useQuery({
    queryKey: ["activity", "top-user-media"],
    queryFn: () => getTopUserMedia(),
  });
  const [topUserMedia, setTopUserMedia] = useState<
    (TUserRatedMedia & { pallete: Palette })[] | null
  >(null);

  useEffect(() => {
    if (!data) return;
    const getColors = async () => {
      const media = await Promise.all(
        data.map(async (m) => {
          const pallete = await getColorPalette(m.thumbnail_url);
          return { ...m, pallete };
        }),
      );
      setTopUserMedia(media);
    };
    getColors();
  }, [data]);

  return topUserMedia ? (
    <div className="flex flex-row items-center gap-x-5 overflow-auto px-10 py-5 md:grid md:grid-cols-2 md:gap-3 md:overflow-hidden md:p-0">
      {topUserMedia.map((media, index) => (
        <div
          key={media.id}
          className="flex w-full flex-col justify-center gap-x-2 md:flex-row"
        >
          <div className="relative flex md:w-full">
            <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-9 items-center justify-center rounded-full font-extrabold leading-[2.25rem] md:size-16 md:leading-[2.75rem]">
              <StarBadgeSVG
                className="absolute z-10 size-14"
                fill={media.pallete.DarkVibrant}
              />
              <h4 className="absolute z-20 font-bold">#{index + 1}</h4>
            </div>
            <MediaPoster
              media={media}
              className="w-full min-w-28 max-w-28 rounded-lg md:ml-4 md:mt-4 md:min-w-0"
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-row items-center gap-x-5 overflow-auto px-10 py-5 md:grid md:grid-cols-2 md:gap-3 md:overflow-hidden md:p-0">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="aspect-2/3 h-40" />
      ))}
    </div>
  );
}

const getColorPalette = async (url: string | null) => {
  const c = "#5616EC";
  const defaultPalette = {
    Vibrant: c,
    DarkVibrant: c,
    LightVibrant: c,
    Muted: c,
    DarkMuted: c,
    LightMuted: c,
  };
  if (!url) return defaultPalette;

  const palette = await Vibrant.from(url).getPalette();

  if (!palette) return defaultPalette;

  const keys = Object.keys(defaultPalette) as Array<
    keyof typeof defaultPalette
  >;

  // Build the result by mapping keys to their respective hex value or defaultColor
  return keys.reduce(
    (acc, key) => {
      acc[key] = palette[key]?.hex ?? c;
      return acc;
    },
    {} as typeof defaultPalette,
  );
};
