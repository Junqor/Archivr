import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { ChevronDown } from "lucide-react";
import { TUserSettings } from "../settingsPage";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { addFavorite, removeFavorite, getFavorites } from "@/api/user";
import { getMediaBackground, searchMedias } from "@/api/media";
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
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";

interface MediaWithBackground {
  id: number;
  media_id?: number;
  title: string;
  thumbnail_url: string;
  rating: number;
  background?: string;
}

export function ProfileSettingsCategoryAppearance({
  updateSetting,
  settings,
}: {
  updateSetting: (key: keyof TUserSettings, value: string) => void;
  settings: TUserSettings;
}) {
  const { user } = useAuth();
  const username = user?.username;
  const [updatedFavorites, setUpdatedFavorites] = useState<
    MediaWithBackground[]
  >([]);
  const [searchResults, setSearchResults] = useState<MediaWithBackground[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOffset, setSearchOffset] = useState(1);

  const { data: favorites, refetch } = useQuery({
    queryKey: ["favorites", username],
    queryFn: () => getFavorites(username || ""),
  });

  useEffect(() => {
    if (favorites) {
      Promise.all(
        favorites.map(async (media: MediaWithBackground) => {
          const response = media.media_id
            ? await getMediaBackground(media.media_id)
            : null;
          return { ...media, background: response || "" };
        }),
      ).then(setUpdatedFavorites);
    }
  }, [favorites]);

  const handleFavoriteClick = async (media: MediaWithBackground) => {
    if (favorites && favorites.length >= 4) {
      toast.error("You can only have a maximum of 4 favorite media items");
      return;
    }
    try {
      await addFavorite(media.id || 0);
      refetch();
    } catch (error) {
      toast.error("Failed to add favorite");
    }
  };

  const handleRemoveFavorite = async (media: MediaWithBackground) => {
    await removeFavorite(media.media_id || 0);
    refetch();
  };

  const fetchSearchResults = async (query: string, newOffset: number) => {
    if (!query) return;
    const results = await searchMedias(query, 6, newOffset);
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
    setSearchOffset(1);
  }, [searchQuery]);

  useEffect(() => {
    debouncedSearch(searchQuery, searchOffset);
  }, [searchQuery, searchOffset]);

  return (
    <div className="flex flex-1 flex-col gap-2 self-stretch">
      <div className="flex flex-col items-start gap-2 self-stretch sm:flex-row">
        <div className="flex flex-col items-start justify-center gap-2 self-stretch sm:flex-1">
          <Label>Theme</Label>
          <Dropdown modal={false}>
            <DropdownTrigger className="w-full">
              <div className="flex min-h-9 w-full items-center justify-between gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2">
                <p className="text-base font-medium capitalize leading-normal">
                  {settings.theme || ""}
                </p>
                <ChevronDown />
              </div>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem
                onSelect={() => {
                  updateSetting("theme", "dark");
                }}
              >
                Dark
              </DropdownItem>
              <DropdownItem
                onSelect={() => {
                  updateSetting("theme", "light");
                }}
              >
                Light
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 self-stretch sm:flex-1">
          <Label>Font</Label>
          <Dropdown modal={false}>
            <DropdownTrigger className="w-full">
              <div className="flex min-h-9 w-full items-center justify-between gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2">
                <p className="text-base font-medium capitalize leading-normal">
                  {settings.font_size || ""}
                </p>
                <ChevronDown></ChevronDown>
              </div>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem
                onSelect={() => {
                  updateSetting("font_size", "small");
                }}
              >
                Small
              </DropdownItem>
              <DropdownItem
                onSelect={() => {
                  updateSetting("font_size", "normal");
                }}
              >
                Normal
              </DropdownItem>
              <DropdownItem
                onSelect={() => {
                  updateSetting("font_size", "large");
                }}
              >
                Large
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch">
        <div className="flex flex-col items-start gap-1 self-stretch">
          <h3>Favorite Media</h3>
          <Separator decorative />
        </div>
        <p className="text-muted">
          Click on a media item to remove it from the list. Click on an empty
          spot to add a media item to your favorites. You can have a maximum of
          4 favorite media items.
        </p>
        <div className="grid w-full grid-cols-2 gap-3">
          {updatedFavorites.map((media: MediaWithBackground) => (
            <div
              key={media.id}
              className="flex flex-[1-0-0] flex-col items-start gap-3"
              onClick={() => handleRemoveFavorite(media)}
            >
              <div
                className="flex aspect-video w-full flex-[1-0-0] flex-col items-start gap-3 rounded-sm bg-cover bg-center"
                style={{
                  backgroundImage: media.background
                    ? `url(${media.background})`
                    : "none",
                }}
              ></div>
              <p>{media.title}</p>
            </div>
          ))}
          {favorites?.length < 4 ? (
            <Dialog
              onOpenChange={(open) =>
                !open && setSearchQuery("") && setSearchResults([])
              }
            >
              <DialogTrigger className="flex aspect-video w-full items-center justify-center rounded-sm border-dashed bg-white/10 hover:bg-white/25">
                <h3>Add New Favorite</h3>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-[#111111AA]" />
                <DialogContent>
                  <div className="fixed bottom-1/2 left-1/2 right-1/2 top-1/2 z-50 flex h-min w-2/3 translate-x-[-50%] translate-y-[-50%] flex-col items-start gap-5 rounded-xl border border-white bg-black p-10">
                    <div className="flex flex-col items-center gap-3 self-stretch">
                      <div className="flex flex-col items-center gap-1">
                        <h1>Search Archivr</h1>
                        <p>
                          Type in a Movie or TV Show to find what you're looking
                          for.
                        </p>
                      </div>
                      <Input
                        placeholder="Start typing to see results"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-3/4 px-3 py-5"
                      />
                    </div>
                    {searchResults.length === 0 && <h2>No search results</h2>}
                    <div className="grid w-full grid-cols-3 gap-3">
                      {searchResults.map((media) => (
                        <div
                          key={media.id}
                          className="flex flex-col items-start gap-3"
                          onClick={() => handleFavoriteClick(media)}
                        >
                          <div
                            className="flex aspect-video w-full rounded-sm bg-muted bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${media.background})`,
                            }}
                          ></div>
                          <p>{media.title}</p>
                        </div>
                      ))}
                    </div>
                    {searchResults.length > 0 && searchOffset >= 1 && (
                      <div className="mt-4 flex w-full justify-center gap-3">
                        <button
                          onClick={() =>
                            setSearchOffset((prev) => Math.max(prev - 6, 1))
                          }
                          className="flex items-center gap-3"
                          disabled={searchOffset <= 1}
                        >
                          <div
                            className={`flex items-center justify-center rounded-md border p-1 transition-all duration-300 ${searchOffset <= 1 ? "cursor-not-allowed border-muted text-muted" : "hover:bg-white hover:text-black"}`}
                          >
                            <ChevronLeftRounded />
                          </div>
                          <h3
                            className={`${searchOffset <= 1 ? "text-muted" : "text-white"}`}
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
