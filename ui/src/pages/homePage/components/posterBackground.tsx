import { cn } from "@/lib/utils";
import { TMedia } from "@/types/media";

export const PostersBackground = ({
  media,
  className,
}: {
  media: TMedia[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute -left-8 right-0 top-20 z-0",
        "flex h-[250px] w-[120%] -skew-x-6 flex-wrap gap-3 overflow-hidden bg-transparent opacity-35 bg-blend-multiply sm:h-[300px]",
        className,
      )}
    >
      <div
        className="absolute bottom-0 h-full w-full"
        style={{
          background: `linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,1) 100%)`,
        }}
      />
      {media.slice(40).map((m) => (
        <div
          className="flex aspect-[17/25] max-w-[12%] overflow-hidden rounded-md sm:max-w-[8.5%] md:max-w-[7%] lg:max-w-[4.5%]"
          key={m.id}
        >
          <img src={m.thumbnail_url} width="680" height="1000" loading="lazy" />
        </div>
      ))}
    </div>
  );
};
