import { getRecentlyReviewed } from "@/api/media";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { TMedia } from "@/types/media";
import { useState, useEffect } from "react";

export function RecentlyReviewed() {
  const [media, setMedia] = useState<TMedia[]>([]);

  useEffect(() => {
    getRecentlyReviewed().then((data) => setMedia(data));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {media.map((item) => (
        <ThumbnailPreview key={item.id} media={item} />
      ))}
    </div>
  );
}
