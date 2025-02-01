import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DeleteOutlineOutlined,
  OutlinedFlag,
  PersonAdd,
} from "@mui/icons-material";
import { EllipsisVertical } from "lucide-react";

export const ReviewKebab = () => {
  // ! Check user to show delete button
  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical className="size-5"></EllipsisVertical>
      </PopoverTrigger>
      <PopoverContent className="flex w-48 flex-col p-2" align="end">
        {true && (
          <>
            <Button
              variant="outline"
              className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
            >
              <DeleteOutlineOutlined className="mr-1" /> Delete Post
            </Button>
            <hr className="my-1 w-10/12 self-center justify-self-center" />
          </>
        )}
        <Button
          variant="outline"
          className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
        >
          <PersonAdd className="mr-1" /> {"Follow {username}"}
        </Button>
        <hr className="my-1 w-10/12 self-center justify-self-center" />
        <Button
          variant="outline"
          className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
        >
          <OutlinedFlag className="mr-1" /> Report Post
        </Button>
      </PopoverContent>
    </Popover>
  );
};
