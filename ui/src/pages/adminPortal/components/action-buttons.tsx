import { addMedia, deleteMedia, editMedia } from "@/api/admin";
import { Button, ButtonProps } from "@/components/ui/button";
import { TMedia } from "@/types/media";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface ActionButtonsProps {
  selectedItem: TMedia | null;
  pageNumber: number;
  numResults: number;
}

export function ActionButtons({
  selectedItem,
  pageNumber,
  numResults,
}: ActionButtonsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const handleDelete = async () => {
    if (!selectedItem) return;
    await deleteMedia(selectedItem.id)
      .then(() => toast.success("Media deleted successfully"))
      .catch((err) => {
        toast.error("Error deleting media", err.message);
      });
    queryClient.invalidateQueries({ queryKey: ["adminSearch"] }); // Invalidate query to refetch data
  };

  const handleEdit = async (newData: Partial<TMedia>) => {
    if (!selectedItem) return;
    await editMedia(selectedItem.id, newData)
      .then(() => toast.success("Media updated successfully"))
      .catch((err) => {
        toast.error("Error updating media", err.message);
      });
    queryClient.invalidateQueries({ queryKey: ["adminSearch"] });
  };

  const handleAdd = async (newData: Partial<TMedia>) => {
    if (!selectedItem) return;
    await addMedia(newData)
      .then(() => toast.success("Media added successfully"))
      .catch((err) => toast.error("Error adding media", err.message));
    queryClient.invalidateQueries({ queryKey: ["adminSearch"] });
  };

  const handlePageUp = () => {
    searchParams.set("page", `${pageNumber + 10}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handlePageDown = () => {
    searchParams.set("page", `${pageNumber - 10}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="flex w-full space-x-2">
      <MediaForm media={selectedItem as TMedia} handleSave={handleEdit}>
        <Button variant="outline" size="icon" disabled={!selectedItem}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </MediaForm>
      <Button
        onClick={handleDelete}
        variant="outline"
        size="icon"
        disabled={!selectedItem}
        className="border-red-500 hover:border-white"
      >
        <Trash className="h-4 w-4 text-red-500" />
        <span className="sr-only">Delete</span>
      </Button>
      <MediaForm handleSave={handleAdd} media={null}>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button>
      </MediaForm>
      <Button
        variant="outline"
        size="icon"
        className="!ml-auto"
        disabled={pageNumber <= 1}
        onClick={handlePageDown}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={numResults < 10}
        onClick={handlePageUp}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

type MediaFormProps = {
  media: TMedia | null;
  handleSave: (newData: Partial<TMedia>) => Promise<void>;
} & ButtonProps;

function MediaForm({ children, handleSave, media }: MediaFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const updatedMedia: Partial<TMedia> = {
      title: form.get("title") as string,
      category: form.get("category") as string,
      description: form.get("description") as string,
      release_date: form.get("release_date") as string,
      age_rating: form.get("age_rating") as string,
      thumbnail_url: form.get("thumbnail_url") as string,
      genres: (form.get("genre") as string).split(","),
      rating: parseFloat(form.get("rating") as string),
    };

    await handleSave(updatedMedia);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>Edit media</DialogTitle>
            <DialogDescription>
              Make changes to the media here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="grid gap-4 py-4">
              {/* Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={media?.title}
                  className="col-span-3"
                />
              </div>
              {/* Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  name="category"
                  defaultValue={media?.category}
                  className="col-span-3"
                />
              </div>
              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={media?.description}
                  className="col-span-3"
                />
              </div>
              {/* Release Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="release-date" className="text-right">
                  Release Date
                </Label>
                <Input
                  id="release-date"
                  name="release_date"
                  defaultValue={
                    media
                      ? new Date(media.release_date).toISOString().slice(0, 10)
                      : ""
                  }
                  className="col-span-3"
                />
              </div>
              {/* Age Rating */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age-rating" className="text-right">
                  Age Rating
                </Label>
                <Input
                  id="age-rating"
                  name="age_rating"
                  defaultValue={media?.age_rating}
                  className="col-span-3"
                />
              </div>
              {/* Thumbnail URL */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnail-url" className="text-right">
                  Thumbnail URL
                </Label>
                <Input
                  id="thumbnail-url"
                  name="thumbnail_url"
                  defaultValue={media?.thumbnail_url}
                  className="col-span-3"
                />
              </div>
              {/* Genre */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="genre" className="text-right">
                  Genre
                </Label>
                <Input
                  id="genre"
                  name="genre"
                  defaultValue={media?.genres?.join(",")}
                  className="col-span-3"
                />
              </div>
              {/* Genre */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  defaultValue={media?.rating}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
}
