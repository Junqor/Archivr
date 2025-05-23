import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { InspectDialog } from "./inspect-dialog";
import { TUserProfile } from "@/api/user";

interface DataTableProps {
  data: any[];
  selectedItems: Map<Number,TUserProfile>;
  onSelectItem: (user: TUserProfile) => void;
}

export function DataTable({
  data,
  selectedItems,
  onSelectItem,
}: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[50px]">Inspect</TableHead>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Avatar</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <>
          <InspectDialog user={item}>
            <button className="cursor-pointer absolute size-10 left-4 " onClick={(e)=>{e.stopPropagation()}}><Search className="hover:stroke-purple"/></button>
          </InspectDialog>
          <TableRow key={item.id} onClick={()=>{onSelectItem(item)}}>
            <TableCell></TableCell>
            <TableCell>
              {selectedItems.has(item.id) && <Check/>}
            </TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.displayName || item.username}</TableCell>
            <TableCell className="w-[50px]">
              <UserAvatar user={item} />
            </TableCell>
            <TableCell>{"@"+item.username}</TableCell>
            <TableCell>{item.role}</TableCell>
          </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
}
