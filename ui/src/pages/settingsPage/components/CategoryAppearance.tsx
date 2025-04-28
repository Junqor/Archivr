/* ProfileSettingsCategoryAppearance.tsx */
import { Separator } from "@/components/ui/separator";
import { addFavorite, removeFavorite, getFavorites } from "@/api/user";
import { getMediaBackground, searchMediasFiltered } from "@/api/media";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  DeleteRounded,
  StarRounded,
} from "@mui/icons-material";
import { DialogClose } from "@/components/ui/dialog";

/* ➜ dnd-kit */
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getAuthHeader } from "@/utils/authHeader";
import { Button } from "@/components/ui/button";
import { Move } from "lucide-react";

interface MediaWithBackground {
  id: number;
  media_id?: number;
  title: string;
  thumbnail_url: string;
  rating: number;
  background?: string;
}

/* === Sortable item wrapper === */
function SortableFavorite({
  media,
  onRemove,
  index,
}: {
  media: MediaWithBackground;
  onRemove: (m: MediaWithBackground) => void;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-start gap-3"
    >
      <div
        className="group relative flex aspect-video w-full overflow-hidden rounded-sm bg-cover bg-center"
        style={{
          backgroundImage: media.background
            ? `url(${media.background})`
            : "none",
        }}
      >
        {/* Star icon for profile background */}
        {index === 0 && (
          <div
            className="absolute z-20 flex h-fit w-fit bg-primary"
            title="This is used as your profile background"
          >
            <StarRounded />
          </div>
        )}
        <Button
          className="absolute right-0 top-0 z-20 h-fit w-fit rounded-none p-1 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onRemove(media)}
          variant="destructive"
        >
          <DeleteRounded />
        </Button>
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
          <p className="inline-flex items-center gap-2 text-xl font-bold">
            Drag <Move className="size-5" />
          </p>
        </div>
      </div>
      <p>{media.title}</p>
    </div>
  );
}

export function ProfileSettingsCategoryAppearance() {
  const { user } = useAuth();
  const username = user?.username;

  const [updatedFavorites, setUpdatedFavorites] = useState<
    MediaWithBackground[]
  >([]);
  const [searchResults, setSearchResults] = useState<MediaWithBackground[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOffset, setSearchOffset] = useState(0);

  const { data: favorites, refetch } = useQuery({
    queryKey: ["favorites", username],
    queryFn: () => getFavorites(username || ""),
  });

  /* fetch & decorate favorites */
  useEffect(() => {
    if (!favorites) return;
    Promise.all(
      favorites.map(async (m: MediaWithBackground) => ({
        ...m,
        background: m.media_id ? await getMediaBackground(m.media_id) : "",
      })),
    ).then(setUpdatedFavorites);
  }, [favorites]);

  /* sensors for dnd-kit */
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  /* when a drag ends reorder locally and persist in db */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setUpdatedFavorites((cur) => {
      const oldIndex = cur.findIndex((x) => x.id === active.id);
      const newIndex = cur.findIndex((x) => x.id === over.id);

      /* 1️⃣ reorder first */
      const reordered = arrayMove(cur, oldIndex, newIndex);

      /* 2️⃣ find where the moved item ended up */
      const movedIndex = reordered.findIndex((x) => x.id === active.id);
      const prev = reordered[movedIndex - 1]?.id ?? null;
      const next = reordered[movedIndex + 1]?.id ?? null;

      /* 3️⃣ persist */
      fetch(import.meta.env.VITE_API_URL + "/user/favorites/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          movedId: active.id,
          prevId: prev,
          nextId: next,
        }),
      }).catch(() => toast.error("Re-order failed"));

      return reordered;
    });
  }

  /* add / remove favorite helpers */
  const handleFavoriteClick = async (media: MediaWithBackground) => {
    try {
      await addFavorite(media.id || 0);
      refetch();
    } catch {
      toast.error("Failed to add favorite");
    }
  };

  const handleRemoveFavorite = async (media: MediaWithBackground) => {
    await removeFavorite(media.media_id || 0);
    refetch();
  };

  /* search helpers */
  const fetchSearchResults = async (query: string, newOffset: number) => {
    if (!query) return;
    const results = await searchMediasFiltered(query, 6, newOffset);
    const mediaWithBackground = await Promise.all(
      results.map(async (media: MediaWithBackground) => {
        const background = await getMediaBackground(media.id);
        return { ...media, background };
      }),
    );
    setSearchResults(mediaWithBackground);
  };

  const debouncedSearch = useDebouncedCallback((query, newOffset) => {
    fetchSearchResults(query, newOffset);
  }, 500);

  useEffect(() => {
    setSearchOffset(0);
  }, [searchQuery]);

  useEffect(() => {
    debouncedSearch(searchQuery, searchOffset);
  }, [searchQuery, searchOffset]);

  /* ---------- JSX ---------- */
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-1">
          <h4>Favorite Media</h4>
          <Separator decorative />
        </div>
        <p className="text-muted">
          Drag to reorder. The first one is used as your profile's background.
          Click an empty slot to add a new favorite.
        </p>

        {/* ➜ dnd context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            /* keys array matters to dnd-kit */
            items={updatedFavorites.map((m) => m.id)}
            strategy={rectSortingStrategy} /* good for grids */
          >
            <div className="grid w-full grid-cols-2 gap-3">
              {updatedFavorites.map((media, index) => (
                <SortableFavorite
                  key={media.id}
                  media={media}
                  onRemove={handleRemoveFavorite}
                  index={index}
                />
              ))}

              {/* ----- “Add new favorite” button & dialog (unchanged) ----- */}
              <Dialog
                onOpenChange={(open) => {
                  if (!open) {
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
              >
                <DialogTrigger className="flex aspect-video w-full items-center justify-center rounded-sm border-dashed bg-black/10 hover:bg-black/25 dark:bg-white/10 dark:hover:bg-white/25">
                  <h3>Add New Favorite</h3>
                </DialogTrigger>
                <DialogPortal>
                  <DialogOverlay className="fixed inset-0 bg-[#111111AA]" />{" "}
                  <DialogContent>
                    <div className="fixed bottom-1/2 left-1/2 right-1/2 top-1/2 z-50 flex h-min w-10/12 translate-x-[-50%] translate-y-[-50%] flex-col items-start gap-5 rounded-xl border border-white bg-black p-6 sm:w-2/3 sm:p-10">
                      <div className="flex flex-col items-center gap-3 self-stretch">
                        <div className="flex flex-col items-center gap-1">
                          <h1>Search Archivr</h1>
                          <p>
                            Type in a Movie or TV Show to find what you're
                            looking for.
                          </p>
                        </div>
                        <Input
                          placeholder="Start typing to see results"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-2 py-3 sm:w-3/4 sm:px-3 sm:py-5"
                        />
                      </div>
                      {searchResults.length === 0 && <h2>No search results</h2>}
                      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                        {searchResults.map((media) => (
                          <DialogClose>
                            <div
                              key={media.id}
                              className="flex flex-col items-start gap-3"
                              onClick={() => handleFavoriteClick(media)}
                            >
                              <img
                                className="flex aspect-video w-full cursor-pointer rounded-sm bg-muted bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-105"
                                height="1080"
                                width="1920"
                                src={media.background}
                              />
                              <p>{media.title}</p>
                            </div>
                          </DialogClose>
                        ))}
                      </div>
                      {searchResults.length > 0 && (
                        <div className="mt-4 flex w-full justify-center gap-3">
                          <button
                            onClick={() =>
                              setSearchOffset((prev) => Math.max(prev - 6, 0))
                            }
                            className="flex items-center gap-3"
                            disabled={searchOffset <= 0}
                          >
                            <div
                              className={`flex items-center justify-center rounded-md border p-1 transition-all duration-300 ${searchOffset <= 1 ? "cursor-not-allowed border-muted text-muted" : "hover:bg-white hover:text-black"}`}
                            >
                              <ChevronLeftRounded />
                            </div>
                            <h3
                              className={`${searchOffset <= 0 ? "cursor-not-allowed text-muted" : "text-white"}`}
                            >
                              Previous
                            </h3>
                          </button>
                          <Separator
                            orientation="vertical"
                            className="h-auto"
                            decorative
                          />
                          <button
                            onClick={() => setSearchOffset((prev) => prev + 6)}
                            className="flex items-center gap-3"
                            disabled={searchResults.length < 6}
                          >
                            <h3 className="text-white">Next</h3>
                            <div className="flex items-center justify-center rounded-md border p-1 transition-all duration-300 hover:bg-white hover:text-black">
                              <ChevronRightRounded />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
