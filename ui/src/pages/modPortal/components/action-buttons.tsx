import { addMedia, deleteMedia, editMedia } from "@/api/admin";
import { Button, ButtonProps } from "@/components/ui/button";
import { TUser } from "@/types/user";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Gavel, Bird, ChevronLeft, ChevronRight } from "lucide-react";
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
  selectedItems: Map<Number,TUser>;
  pageNumber: number;
  numResults: number;
}

export function ActionButtons({
  selectedItems,
  pageNumber,
  numResults,
}: ActionButtonsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  /*
  const handleDelete = async () => {
    if (!selectedItems) return;
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
  */

  const handlePageUp = () => {
    searchParams.set("page", `${pageNumber + 1}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handlePageDown = () => {
    searchParams.set("page", `${pageNumber - 1}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="flex w-full space-x-2">
      <Button
        //onClick={handleDelete}
        title="Ban"
        variant="outline"
        size="icon"
        disabled={selectedItems.size === 0}
        className="border-red-500 hover:bg-red-500 hover:bg-opacity-50"
      >
        <Gavel className="h-4 w-4 text-red-500" />
        <span className="sr-only">Delete</span>
      </Button>
      <Button
        //onClick={handleDelete}
        title="Spare"
        variant="outline"
        size="icon"
        disabled={selectedItems.size === 0}
        className="border-white hover:bg-white hover:bg-opacity-50"
      >
        <Bird className="h-4 w-4 text-white" />
        <span className="sr-only">Delete</span>
      </Button>
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
