import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Separator } from "@/components/ui/separator";

interface MediaGridProps {
  title: string;
  items: { id: number; title: string; thumbnail_url: string; rating: number }[];
  onViewAll?: () => void;
}

export default function MediaGrid({ title, items, onViewAll }: MediaGridProps) {
  if (!items.length) return null;

  return (
    <div className="flex w-full flex-col items-start gap-3 self-stretch">
      <div className="flex flex-col items-start gap-1 self-stretch">
        {onViewAll ? (
          <div className="flex w-full items-start justify-between gap-2 self-stretch">
            <h4 className="text-muted">{title}</h4>
            <button className="text-muted hover:underline" onClick={onViewAll}>
              <h4>See All</h4>
            </button>
          </div>
        ) : (
          <h4 className="text-muted">{title}</h4>
        )}
        <Separator orientation="horizontal" />
      </div>
      <div className="grid w-full grid-cols-4 items-start gap-3 self-stretch">
        {items.map((item) => (
          <ThumbnailPreview
            key={item.id}
            media={{
              id: item.id,
              title: item.title,
              thumbnail_url: item.thumbnail_url,
              rating: item.rating,
            }}
          />
        ))}
      </div>
    </div>
  );
}
