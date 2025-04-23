import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const ListDropdown = ({ className }: { className?: string }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [currList, setCurrList] = useState<string | undefined>("");
  const [key, setKey] = useState<number>(+new Date()); // to reset the select https://github.com/radix-ui/primitives/issues/1569#issuecomment-2509477747

  const { data } = useQuery(
    trpc.lists.getUsersMediaList.queryOptions(
      {
        mediaId: parseInt(id as string),
      },
      {
        enabled: !!user,
      },
    ),
  );

  const updateListMutation = useMutation(
    trpc.lists.updateMediaList.mutationOptions({
      onError: (e) => {
        toast.error(e.message);
      },
    }),
  );

  const removeFromListMutation = useMutation(
    trpc.lists.removeFromList.mutationOptions({
      onError: (e) => {
        toast.error(e.message);
      },
    }),
  );

  useEffect(() => {
    if (data) {
      setCurrList(data.list_name);
    }
  }, [data]);

  const handleAddToList = (listName: "completed" | "watching" | "planning") => {
    setCurrList(listName);
    updateListMutation.mutate({ mediaId: parseInt(id as string), listName });
  };

  const handleRemoveFromList = () => {
    setCurrList(undefined);
    setKey(+new Date());
    removeFromListMutation.mutate({ mediaId: parseInt(id as string) });
  };

  return (
    <Select
      value={currList}
      onValueChange={(v) => {
        handleAddToList(v as any);
      }}
      key={key}
    >
      <SelectTrigger
        className={cn(
          "justify-center border-none bg-primary p-1 capitalize focus:border focus:ring-0",
          className,
        )}
      >
        <SelectValue placeholder="Add to List" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="watching">Watching</SelectItem>
        <SelectItem value="planning">Plan To Watch</SelectItem>
        <button
          onClick={handleRemoveFromList}
          className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          disabled={!currList}
        >
          Remove From List
        </button>
      </SelectContent>
    </Select>
  );
};
